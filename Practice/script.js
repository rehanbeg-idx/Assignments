let a = document.querySelector(".box");
a.innerHTML = "Hello";
a.style.backgroundColor = "red";
a.style.color = "white";

btn.addEventListener("click", () => {
  alert("Bitch");
  a.removeAttribute("style");
});

async function p() {
  // return new Promise((resolve, reject) => {       // Promises example!!!
  //   setTimeout(() => resolve(455), 3500);
  // });

  let x = await fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  body: JSON.stringify({
    Name : "Rehan",                                          //This is a POST Method
    id : 6,
    age : 21,
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})

  let data = await x.json();
  return data;

}

async function main() {
  console.log("Hello");
  console.log("Wassup");
  let a = await p();
  console.log("I'm done");
  console.log("whatchya lookin at?");
}

main();

