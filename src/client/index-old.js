const createClient = require("run-on-server/client");
const Buffer = global.Buffer || require("buffer");

function unpify(promise, callback) {
  promise
    .then(result => {
      callback(null, result);
    })
    .catch(err => {
      callback(err, null);
    });
}

module.exports = function createFs(serverUrl) {
  const runOnServer = createClient(serverUrl);

  const constants = {
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

  return {
    constants,
    Stats,

    access: (path, modeOrCallback, maybeCallback) => {
      let mode;
      let callback;
      if (typeof modeOrCallback === "function") {
        mode = constants.F_OK;
        callback = modeOrCallback;
      } else if (
        typeof modeOrCallback === "number" &&
        typeof maybeCallback === "function"
      ) {
        mode = modeOrCallback;
        callback = maybeCallback;
      } else {
        throw new TypeError('"callback" argument must be a function');
      }

      unpify(
        runOnServer(
          (path, mode) => {
            const { fsp, revive } = require("./helpers");
            return fsp.access(revive(path), mode);
          },
          [path, mode]
        ),
        callback
      );
    },

    accessSync: notAvailable("accessSync"),

    link: (existingPath, newPath, callback) => {
      unpify(
        runOnServer(
          (existingPath, newPath) => {
            const { fsp, revive } = require("./helpers");
            return fsp.link(revive(existingPath), revive(newPath));
          },
          [existingPath, newPath]
        ),
        callback
      );
    },

    linkSync: notAvailable("linkSync"),

    read: (fd, clientBuffer, offset, length, position, callback) => {
      runOnServer(
        (fd, length, position) => {
          return new Promise(resolve => {
            const fs = require("fs");
            const buffer = Buffer.alloc(length);

            fs.read(
              fd,
              buffer,
              0,
              length,
              position,
              (err, bytesRead, buffer) => {
                resolve({ bytesRead, buffer });
              }
            );
          });
        },
        [fd, length, position]
      ).then(
        ({ bytesRead, buffer }) => {
          buffer.data.forEach((byte, index) => {
            clientBuffer[offset + index] = byte;
          });
          callback(null, bytesRead, clientBuffer);
        },
        err => {
          callback(err, null, null);
        }
      );
    },

    readFile: (path, optionsOrCallback, maybeCallback) => {
      let options;
      let callback;
      if (typeof optionsOrCallback === "function") {
        callback = optionsOrCallback;
      } else {
        options = optionsOrCallback;
        callback = maybeCallback;
      }

      unpify(
        runOnServer(
          (path, options) => {
            const { fsp } = require("./helpers");
            return fsp.readFile(path, options);
          },
          [path, options]
        ),
        callback
      );
    },

    stat: (path, callback) => {
      unpify(
        runOnServer(
          path => {
            const { fsp } = require("./helpers");
            return fsp.stat(path).then(stats => {
              stats._isBlockDevice = stats.isBlockDevice();
              stats._isCharacterDevice = stats.isCharacterDevice();
              stats._isDirectory = stats.isDirectory();
              stats._isFIFO = stats.isFIFO();
              stats._isFile = stats.isFile();
              stats._isSocket = stats.isSocket();
              stats._isSymbolicLink = stats.isSymbolicLink();

              return stats;
            });
          },
          [path]
        ).then(stats => new Stats(stats)),
        callback
      );
    },

    chmod: (path, mode, callback) => {
      unpify(
        runOnServer(
          (path, mode) => {
            const { fsp } = require("./helpers");
            return fsp.chmod(path, mode);
          },
          [path, mode]
        ),
        callback
      );
    },

    chown: (path, uid, gid, callback) => {
      unpify(
        runOnServer(
          (path, uid, gid) => {
            const { fsp } = require("./helpers");
            return fsp.chown(path, uid, gid);
          },
          [path, uid, gid]
        ),
        callback
      );
    },

    // TODO: open
    // TODO: close
    // TODO: fstat
    // TODO: fsync

    lstat: (path, callback) => {
      unpify(
        runOnServer(
          path => {
            const { fsp } = require("./helpers");
            return fsp.lstat(path);
          },
          [path]
        ),
        callback
      );
    },

    mkdir: (path, modeOrCallback, maybeCallback) => {
      let mode = 0o777;
      let callback;
      if (typeof modeOrCallback === "function") {
        callback = modeOrCallback;
      } else {
        mode = modeOrCallback;
        callback = maybeCallback;
      }

      unpify(
        runOnServer(
          (path, mode) => {
            const { fsp } = require("./helpers");
            return fsp.mkdir(path, mode);
          },
          [path, mode]
        ),
        callback
      );
    },

    rmdir: (path, callback) => {
      unpify(
        runOnServer(
          path => {
            const { fsp } = require("./helpers");
            return fsp.rmdir(path);
          },
          [path]
        ),
        callback
      );
    },

    // TODO: watch
    // TODO: write

    exists: (path, callback) => {
      runOnServer(
        path => {
          const fs = require("fs");

          return new Promise(resolve => {
            fs.exists(path, resolve);
          });
        },
        [path]
      ).then(callback);
    },

    // TODO: fchmod
    // TODO: fchown
    // TODO: lchmod
    // TODO: lchown

    rename: (oldPath, newPath, callback) => {
      unpify(
        runOnServer(
          (oldPath, newPath) => {
            const { fsp } = require("./helpers");
            return fsp.rename(oldPath, newPath);
          },
          [oldPath, newPath]
        ),
        callback
      );
    },

    unlink: (path, callback) => {
      unpify(
        runOnServer(
          path => {
            const { fsp } = require("./helpers");
            return fsp.unlink(path);
          },
          [path]
        ),
        callback
      );
    },

    utimes: (path, atime, mtime, callback) => {
      unpify(
        runOnServer(
          (path, atime, mtime) => {
            const { fsp } = require("./helpers");
            return fsp.utimes(path, atime, mtime);
          },
          [path, atime, mtime]
        ),
        callback
      );
    },

    // TODO: futimes

    mkdtemp: (prefix, optionsOrCallback, maybeCallback) => {
      let options;
      let callback;
      if (typeof optionsOrCallback === "function") {
        options = "utf8";
        callback = optionsOrCallback;
      } else {
        options = optionsOrCallback;
        callback = maybeCallback;
      }

      unpify(
        runOnServer(
          (prefix, options) => {
            const { fsp } = require("./helpers");
            return fsp.mkdtemp(prefix, options);
          },
          [prefix, options]
        ),
        callback
      );
    },

    readdir: (path, optionsOrCallback, maybeCallback) => {
      let options;
      let callback;
      if (typeof optionsOrCallback === "function") {
        options = "utf8";
        callback = optionsOrCallback;
      } else {
        options = optionsOrCallback;
        callback = maybeCallback;
      }

      unpify(
        runOnServer(
          (path, options) => {
            const { fsp } = require("./helpers");
            return fsp.readdir(path, options);
          },
          [path, options]
        ),
        callback
      );
    },

    symlink: (target, path, typeOrCallback, maybeCallback) => {
      let type;
      let callback;
      if (typeof typeOrCallback === "function") {
        type = "file";
        callback = typeOrCallback;
      } else {
        type = typeOrCallback;
        callback = maybeCallback;
      }

      unpify(
        runOnServer(
          (target, path, type) => {
            const { fsp } = require("./helpers");
            return fsp.symlink(target, path, type);
          },
          [target, path, type]
        ),
        callback
      );
    },

    copyFile(src, dest, flagsOrCallback, maybeCallback) {
      let flags;
      let callback;
      if (typeof flagsOrCallback === "function") {
        flags = 0;
        callback = flagsOrCallback;
      } else {
        flags = flagsOrCallback;
        callback = maybeCallback;
      }

      unpify(
        runOnServer(
          (src, dest, flags) => {
            const { fsp } = require("./helpers");
            return fsp.copyFile(src, dest, flags);
          },
          [src, dest, flags]
        ),
        callback
      );
    }
  };
};
