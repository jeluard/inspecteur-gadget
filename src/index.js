import {readFileSync} from 'node:fs';
import {Script, constants, createContext} from 'node:vm';
import {DevToolsClient} from './devtools.js';

const [instance] = await fetch("http://localhost:9229/json").then(res => res.json());
const client = await DevToolsClient.create(instance.webSocketDebuggerUrl);
const scriptPath = process.argv[2];
const data = readFileSync(scriptPath, 'utf8');
const script = new Script(data, {importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER});

const context = {client, console};
createContext(context);
const fn = script.runInContext(context);

process.on('SIGINT', async() => {
  await fn();
  client.close();
});