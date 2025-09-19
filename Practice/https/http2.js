import { createServer } from "http";
import { createReadStream } from "fs";
import { pipeline } from "stream";

const server = createServer((req, res) => {
  if (req.url === "/") {
    pipeline(createReadStream(__dirname + "/index.html"), res);
  } else if (req.url === "/api") {
    res.writeHead(200, "content-Type", {
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
