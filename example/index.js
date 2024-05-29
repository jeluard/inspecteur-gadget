import {isMainThread, Worker} from "node:worker_threads";

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function call() {
    return crypto.getRandomValues(new Uint8Array(20)).toString('base64');
  }

  function heavy() {
    call();
    for (let i = 0; i < 1000000; i++) {
      Math.random();
    }
  }

if (isMainThread) {
  new Worker('./example/index.js');
}

while (1) {
    console.log(`Ping ! ${isMainThread ? 'Main' : 'Worker'}`);
    heavy();
    await sleep(5000)
}