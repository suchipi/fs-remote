const createFsServer = require("./index");

const app = createFsServer();

app.listen(3000, () => {
  console.log("App is listening on port 3000");
});
