/* global document */
const createClient = require("../../../createClient");

const fs = createClient("http://localhost:3000");

const pre = document.createElement("pre");
pre.textContent = fs.readFileSync("./package.json");
document.body.appendChild(pre);
