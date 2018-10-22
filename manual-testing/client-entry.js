/* global document */
const createClient = require("fs-remote/createClient");
const buffer = require("buffer");

global.Buffer = buffer.Buffer;
global.fs = createClient("http://localhost:3000");

document.write("Open devtools and try using the global `fs` object");
