export function Debounce(delay: number = 100): any {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original: Function = descriptor.value; // original onScroll() function
    const timeOut = `__timeout__${propertyKey}`; // variable to be created inside the context

    descriptor.value = function (...args: any) { // set new onScroll() function
      const context = this; // original file where the decorator will be used
      // clear the variable every time the function is called (restart the debounce timer)
      clearTimeout(context[timeOut as keyof PropertyDescriptor]);
      // set a timeout for the function call of the original function
      context[timeOut as keyof PropertyDescriptor] = setTimeout(() => original.apply(context, args), delay);
    };

    return descriptor;
  };
}