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
    res.writeHead(200, "content-Type", { "Content-Type": "application/json" });
    var obj = {
      firstName: "abc",
      lastName: "xyz",
    };

    res.end(JSON.stringify(obj));
  })
  .listen(3000, "127.0.0.1");
