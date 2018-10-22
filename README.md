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

// Pass in the URL to the server you created
const fs = createClient("http://localhost:3000");
```

* Use the `fs` object normally:

```js
console.log(fs.readFileSync("./package.json"));
```

## How it works

All the methods on the `fs` object returned by `createClient` use XHRs and/or WebSockets to communicate with the server and run the `fs` code matching what you ran on the client on the server. Synchronous XHRs are used when necessary to make synchronous `fs` operations work.

## Supported APIs

* `fs.access`
* `fs.accessSync`
* `fs.appendFile`
* `fs.appendFileSync`
* `fs.chmod`
* `fs.chmodSync`
* `fs.chown`
* `fs.chownSync`
* `fs.close`
* `fs.closeSync`
* `fs.constants`
* `fs.copyFile`
* `fs.copyFileSync`
* `fs.createReadStream`
* `fs.createWriteStream`
* `fs.exists`
* `fs.existsSync`
* `fs.fchmod`
* `fs.fchmodSync`
* `fs.fchown`
* `fs.fchownSync`
* `fs.fdatasync`
* `fs.fdatasyncSync`
* `fs.fstat`
* `fs.fstatSync`
* `fs.fsync`
* `fs.fsyncSync`
* `fs.ftruncate`
* `fs.ftruncateSync`
* `fs.futimes`
* `fs.futimesSync`
* `fs.lchmod`
* `fs.lchmodSync`
* `fs.lchown`
* `fs.lchownSync`
* `fs.link`
* `fs.linkSync`
* `fs.lstat`
* `fs.lstatSync`
* `fs.mkdir`
* `fs.mkdirSync`
* `fs.mkdtemp`
* `fs.mkdtempSync`
* `fs.open`
* `fs.openSync`
* `fs.read`
* `fs.readFile`
* `fs.readFileSync`
* `fs.readSync`
* `fs.readdir`
* `fs.readdirSync`
* `fs.readlink`
* `fs.readlinkSync`
* `fs.realpath`
* `fs.realpathSync`
* `fs.rename`
* `fs.renameSync`
* `fs.rmdir`
* `fs.rmdirSync`
* `fs.stat`
* `fs.statSync`
* `fs.symlink`
* `fs.symlinkSync`
* `fs.truncate`
* `fs.truncateSync`
* `fs.unlink`
* `fs.unlinkSync`
* `fs.unwatchFile`
* `fs.utimes`
* `fs.utimesSync`
* `fs.watch`
* `fs.watchFile`
* `fs.write`

## License

MIT
