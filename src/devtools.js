import {WebSocket} from "ws";

export function fetchNodeDetails() {
    return fetch("http://localhost:9229/json");
}

export function fetchNodeProtocolDetails() {
    return fetch("http://localhost:9229/json/protocol");
}

export class DevToolsClient {
    #ws;
    #id = 0;
    #callbacks = new Map();
    constructor(url) {
        this.#ws = new WebSocket(url);
    }

    newMessage(method, params) {
        return {
            id: this.#id++,
            method,
            params
        };
    }

    static async create(url) {
        const client = new this(url);
        client.#ws.on('message', function onMessage(data) {
            const {method, params} = JSON.parse(data);
            if (method) {
                client.#callbacks.get(method)?.(params);
            }
        });
        return new Promise((resolve, reject) => {
            function cleanup() {
                client.#ws.off('open', onOpen);
                client.#ws.off('error', onError);
            }
            function onOpen () {
                cleanup();
                resolve(client);
            }
            function onError(error) {
                cleanup();
                reject(error);
            }
            client.#ws.on('open', onOpen);
            client.#ws.on('error', onError);
        });
    }

    on(method, callback) {
        this.#callbacks.set(method, callback);
    }

    post(method, params) {
        const message = this.newMessage(method, params);
        const ws = this.#ws;
        const promise = new Promise((resolve, reject) => {
            ws.on('message', function onMessage(data) {
                const response = JSON.parse(data);
                if (response.id === message.id) {
                    ws.off('message', onMessage);
                    ws.off('error', onMessage)
                    resolve(response);
                }
            });
            ws.on('error', function onMessage(data) {
                const response = JSON.parse(data);
                if (response.id === message.id) {
                    ws.off('message', onMessage);
                    ws.off('error', onMessage);
                    reject(response);
                }
            });
        });
        this.#ws.send(JSON.stringify(message));
        return promise;
    }

    close() {
        this.#ws.close();
    }

    terminate() {
        this.#ws.terminate();
    }
}