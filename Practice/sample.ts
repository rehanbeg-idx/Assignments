let users: Array<number>; // using generic array class

users = [1, 2, 5];

let x: number[]; // declares a as an array of numbers
x = [1, 2, 3, 4];

let b: (number | string)[];
b = [1, "abc"];

let data: Record<string, number | string | boolean>; // Creates a object that stores string as key and number, string or boolean as value
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

  set nam(n: string) {
    this._firstName = n;
  }
}

const e = new User("Max", "Stevens");
e.nam = "Max";
console.log(e.fullName);

let arr1 = ["admin", "user", "guest"] as const;
// arr1.push('abc'); // not able to push as the array is declared as const.

let dat = {
  entry1: 1,
  entry2: 2,
} satisfies Record<string, number>; // satisfies keyword checks the object thoroughly and ensures that the specific key is present inside it

// dat.entry3; // doesnt work throws error

let da: Record<string, number> = {
  entry1: 1,
  entry2: 2,
};

da.entry3; // this works

function merge<T>(a: T, b: T) {
  return [a, b];
}

const id = merge(5, 20);

function merg<T, U>(a: T, b: U) {
  return [a, b];
}

const ids = merg(5, "hello");

function mergeObj<T extends object>(a : T, b : T){
  return {...a, ...b};
}

const merged = mergeObj({userName : 'abc'}, {age : 21});