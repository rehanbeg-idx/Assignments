let a = document.querySelector(".box");
a.innerHTML = "Hello";
a.style.backgroundColor = "red";
a.style.color = "white";

btn.addEventListener("click", () => {
  alert("Hey you just clicked something!");
  a.removeAttribute("style");
});

// btn.onclick = () => {
//   alert("Hey what are you doing??????");
// };

function alertFunction(){
  alert("You clicked!!!");
}

const arr = {
  name: "abc",
  age: 21,
};

// for in loop usually focuses on indexes and is often used in objects
for (const key in arr) {
  // console.log(arr[key]); // prints  values i.e abc and 21

  console.log(key); // prints index i.e name and age
}

const ar = [1, 2, 3, 4];

// for of loop focuses on values and is used in arrays
for (const element of ar) {
  console.log(element);
}

function name(n, callback) {
  console.log("hello " + n);
  callback();
}

function say() {
  console.log("Goodbye");
}

let k = name("abc", say);

const obj = {
  name: "abc",
  age: 16,
};

const n = { ...obj };

console.log(n);

// async function p() {
//   // return new Promise((resolve, reject) => {       // Promises example!!!
//   //   setTimeout(() => resolve(455), 3500);
//   // });

//   let x = await fetch('https://jsonplaceholder.typicode.com/posts', {
//   method: 'POST',
//   body: JSON.stringify({
//     Name : "Rehan",                                          //This is a POST Method
//     id : 6,
//     age : 21,
//   }),
//   headers: {
//     'Content-type': 'application/json; charset=UTF-8',
//   },
// })

//   let data = await x.json();
//   return data;

// }

// async function main() {
//   console.log("Hello");
//   console.log("Wassup");
//   let a = await p();
//   console.log("I'm done");
//   console.log("whatchya lookin at?");
// }

// main();

// async function getSong() {
//   let x = await fetch();
//   let d = document.createElement("div");
//   d.innerHTML = response();
//   let as = d.getElementsByTagName("a");
//   let songs = [];
//   for (let i = 0; i < as.length; i++) {
//     const element = as[i];
//     if (element.href.endsWith(".mp3")) {
//       songs.push(element);
//     }
//   }
//   return songs;
// }

// async function main() {
//   let songs = await getSong();
//   console.log(songs);
// }

// main();
