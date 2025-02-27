export function Throttle(delay: number = 5000): any {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original: Function = descriptor.value; // original onScroll() function
    const last = `__last__${propertyKey}`;

    descriptor.value = function (...args: any) {
      const context = this;
      const now = Date.now();
      if (now - (context[last as keyof PropertyDescriptor] ?? 0) >= delay) {
        original.apply(context, ...args);
        context[last as keyof PropertyDescriptor] = now;
      }
    };

    return descriptor;
  };
}