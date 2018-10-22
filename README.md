# `fs-server`

`fs-server` is a drop-in replacement for `fs` designed for the browser that delegates all `fs` operations to a node server. It lets you use `fs` in the browser, and it works the same way it does in node.

## Usage

* In node, create and run an fs server:

```js
const createFsServer = require("fs-server/createFsServer");

// createFsServer returns a net.Server
const server = createFsServer();

server.listen(3000, () => {
  console.log("fs-server server is listening on port 3000");
});
```

* In the browser, create an `fs` object pointing to your server:

```js
const createFsClient = require("fs-server/createFsClient");

const fs = createFsClient("http://localhost:3000");
```

* Use the `fs` object normally:

```js
console.log(fs.readFileSync("./package.json"));
```

## How it works

All the methods on the `fs` object returned by `createFsClient` use XHRs and/or WebSockets to communicate with the server and run the `fs` code matching what you ran on the client on the server. Synchronous XHRs are used when necessary to make synchronous `fs` operations work.

## License

MIT
