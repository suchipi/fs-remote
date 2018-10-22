/* global document */
const fs = require("fs");

const pre = document.createElement("pre");
pre.textContent = fs.readFileSync("./package.json");
document.body.appendChild(pre);
