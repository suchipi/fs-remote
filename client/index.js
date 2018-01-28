const createClient = require("run-on-server/client");

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

  return {
    constants,

    link: (existingPath, newPath, callback) => {
      unpify(
        runOnServer(
          (existingPath, newPath) => {
            const fs = require("fs");
            const pify = require("pify");

            return pify(fs.link)(existingPath, newPath);
          },
          [existingPath, newPath]
        ),
        callback
      );
    },

    // TODO: read

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
            const fs = require("fs");
            const pify = require("pify");

            return pify(fs.readFile)(path, options);
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
            const fs = require("fs");
            const pify = require("pify");

            return pify(fs.stat)(path);
          },
          [path]
        ),
        callback
      );
    },

    chmod: (path, mode, callback) => {
      unpify(
        runOnServer(
          (path, mode) => {
            const fs = require("fs");
            const pify = require("pify");

            return pify(fs.chmod)(path, mode);
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
            const fs = require("fs");
            const pify = require("pify");

            return pify(fs.chown)(path, uid, gid);
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
            const fs = require("fs");
            const pify = require("pify");

            return pify(fs.lstat)(path);
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
            const fs = require("fs");
            const pify = require("pify");

            return pify(fs.mkdir)(path, mode);
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
            const fs = require("fs");
            const pify = require("pify");

            return pify(fs.rmdir)(path);
          },
          [path]
        ),
        callback
      );
    },

    // TODO: watch
    // TODO: write

    access: (path, modeOrCallback, maybeCallback) => {
      let mode;
      let callback;
      if (typeof modeOrCallback === "function") {
        mode = constants.F_OK;
        callback = modeOrCallback;
      } else {
        mode = modeOrCallback;
        callback = maybeCallback;
      }

      unpify(
        runOnServer(
          (path, mode) => {
            const fs = require("fs");
            const pify = require("pify");

            return pify(fs.access)(path, mode);
          },
          [path, mode]
        ),
        callback
      );
    },

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
            const fs = require("fs");
            const pify = require("pify");

            return pify(fs.rename)(oldPath, newPath);
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
            const fs = require("fs");
            const pify = require("pify");

            return pify(fs.unlink)(path);
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
            const fs = require("fs");
            const pify = require("pify");

            return pify(fs.utimes)(path, atime, mtime);
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
            const fs = require("fs");
            const pify = require("pify");

            return pify(fs.mkdtemp)(prefix, options);
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
            const fs = require("fs");
            const pify = require("pify");

            return pify(fs.readdir)(path, options);
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
            const fs = require("fs");
            const pify = require("pify");

            return pify(fs.symlink)(target, path, type);
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
            const fs = require("fs");
            const pify = require("pify");

            return pify(fs.copyFile)(src, dest, flags);
          },
          [src, dest, flags]
        ),
        callback
      );
    }
  };
};
