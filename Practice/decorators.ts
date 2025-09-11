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
      console.log(this); // prints the instance of our class
    }
  };
}

function autobind(target: Function, ctx: ClassMethodDecoratorContext) {
    ctx.addInitializer(function(this:any){
      return this[ctx.name] = this[ctx.name].bind(this);
    })
}

@logger
class App {
  name: string = "abc";

  @autobind
  greet() {
    console.log("Hello " + this.name);
  }
}

const max = new App();
console.log(max);
