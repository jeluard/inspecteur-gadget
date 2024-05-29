A CLI based utility allowing to script in JavaScript [DevTools Protocol]() interactions.
Common use-cases include generating augmented profiler sessions.

See some bundled [scripts](./scripts).

```bash
# Start a node with inspector enabled
node --inspect example/index.js

## Start `inspecteur-gadget`
npx inspecteur-gadget scripts/profiler.js
```