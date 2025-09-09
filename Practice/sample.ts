let users: Array<number>; // using generic array class

users = [1, 2, 5];

let x: number[]; // declares a as an array of numbers
x = [1, 2, 3, 4];

let b: (number | string)[];
b = [1, "abc"];

let data: Record<string, number | string>; // Creates a object
data = {
  name: "abc",
  age: 2,
};

type Role = "admin" | "guest" | "user"; // The type keyword can be used to define our own custom type;

let r: Role = "admin";

const add = (a: number, d: number) => {
  return a + d;
};

const sub = (a: number, b: number) => a - b;

const addnum = (...num: number[]) => {
  return num.reduce((currRes, currVal) => {
    return currRes + currVal;
  }, 0);
};

class User {
  constructor(public firstName: string, private lastName: string) {}

  private _firstName;
  get fullName() {
    return this.firstName + " " + this.lastName;
  }

  set nam(n : string){
    this._firstName = n;
  }

}

const e = new User("Max", "Stevens");
e.nam = 'Max';
console.log(e.fullName);

let arr = ['admin', 'user', 'guest'] as const;
// arr.push('abc'); // not able to push as the array is declared as const.