const Buffer = global.Buffer || require("buffer").Buffer;
const URL = global.URL || require("url").URL;

const types = {
  string: {
    name: "string",
    check(val) {
      return typeof val === "string";
    },
    serialize(str) {
      return { $type: "string", $value: str };
    },
    deserialize(serialized) {
      return serialized.$value;
    }
  },
  Buffer: {
    name: "Buffer",
    check(val) {
      return Buffer.isBuffer(val);
    },
    serialize(buffer) {
      return { $type: "Buffer", $value: Array.from(buffer.values()) };
    },
    deserialize(serialized) {
      return Buffer.from(serialized.$value);
    }
  },
  URL: {
    name: "URL",
    check(val) {
      return val instanceof URL;
    },
    serialize(url) {
      return { $type: "URL", $value: url.href };
    },
    deserialize(serialized) {
      return new URL(serialized.$value);
    }
  },
  integer: {
    name: "integer",
    check(val) {
      return typeof val === "number" && parseInt(String(val)) === val;
    },
    serialize(integer) {
      return { $type: "integer", $value: integer };
    },
    deserialize(serialized) {
      return serialized.$value;
    }
  },
  number: {
    name: "number",
    check(val) {
      return typeof val === "number" && !Number.isNaN(val);
    },
    serialize(number) {
      return { $type: "number", $value: number };
    },
    deserialize(serialized) {
      return serialized.$value;
    }
  },
  null: {
    name: "null",
    check(val) {
      return val === null;
    },
    serialize() {
      return { $type: "null", $value: null };
    },
    deserialize() {
      return null;
    }
  },
  undefined: {
    name: "undefined",
    check(val) {
      return val === undefined;
    },
    serialize() {
      return { $type: "undefined", $value: undefined };
    },
    deserialize() {
      return undefined;
    }
  },
  boolean: {
    name: "boolean",
    check(val) {
      return typeof val === "boolean";
    },
    serialize(bool) {
      return { $type: "boolean", $value: bool };
    },
    deserialize(serialized) {
      return serialized.$value;
    }
  },
  Date: {
    name: "Date",
    check(val) {
      return val instanceof Date;
    },
    serialize(date) {
      return { $type: "Date", $value: Number(date) };
    },
    deserialize(serialized) {
      return new Date(serialized.$value);
    }
  },
  Uint8Array: {
    name: "Uint8Array",
    check(val) {
      return val instanceof Uint8Array;
    },
    serialize(uint8Array) {
      return { $type: "Uint8Array", $value: Array.from(uint8Array) };
    },
    deserialize(serialized) {
      return new Uint8Array(serialized.$value);
    }
  }
};

types.union = function union(...types) {
  return {
    name: types.map(typeDef => typeDef.name).join(" | "),
    check(val) {
      return types.some(typeDef => typeDef.check(val));
    },
    serialize(val) {
      let serialized = val;
      types.forEach(typeDef => {
        if (typeDef.check(val)) {
          serialized = typeDef.serialize(val);
        }
      });
      return serialized;
    },
    deserialize(serialized) {
      let deserialized;
      types.forEach(typeDef => {
        // All names for different types in a union must be unique, otherwise
        // this won't work.
        if (serialized.$type === typeDef.name) {
          deserialized = typeDef.deserialize(serialized);
        }
      });
      return deserialized;
    }
  };
};

types.maybe = function maybe(typeDef) {
  return types.union(typeDef, types.undefined);
};

types.object = function object(objectDef) {
  const entries = Object.entries(objectDef);
  const name = `Object { ${entries
    .map(([key, typeDef]) => `${key}: ${typeDef.name}`)
    .join(", ")} }`;
  return {
    name,
    check(val) {
      return (
        val != null &&
        typeof val === "object" &&
        entries.every(([key, typeDef]) => typeDef.check(val[key]))
      );
    },
    serialize(obj) {
      const value = {};
      entries.forEach(([key, typeDef]) => {
        value[key] = typeDef.serialize(obj[key]);
      });
      return { $type: name, $value: value };
    },
    deserialize(serialized) {
      const value = {};
      entries.forEach(([key, typeDef]) => {
        value[key] = typeDef.deserialize(serialized.$value[key]);
      });
      return value;
    }
  };
};

types.shape = function shape(objectDef) {
  const shapeDef = {};
  Object.entries(objectDef).forEach(([key, typeDef]) => {
    shapeDef[key] = types.maybe(typeDef);
  });
  return types.object(shapeDef);
};

types.objectMap = function objectMap(keyType, valueType) {
  const name = `Object { [${keyType.name}]: ${valueType.name} }`;
  return {
    name,
    check(val) {
      return (
        val != null &&
        typeof val === "object" &&
        Object.entries(val).every(
          ([key, val]) => keyType.check(key) && valueType.check(val)
        )
      );
    },
    serialize(obj) {
      return {
        $type: name,
        $value: Object.entries(obj).map(([key, val]) => {
          return {
            key: keyType.serialize(key),
            value: valueType.serialize(val)
          };
        })
      };
    },
    deserialize(serialized) {
      const obj = {};
      serialized.$value.forEach(([serializedKey, serializedValue]) => {
        const key = keyType.deserialize(serializedKey);
        const val = valueType.deserialize(serializedValue);
        obj[key] = val;
      });
      return obj;
    }
  };
};

types.tuple = function tuple(...memberDefs) {
  const name = `[${memberDefs.map(typeDef => typeDef.name).join(", ")}]`;
  return {
    name,
    check(val) {
      return (
        val != null &&
        typeof val === "object" &&
        memberDefs.every((typeDef, index) => typeDef.check(val[index]))
      );
    },
    serialize(tuple) {
      return {
        $type: name,
        $value: Array.from(tuple).map((member, index) =>
          memberDefs[index].serialize(member)
        )
      };
    },
    deserialize(serialized) {
      return serialized.$value.map((serializedValue, index) => {
        const typeDef = memberDefs[index];
        return typeDef.deserialize(serializedValue);
      });
    }
  };
};

types.array = function array(memberTypeDef) {
  const name = `Array<${memberTypeDef.name}>`;
  return {
    name,
    check(val) {
      return (
        Array.isArray(val) && val.every(member => memberTypeDef.check(member))
      );
    },
    serialize(array) {
      return {
        $type: name,
        $value: array.map(member => memberTypeDef.serialize(member))
      };
    },
    deserialize(serialized) {
      return serialized.$value.map(serializedValue => {
        return memberTypeDef.deserialize(serializedValue);
      });
    }
  };
};

function assertType(value, typeDef) {
  if (!typeDef.check(value)) {
    throw new TypeError(
      `Expected ${typeDef.name}, but received: ${
        typeof value === "object" ? JSON.stringify(value) : value
      }`
    );
  }
}

module.exports = {
  types,
  assertType
};
