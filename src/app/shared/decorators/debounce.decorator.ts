export function Debounce(delay: number = 100): any {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalFunc: Function = descriptor.value; // original onScroll() function
    const timeOutVar = `${propertyKey}`; // variable to be created inside the InfiniteScrollDirective context

    descriptor.value = function (...args: any) {
      // clear the variable every time the function is called (restart the debounce timer)
      clearTimeout(this[timeOutVar as keyof PropertyDescriptor]);
      // set a timeout for the function call of the original function
      this[timeOutVar as keyof PropertyDescriptor] = setTimeout(() => originalFunc.apply(this, args), delay);
    };

    return descriptor;
  };
}