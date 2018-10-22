const createFsServer = require("../server");

const server = createFsServer();

server.listen(3000, () => {
  console.log("fs-server server is listening on port 3000");
});
