# `fs-remote`

`fs-remote` is a drop-in replacement for `fs` designed for the browser that delegates all `fs` operations to a node server. It lets you use `fs` in the browser, and it works the same way it does in node.

## Usage

* In node, create and run an fs server:

```js
const createServer = require("fs-remote/createServer");

// createServer returns a net.Server
const server = createServer();

server.listen(3000, () => {
  console.log("fs-remote server is listening on port 3000");
});
```

* In the browser, create an `fs` object pointing to your server:

```js
const createClient = require("fs-remote/createClient");

const fs = createClient("http://localhost:3000");
```

* Use the `fs` object normally:

```js
console.log(fs.readFileSync("./package.json"));
```

## How it works

All the methods on the `fs` object returned by `createClient` use XHRs and/or WebSockets to communicate with the server and run the `fs` code matching what you ran on the client on the server. Synchronous XHRs are used when necessary to make synchronous `fs` operations work.

## License

MIT
