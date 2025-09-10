function logger<T extends new (...args: any[]) => any>(
  target: T,
  ctx: ClassDecoratorContext
) {
  console.log("This a decorator");
  console.log(target);
  console.log(ctx);

  return class extends target {
    // age: number = 35;
    constructor(...args: any[]) {
      super(...args);
      console.log("This is a decorators  constructor!");
    }
  };
}

@logger
class App {
  name: string = "abc";

  greet() {
    console.log("Hello " + name);
  }
}

const max = new App();
console.log(max);
