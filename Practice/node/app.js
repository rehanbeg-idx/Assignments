// // var greet = require("./greet");

// // greet();

// const person = {
//     firstname : 'abc',
//     lastName : 'xyz',
//     greet : function(){
//         console.log('Hello ' + this.firstname + ' ' + this.lastName);
//     }
// }

// person.greet();

// console.log(person['firstname']);

// var greet = require("./greet");

// greet.english();
// greet.spanish();

var Emitter = require('./emitter');

var emtr = new Emitter();

emtr.on('greet', function(){
    console.log('Somewhere, someone said hello.');
});

emtr.on('greet', function(){
    console.log('A greeting occurred!');
});

console.log('Hello!');

emtr.emit('greet');