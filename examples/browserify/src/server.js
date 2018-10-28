const createServer = require("fs-remote/createServer");

// createServer returns a net.Server
const server = createServer();

server.listen(3000, () => {
  console.log("fs-remote server is listening on port 3000");
});
