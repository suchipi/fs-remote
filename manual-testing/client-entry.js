/* global document */
const createFs = require("../client");
const buffer = require("buffer");

global.Buffer = buffer.Buffer;
global.fs = createFs("http://localhost:3000");

document.write("Open devtools and try using the global `fs` object");
