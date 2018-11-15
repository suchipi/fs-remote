# `fs-remote`

`fs-remote` is a drop-in replacement for Node.js's `fs` module, designed for web browsers. It delegates all `fs` calls to a node server. tl;dr it lets you use a real `fs` module in the browser.

## Usage

* In node, create and run an `fs-remote` server:

```js
const createServer = require("fs-remote/createServer");

// createServer returns a net.Server
const server = createServer();

server.listen(3000, () => {
  console.log("fs-remote server is listening on port 3000");
});
```

* In the browser, load `fs-remote`'s `createClient` function:

  * If you are using `webpack` or `browserify`, you can use `require`:

  ```js
  const createClient = require("fs-remote/createClient");
  ```

  * Otherwise, you can use a script tag and find `createClient` on the global `fsRemote` varaible:

  ```html
  <script src="https://unpkg.com/fs-remote@0.1.9/dist/umd.js"></script>
  ```

  ```js
  const createClient = fsRemote.createClient;
  ```

* In the browser, use `createClient` to create an `fs` object pointing to your `fs-remote` server:

```js
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
* `fs.writeFile`
* `fs.writeFileSync`
* `fs.writeSync`
* `fs.FSWatcher`
* `fs.Stats`

## Notes

The server supports CORS (Cross-Origin Resource Sharing) by default. To disable CORS, pass `{ cors: false }` when constructing the server:

```js
const createServer = require("fs-remote/createServer");

// createServer returns a net.Server
const server = createServer({ cors: false });
```

## Examples

Check the [`examples` folder](https://github.com/suchipi/fs-remote/tree/master/examples) for examples.

## License

MIT
