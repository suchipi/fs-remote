const types = require("serializable-types");

const path = types.union(types.string, types.Buffer, types.URL);

const simpleMethods = {
  access: {
    args: types.tuple(path, types.maybe(types.integer)),
    result: types.undefined,
    sync: false
  },
  accessSync: {
    args: types.tuple(path, types.maybe(types.integer)),
    result: types.undefined,
    sync: true
  },
  appendFile: {
    args: types.tuple(
      path,
      types.union(types.string, types.Buffer),
      types.maybe(
        types.shape({
          encoding: types.union(types.string, types.null),
          mode: types.integer,
          flag: types.string
        })
      )
    ),
    result: types.undefined,
    sync: false
  },
  appendFileSync: {
    args: types.tuple(
      path,
      types.union(types.string, types.Buffer),
      types.maybe(
        types.shape({
          encoding: types.union(types.string, types.null),
          mode: types.integer,
          flag: types.string
        })
      )
    ),
    result: types.undefined,
    sync: true
  },
  chmod: {
    args: types.tuple(path, types.integer),
    result: types.undefined,
    sync: false
  },
  chmodSync: {
    args: types.tuple(path, types.integer),
    result: types.undefined,
    sync: true
  },
  chown: {
    args: types.tuple(path, types.integer, types.integer),
    result: types.undefined,
    sync: false
  },
  chownSync: {
    args: types.tuple(path, types.integer, types.integer),
    result: types.undefined,
    sync: true
  },
  close: {
    args: types.tuple(types.integer),
    result: types.undefined,
    sync: false
  },
  closeSync: {
    args: types.tuple(types.integer),
    result: types.undefined,
    sync: true
  },
  copyFile: {
    args: types.tuple(path, path, types.maybe(types.number)),
    result: types.undefined,
    sync: false
  },
  copyFileSync: {
    args: types.tuple(path, path, types.maybe(types.number)),
    result: types.undefined,
    sync: true
  },
  existsSync: {
    args: types.tuple(path),
    result: types.boolean,
    sync: true
  },
  fchmod: {
    args: types.tuple(types.integer, types.integer),
    result: types.undefined,
    sync: false
  },
  fchmodSync: {
    args: types.tuple(types.integer, types.integer),
    result: types.undefined,
    sync: true
  },
  fchown: {
    args: types.tuple(types.integer, types.integer, types.integer),
    result: types.undefined,
    sync: false
  },
  fchownSync: {
    args: types.tuple(types.integer, types.integer, types.integer),
    result: types.undefined,
    sync: true
  },
  fdatasync: {
    args: types.tuple(types.integer),
    result: types.undefined,
    sync: false
  },
  fdatasyncSync: {
    args: types.tuple(types.integer),
    result: types.undefined,
    sync: true
  },
  fsync: {
    args: types.tuple(types.integer),
    result: types.undefined,
    sync: false
  },
  fsyncSync: {
    args: types.tuple(types.integer),
    result: types.undefined,
    sync: true
  },
  ftruncate: {
    args: types.tuple(types.integer, types.maybe(types.integer)),
    result: types.undefined,
    sync: false
  },
  ftruncateSync: {
    args: types.tuple(types.integer, types.maybe(types.integer)),
    result: types.undefined,
    sync: true
  },
  futimes: {
    args: types.tuple(
      types.integer,
      types.union(types.number, types.string, types.Date),
      types.union(types.number, types.string, types.Date)
    ),
    result: types.undefined,
    sync: false
  },
  futimesSync: {
    args: types.tuple(
      types.integer,
      types.union(types.number, types.string, types.Date),
      types.union(types.number, types.string, types.Date)
    ),
    result: types.undefined,
    sync: true
  },
  lchmod: {
    args: types.tuple(path, types.integer),
    result: types.undefined,
    sync: false
  },
  lchmodSync: {
    args: types.tuple(path, types.integer),
    result: types.undefined,
    sync: true
  },
  lchown: {
    args: types.tuple(path, types.integer, types.integer),
    result: types.undefined,
    sync: false
  },
  lchownSync: {
    args: types.tuple(path, types.integer, types.integer),
    result: types.undefined,
    sync: true
  },
  link: {
    args: types.tuple(path, path),
    result: types.undefined,
    sync: false
  },
  linkSync: {
    args: types.tuple(path, path),
    result: types.undefined,
    sync: true
  },
  mkdir: {
    args: types.tuple(path, types.maybe(types.integer)),
    result: types.undefined,
    sync: false
  },
  mkdirSync: {
    args: types.tuple(path, types.maybe(types.integer)),
    result: types.undefined,
    sync: true
  },
  mkdtemp: {
    args: types.tuple(
      types.string,
      types.maybe(
        types.union(types.string, types.shape({ encoding: types.string }))
      )
    ),
    result: types.string,
    sync: false
  },
  mkdtempSync: {
    args: types.tuple(
      types.string,
      types.maybe(
        types.union(types.string, types.shape({ encoding: types.string }))
      )
    ),
    result: types.string,
    sync: false
  },
  open: {
    args: types.tuple(
      path,
      types.union(types.string, types.number),
      types.maybe(types.integer)
    ),
    result: types.integer,
    sync: false
  },
  openSync: {
    args: types.tuple(
      path,
      types.union(types.string, types.number),
      types.maybe(types.integer)
    ),
    result: types.integer,
    sync: true
  },
  readdir: {
    args: types.tuple(
      path,
      types.maybe(
        types.union(types.string, types.shape({ encoding: types.string }))
      )
    ),
    result: types.union(types.array(types.string), types.array(types.Buffer)),
    sync: false
  },
  readdirSync: {
    args: types.tuple(
      path,
      types.maybe(
        types.union(types.string, types.shape({ encoding: types.string }))
      )
    ),
    result: types.union(types.array(types.string), types.array(types.Buffer)),
    sync: true
  },
  readFile: {
    args: types.tuple(
      types.union(path, types.integer),
      types.maybe(
        types.union(
          types.string,
          types.shape({
            encoding: types.union(types.string, types.null),
            flag: types.string
          })
        )
      )
    ),
    result: types.union(types.string, types.Buffer),
    sync: false
  },
  readFileSync: {
    args: types.tuple(
      types.union(path, types.integer),
      types.maybe(
        types.union(
          types.string,
          types.shape({
            encoding: types.union(types.string, types.null),
            flag: types.string
          })
        )
      )
    ),
    result: types.union(types.string, types.Buffer),
    sync: true
  },
  readlink: {
    args: types.tuple(
      path,
      types.maybe(
        types.union(types.string, types.shape({ encoding: types.string }))
      )
    ),
    result: types.union(types.string, types.Buffer),
    sync: false
  },
  readlinkSync: {
    args: types.tuple(
      path,
      types.maybe(
        types.union(types.string, types.shape({ encoding: types.string }))
      )
    ),
    result: types.union(types.string, types.Buffer),
    sync: true
  },
  readSync: {
    args: types.tuple(
      types.integer,
      types.union(types.Buffer, types.Uint8Array),
      types.integer,
      types.integer,
      types.integer
    ),
    result: types.number,
    sync: true
  },
  realpath: {
    args: types.tuple(
      path,
      types.maybe(
        types.union(types.string, types.shape({ encoding: types.string }))
      )
    ),
    result: types.union(types.string, types.Buffer),
    sync: false
  },
  realpathSync: {
    args: types.tuple(
      path,
      types.maybe(
        types.union(types.string, types.shape({ encoding: types.string }))
      )
    ),
    result: types.union(types.string, types.Buffer),
    sync: true
  },
  rename: {
    args: types.tuple(path, path),
    result: types.undefined,
    sync: false
  },
  renameSync: {
    args: types.tuple(path, path),
    result: types.undefined,
    sync: true
  },
  rmdir: {
    args: types.tuple(path),
    result: types.undefined,
    sync: false
  },
  rmdirSync: {
    args: types.tuple(path),
    result: types.undefined,
    sync: true
  },
  symlink: {
    args: types.tuple(path, path, types.maybe(types.string)),
    result: types.undefined,
    sync: false
  },
  symlinkSync: {
    args: types.tuple(path, path, types.maybe(types.string)),
    result: types.undefined,
    sync: true
  },
  truncate: {
    args: types.tuple(path, types.maybe(types.integer)),
    result: types.undefined,
    sync: false
  },
  truncateSync: {
    args: types.tuple(path, types.maybe(types.integer)),
    result: types.undefined,
    sync: true
  },
  unlink: {
    args: types.tuple(path),
    result: types.undefined,
    sync: false
  },
  unlinkSync: {
    args: types.tuple(path),
    result: types.undefined,
    sync: true
  },
  utimes: {
    args: types.tuple(
      path,
      types.union(types.number, types.string, types.Date),
      types.union(types.number, types.string, types.Date)
    ),
    result: types.undefined,
    sync: false
  },
  utimesSync: {
    args: types.tuple(
      path,
      types.union(types.number, types.string, types.Date),
      types.union(types.number, types.string, types.Date)
    ),
    result: types.undefined,
    sync: false
  }
};

