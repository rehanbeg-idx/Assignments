let a = document.querySelector(".box");
a.innerHTML = "Hello";
a.style.backgroundColor = "red";
a.style.color = "white";

btn.addEventListener("click", () => {
  alert("Hey you just clicked something!");
  a.removeAttribute("style");
});

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

async function getSong() {
  let x = await fetch();
  let d = document.createElement("div");
  d.innerHTML = response();
  let as = d.getElementsByTagName("a");
  let songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element);
    }
  }
  return songs;
}

async function main() {
  let songs = await getSong();
  console.log(songs);
}
