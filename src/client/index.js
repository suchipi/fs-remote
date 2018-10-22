const createClient = require("run-on-server/client");
const websocketStreamClient = require("websocket-stream");
const EventEmitter = require("events");
const { simpleMethods, specialMethods } = require("../shared/defs");

function unpify(promise, callback) {
  promise
    .then(result => {
      callback(null, result);
    })
    .catch(err => {
      callback(err, null);
    });
}

function getArgsAndAsyncCallback(args) {
  let callback;
  if (typeof args[args.length - 1] !== "function") {
    console.warn(
      "(node:6500) [DEP0013] DeprecationWarning: Calling an asynchronous function without callback is deprecated."
    );
    callback = () => {};
  } else {
    callback = args.pop();
  }

  return { args, callback };
}

module.exports = function createFs(serverUrl) {
  const runOnServer = createClient(serverUrl);

  function asyncFn(name) {
    const retFn = (...passedArgs) => {
      const { args, callback } = getArgsAndAsyncCallback(passedArgs);
      simpleMethods[name].args.assert(args);

      unpify(
        runOnServer(
          (name, serializedArgs) => {
            const fs = require("fs");
            const pify = require("pify");
            const { simpleMethods } = require("../shared/defs");
            const args = simpleMethods[name].args.deserialize(serializedArgs);

            const fsp = pify(fs);
            return fsp[name](...args).then(result => {
              return simpleMethods[name].result.serialize(result);
            });
          },
          [name, simpleMethods[name].args.serialize(args)]
        ).then(result => {
          return simpleMethods[name].result.deserialize(result);
        }),
        callback
      );
    };
    Object.defineProperty(retFn, "name", {
      writable: false,
      enumerable: false,
      configurable: true,
      value: name
    });
    return retFn;
  }

  function syncFn(name) {
    const retFn = (...args) => {
      simpleMethods[name].args.assert(args);

      const result = runOnServer.sync(
        (name, serializedArgs) => {
          const fs = require("fs");
          const { simpleMethods } = require("../shared/defs");
          const args = simpleMethods[name].args.deserialize(serializedArgs);

          const result = fs[name](...args);
          return simpleMethods[name].result.serialize(result);
        },
        [name, simpleMethods[name].args.serialize(args)]
      );
      return simpleMethods[name].result.deserialize(result);
    };
    Object.defineProperty(retFn, "name", {
      writable: false,
      enumerable: false,
      configurable: true,
      value: name
    });
    return retFn;
  }

  const fs = {};
  Object.entries(simpleMethods).forEach(([name, { sync }]) => {
    fs[name] = sync ? syncFn(name) : asyncFn(name);
  });

  fs.constants = {
    O_RDONLY: 0,
    O_WRONLY: 1,
    O_RDWR: 2,
    S_IFMT: 61440,
    S_IFREG: 32768,
    S_IFDIR: 16384,
    S_IFCHR: 8192,
    S_IFBLK: 24576,
    S_IFIFO: 4096,
    S_IFLNK: 40960,
    S_IFSOCK: 49152,
    O_CREAT: 512,
    O_EXCL: 2048,
    O_NOCTTY: 131072,
    O_TRUNC: 1024,
    O_APPEND: 8,
    O_DIRECTORY: 1048576,
    O_NOFOLLOW: 256,
    O_SYNC: 128,
    O_DSYNC: 4194304,
    O_SYMLINK: 2097152,
    O_NONBLOCK: 4,
    S_IRWXU: 448,
    S_IRUSR: 256,
    S_IWUSR: 128,
    S_IXUSR: 64,
    S_IRWXG: 56,
    S_IRGRP: 32,
    S_IWGRP: 16,
    S_IXGRP: 8,
    S_IRWXO: 7,
    S_IROTH: 4,
    S_IWOTH: 2,
    S_IXOTH: 1,
    F_OK: 0,
    R_OK: 4,
    W_OK: 2,
    X_OK: 1,
    UV_FS_COPYFILE_EXCL: 1,
    COPYFILE_EXCL: 1
  };

  fs.exists = function exists(...passedArgs) {
    const { args, callback } = getArgsAndAsyncCallback(passedArgs);
    specialMethods.exists.args.assert(args);

    runOnServer(
      serializedArgs => {
        const fs = require("fs");
        const { specialMethods } = require("../shared/defs");
        const args = specialMethods.exists.args.deserialize(serializedArgs);

        return new Promise(resolve => {
          fs.exists(...args, exists => {
            resolve(exists);
          });
        });
      },
      [specialMethods.exists.args.serialize(args)]
    ).then(result => {
      callback(result);
    });
  };

  fs.createReadStream = function createReadStream(...args) {
    specialMethods.createReadStream.args.assert(args);

    const websocketUrl = runOnServer.sync(
      serializedArgs => {
        const fs = require("fs");
        const websocketStreamServer = require("websocket-stream/stream");
        const createSocketUrl = require("run-on-server/socket");
        const { specialMethods } = require("../shared/defs");
        const args = specialMethods.createReadStream.args.deserialize(
          serializedArgs
        );

        return createSocketUrl(socket => {
          const readStream = fs.createReadStream(...args);
          const socketStream = websocketStreamServer(socket, { binary: true });
          readStream.pipe(socketStream);
        });
      },
      [specialMethods.createReadStream.args.serialize(args)]
    );

    return websocketStreamClient(websocketUrl);
  };

  fs.createWriteStream = function createWriteStream(...args) {
    specialMethods.createWriteStream.args.assert(args);

    const websocketUrl = runOnServer.sync(
      serializedArgs => {
        const fs = require("fs");
        const websocketStreamServer = require("websocket-stream/stream");
        const createSocketUrl = require("run-on-server/socket");
        const { specialMethods } = require("../shared/defs");
        const args = specialMethods.createWriteStream.args.deserialize(
          serializedArgs
        );

        return createSocketUrl(socket => {
          const writeStream = fs.createWriteStream(...args);
          const socketStream = websocketStreamServer(socket, { binary: true });
          socketStream.pipe(writeStream);
        });
      },
      [specialMethods.createWriteStream.args.serialize(args)]
    );

    return websocketStreamClient(websocketUrl);
  };

  class Stats {
    constructor(data) {
      this.dev = data.dev;
      this.ino = data.ino;
      this.mode = data.mode;
      this.nlink = data.nlink;
      this.uid = data.uid;
      this.gid = data.gid;
      this.rdev = data.rdev;
      this.size = data.size;
      this.blksize = data.blksize;
      this.blocks = data.blocks;
      this.atimeMs = data.atimeMs;
      this.mtimeMs = data.mtimeMs;
      this.ctimeMs = data.ctimeMs;
      this.birthtimeMs = data.birthtimeMs;
      this.atime = new Date(data.atime);
      this.mtime = new Date(data.mtime);
      this.ctime = new Date(data.ctime);
      this.birthtime = new Date(data.birthtime);

      this._isBlockDevice = data._isBlockDevice;
      this._isCharacterDevice = data._isCharacterDevice;
      this._isDirectory = data._isDirectory;
      this._isFIFO = data._isFIFO;
      this._isFile = data._isFile;
      this._isSocket = data._isSocket;
      this._isSymbolicLink = data._isSymbolicLink;
    }

    isBlockDevice() {
      return this._isBlockDevice;
    }

    isCharacterDevice() {
      return this._isCharacterDevice;
    }

    isDirectory() {
      return this._isDirectory;
    }

    isFIFO() {
      return this._isFIFO;
    }

    isFile() {
      return this._isFile;
    }

    isSocket() {
      return this._isSocket;
    }

    isSymbolicLink() {
      return this._isSymbolicLink;
    }
  }

  fs.Stats = Stats;

  function asyncStatFn(name) {
    const retFn = (...passedArgs) => {
      const { args, callback } = getArgsAndAsyncCallback(passedArgs);
      specialMethods[name].args.assert(args);

      return unpify(
        runOnServer(
          (name, serializedArgs) => {
            const fs = require("fs");
            const pify = require("pify");
            const { specialMethods } = require("../shared/defs");
            const args = specialMethods[name].args.deserialize(serializedArgs);

            const fsp = pify(fs);
            return fsp[name](...args).then(stats => {
              return Object.assign({}, stats, {
                _isBlockDevice: stats.isBlockDevice(),
                _isCharacterDevice: stats.isCharacterDevice(),
                _isDirectory: stats.isDirectory(),
                _isFIFO: stats.isFIFO(),
                _isFile: stats.isFile(),
                _isSocket: stats.isSocket(),
                _isSymbolicLink: stats.isSymbolicLink()
              });
            });
          },
          [name, specialMethods[name].args.serialize(args)]
        ).then(data => {
          return new fs.Stats(data);
        }),
        callback
      );
    };
    Object.defineProperty(retFn, "name", {
      writable: false,
      enumerable: false,
      configurable: true,
      value: name
    });
    return retFn;
  }

  function syncStatFn(name) {
    const retFn = (...args) => {
      specialMethods[name].args.assert(args);

      const data = runOnServer.sync(
        (name, serializedArgs) => {
          const fs = require("fs");
          const { specialMethods } = require("../shared/defs");
          const args = specialMethods[name].args.deserialize(serializedArgs);

          const stats = fs[name](...args);
          return Object.assign({}, stats, {
            _isBlockDevice: stats.isBlockDevice(),
            _isCharacterDevice: stats.isCharacterDevice(),
            _isDirectory: stats.isDirectory(),
            _isFIFO: stats.isFIFO(),
            _isFile: stats.isFile(),
            _isSocket: stats.isSocket(),
            _isSymbolicLink: stats.isSymbolicLink()
          });
        },
        [name, specialMethods[name].args.serialize(args)]
      );
      return new fs.Stats(data);
    };
    Object.defineProperty(retFn, "name", {
      writable: false,
      enumerable: false,
      configurable: true,
      value: name
    });
    return retFn;
  }

  fs.fstat = asyncStatFn("fstat");
  fs.fstatSync = syncStatFn("fstatSync");
  fs.lstat = asyncStatFn("lstat");
  fs.lstatSync = syncStatFn("lstatSync");

  fs.read = function read(...passedArgs) {
    const { args, callback } = getArgsAndAsyncCallback(passedArgs);
    specialMethods.read.args.assert(args);

    runOnServer(
      serializedArgs => {
        const fs = require("fs");
        const { specialMethods } = require("../shared/defs");
        const args = specialMethods.read.args.deserialize(serializedArgs);

        return new Promise((resolve, reject) => {
          fs.read(...args, (err, bytesRead, buffer) => {
            if (err) {
              reject(err);
              return;
            } else {
              resolve(
                specialMethods.read.result.serialize({ bytesRead, buffer })
              );
            }
          });
        });
      },
      [specialMethods.read.args.serialize(args)]
    )
      .then(serializedResult => {
        const { bytesRead, buffer } = specialMethods.read.result.deserialize(
          serializedResult
        );
        callback(null, bytesRead, buffer);
      })
      .catch(err => {
        callback(err, null, null);
      });
  };

  fs.realpath.native = function native(...passedArgs) {
    const { args, callback } = getArgsAndAsyncCallback(passedArgs);
    simpleMethods.realpath.args.assert(args);

    unpify(
      runOnServer(
        serializedArgs => {
          const fs = require("fs");
          const pify = require("pify");
          const { simpleMethods } = require("../shared/defs");
          const args = simpleMethods.realpath.args.deserialize(serializedArgs);

          return pify(fs.realpath.native)(...args).then(result => {
            return simpleMethods.realpath.result.serialize(result);
          });
        },
        [simpleMethods.realpath.args.serialize(args)]
      ).then(result => {
        return simpleMethods.realpath.result.deserialize(result);
      }),
      callback
    );
  };

  fs.realpathSync.native = function native(...passedArgs) {
    const { args, callback } = getArgsAndAsyncCallback(passedArgs);
    simpleMethods.realpathSync.args.assert(args);

    unpify(
      runOnServer(
        serializedArgs => {
          const fs = require("fs");
          const pify = require("pify");
          const { simpleMethods } = require("../shared/defs");
          const args = simpleMethods.realpathSync.args.deserialize(
            serializedArgs
          );

          return pify(fs.realpathSync.native)(...args).then(result => {
            return simpleMethods.realpathSync.result.serialize(result);
          });
        },
        [simpleMethods.realpathSync.args.serialize(args)]
      ).then(result => {
        return simpleMethods.realpathSync.result.deserialize(result);
      }),
      callback
    );
  };

  fs.stat = asyncStatFn("stat");
  fs.statSync = syncStatFn("statSync");

  fs.write = function write(...passedArgs) {
    const { args, callback } = getArgsAndAsyncCallback(passedArgs);
    specialMethods.write.args.assert(args);

    runOnServer(
      serializedArgs => {
        const fs = require("fs");
        const { specialMethods } = require("../shared/defs");
        const args = specialMethods.write.args.deserialize(serializedArgs);

        return new Promise((resolve, reject) => {
          fs.write(...args, (err, bytesWritten, bufferOrString) => {
            if (err) {
              reject(err);
              return;
            } else {
              resolve(
                specialMethods.write.result.serialize({
                  bytesWritten,
                  bufferOrString
                })
              );
            }
          });
        });
      },
      [specialMethods.write.args.serialize(args)]
    )
      .then(serializedResult => {
        const {
          bytesWritten,
          bufferOrString
        } = specialMethods.write.result.deserialize(serializedResult);
        callback(null, bytesWritten, bufferOrString);
      })
      .catch(err => {
        callback(err, null, null);
      });
  };

  fs.FSWatcher = class FSWatcher extends EventEmitter {};

  fs.watch = function watch(filename, options, listener) {
    specialMethods.watch.args.assert([filename, options, listener]);

    const websocketUrl = runOnServer.sync(
      serializedArgs => {
        const fs = require("fs");
        const createSocketUrl = require("run-on-server/socket");
        const { specialMethods } = require("../shared/defs");

        const [filename, options] = specialMethods.watch.args.deserialize(
          serializedArgs
        );

        return createSocketUrl(socket => {
          const listener = (eventType, filename) => {
            const data = JSON.stringify(
              specialMethods.watch.socketMsg.serialize({
                type: "listener",
                eventType,
                data: filename
              })
            );
            socket.send(data);
          };

          const watcher = fs.watch(filename, options, listener);

          watcher.on("change", (eventType, filename) => {
            const data = JSON.stringify(
              specialMethods.watch.socketMsg.serialize({
                type: "watcher",
                eventType: "change",
                data: filename
              })
            );
            socket.send(data);
          });

          watcher.on("close", () => {
            socket.close();
          });

          watcher.on("error", err => {
            const data = JSON.stringify(
              specialMethods.watch.socketMsg.serialize({
                type: "watcher",
                eventType: "error",
                data: err
              })
            );
            socket.send(data);
          });

          socket.onmessage = event => {
            if (event.data === "close") {
              watcher.close();
              socket.close();
            }
          };
        });
      },
      [specialMethods.watch.args.serialize([filename, options, undefined])]
    );

    const watcher = new fs.FSWatcher();

    const ws = new global.WebSocket(websocketUrl);
    ws.onerror = event => {
      const err = new Error("WebSocket error");
      err.event = event;
      watcher.emit("error", err);
    };

    ws.onmessage = event => {
      const {
        type,
        eventType,
        data
      } = specialMethods.watch.socketMsg.deserialize(JSON.parse(event.data));
      if (type === "listener") {
        listener(eventType, data);
      } else if (type === "watcher") {
        watcher.emit(eventType, data);
      }
    };

    ws.onclose = () => {
      watcher.emit("close");
    };

    watcher.close = () => {
      ws.send("close");
    };

    return watcher;
  };

  fs.createWriteStream = function createWriteStream(...args) {
    specialMethods.createWriteStream.args.assert(args);

    const websocketUrl = runOnServer.sync(
      serializedArgs => {
        const fs = require("fs");
        const websocketStreamServer = require("websocket-stream/stream");
        const createSocketUrl = require("run-on-server/socket");
        const { specialMethods } = require("../shared/defs");
        const args = specialMethods.createWriteStream.args.deserialize(
          serializedArgs
        );

        return createSocketUrl(socket => {
          const writeStream = fs.createWriteStream(...args);
          const socketStream = websocketStreamServer(socket, { binary: true });
          socketStream.pipe(writeStream);
        });
      },
      [specialMethods.createWriteStream.args.serialize(args)]
    );

    return websocketStreamClient(websocketUrl);
  };

  return fs;
};
