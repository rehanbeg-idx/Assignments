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

const s = (a: number, d: number) => {
  return a + d;
};
