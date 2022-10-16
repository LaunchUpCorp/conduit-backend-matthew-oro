const express = require("express");
import routes from "../routes/index";


function createServer(){
  const app = express();
  app.use(express.json());
  app.use("/api", routes);
  return app
}

export default createServer