const specialMethods = {
  createReadStream: {
    args: types.tuple(
      path,
      types.maybe(
        types.union(
          types.string,
          types.shape({
            flags: types.string,
            encoding: types.union(types.null, types.string),
            fd: types.union(types.null, types.integer),
            mode: types.integer,
            autoClose: types.boolean,
            start: types.integer,
            end: types.integer,
            highWaterMark: types.integer
          })
        )
      )
    ),
    sync: true
  },
  createWriteStream: {
    args: types.tuple(
      path,
      types.maybe(
        types.union(
          types.string,
          types.shape({
            flags: types.string,
            encoding: types.string,
            fd: types.union(types.null, types.integer),
            mode: types.integer,
            autoClose: types.boolean,
            start: types.integer
          })
        )
      )
    ),
    sync: true
  },

  exists: {
    args: types.tuple(path),
    result: types.boolean,
    sync: false
  },

  fstat: {
    args: types.tuple(types.integer),
    sync: false
  },
  fstatSync: {
    args: types.tuple(types.integer),
    sync: true
  },

  lstat: {
    args: types.tuple(path),
    sync: false
  },
  lstatSync: {
    args: types.tuple(path),
    sync: true
  },

  read: {
    args: types.tuple(
      types.integer,
      types.union(types.Buffer, types.Uint8Array),
      types.integer,
      types.integer,
      types.integer
    ),
    // This result is synthetic; the actual method calls the callback with multiple arguments.
    result: types.object({ bytesRead: types.integer, buffer: types.Buffer }),
    sync: false
  },

  stat: {
    args: types.tuple(path),
    sync: false
  },
  statSync: {
    args: types.tuple(path),
    sync: true
  },

  write: {
    args: types.union(
      types.tuple(
        types.integer,
        types.union(types.Buffer, types.Uint8Array),
        types.maybe(types.integer),
        types.maybe(types.integer),
        types.maybe(types.integer)
      ),
      types.tuple(
        types.integer,
        types.string,
        types.maybe(types.integer),
        types.maybe(types.string)
      )
    ),
    // This result is synthetic; the actual method calls the callback with multiple arguments.
    result: types.object({
      bytesWritten: types.integer,
      bufferOrString: types.union(types.Buffer, types.Uint8Array, types.string)
    }),
    sync: false
  },

  // TODO: watch
  watch: {
    args: types.tuple(
      path,
      types.maybe(
        types.union(
          types.string,
          types.object({
            persistent: types.maybe(types.boolean),
            recursive: types.maybe(types.boolean),
            encoding: types.maybe(types.string)
          })
        )
      ),
      types.maybe(types.Function)
    ),
    socketMsg: types.object({
      type: types.string,
      eventType: types.string,
      data: types.union(
        types.undefined,
        types.string,
        types.Buffer,
        types.Error
      )
    })
  }

  // TODO: watchFile
  // TODO: unwatchFile
};

module.exports = {
  simpleMethods,
  specialMethods
};
