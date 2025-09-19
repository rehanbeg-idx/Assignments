var http = require("http");
var fs = require("fs");

// http.createServer(function(req, res){
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     var html = fs.readFileSync(__dirname + '/index.html', 'utf-8');
//     var message = 'Hey how are you?';
//     html = html.replace('{message}', message);
//     res.end(html);
// }).listen(3000, '127.0.0.1');

http.createServer(function (req, res) {

    if (req.url === "/") {
      fs.createReadStream(__dirname + "/index.html").pipe(res);
    }
    
    else if (req.url === "/api") {
      res.writeHead(200, "content-Type", {
        "Content-Type": "application/json",
      });
      var obj = {
        firstName: "abc",
        lastName: "xyz",
      }; 

      res.end(JSON.stringify(obj));
    }
    else{
        res.writeHead(404);
        res.end();
    }
  })
  .listen(4000, "127.0.0.1");
