// const Emitter = require('events');
const util = require('util');

// function Greetr(){
//     this.greeting = "Hello ";
// }

// util.inherits(Greetr, Emitter);

// Greetr.prototype.greet = function(data){
//     console.log(this.greeting + data);
//     this.emit('greet', data);
// }

// var greeter = new Greetr();

// greeter.on('greet', function(data){
//     console.log('Someone greeted ' + data);
// })

// greeter.greet('abc');

function Person(){
    this.firstName ='abc';
    this.lastName = 'xyz'
}

Person.prototype.greet = function(){
    console.log(`Hello ${this.firstName} ${this.lastName} ${this.badgenumber}`);
}

function Police(){
    Person.call(this);
    this.badgenumber = '12345';
}

util.inherits(Police, Person);

var policia = new Police();

policia.greet();

