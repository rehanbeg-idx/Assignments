// var greet = require("./greet");

// greet();

const person = {
    firstname : 'abc',
    lastName : 'xyz',
    greet : function(){
        console.log('Hello ' + this.firstname + ' ' + this.lastName);
    }
}

person.greet();