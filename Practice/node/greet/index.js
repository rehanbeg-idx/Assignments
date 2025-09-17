// function log(fn){
//     fn();
// }

// log( function(){
//     console.log('Hello!!!!');
// } )

// console.log('Hello Node.js');

// var greet = function () {
//   console.log("Hello Node.js");
// };

// module.exports = greet;


var english = require("./english");
var spanish = require("./spanish");

module.exports = {english, spanish};