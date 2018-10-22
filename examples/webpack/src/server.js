const createFsServer = require("../../../createFsServer");

// createFsServer returns a net.Server
const server = createFsServer();

server.listen(3000, () => {
  console.log("fs-server server is listening on port 3000");
});
