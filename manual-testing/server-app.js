const createFsServer = require("../server");

const app = createFsServer();

app.listen(3000, () => {
  console.log("App is listening on port 3000");
});
