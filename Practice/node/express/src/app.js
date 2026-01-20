var express = require("express");
var app = express();
var port = process.env.PORT || 3000;

// app.use('/', function(req, res, next){
//     console.log('Request URL: ' + req.url);
//     next();
// })

// app.set('view engine', 'ejs');

// app.get('/ejs', function(req,res){
//     res.render('index');
// })

app.get('/api', function (req, res) {
  res.json({ firstname: "John", lastname: "Doe" });
});

app.get('/person/:id', function (req, res) {
  res.send("<html><head></head><body><h1> Person : " + req.params.id + "</h1></body></html>");
});

app.get('/', function (req, res) {
  res.send("<html><head></head><body><h1> Hello </h1></body></html>");
});
app.listen(port);
