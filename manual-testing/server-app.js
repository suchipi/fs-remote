const createServer = require("../createServer");

const server = createServer();

server.listen(3000, () => {
  console.log("fs-remote server is listening on port 3000");
});
