import { createServer } from "http";
import { createReadStream } from "fs";
import { pipeline } from "stream";

const server = createServer(async (req, res) => {
  if (req.url === "/") {
    await pipeline(createReadStream(__dirname + "/index.html"), res);
  } else if (req.url === "/api") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    let obj = {
      firstName: "abc",
      lastName: "xyz",
    };

    res.end(JSON.stringify(obj));
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(4000, "127.0.0.1");
