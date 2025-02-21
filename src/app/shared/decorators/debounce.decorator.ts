export function Debounce(delay: number = 300): any {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log('debounce');
    console.log(descriptor.value);
    console.log(propertyKey);

    const original = descriptor.value;
    const key = `__timeout__${propertyKey}`;

    descriptor.value = function (...args: any) {
      clearTimeout(this[key as keyof PropertyDescriptor]);
      this[key as keyof PropertyDescriptor] = setTimeout(() => original.apply(this, args), delay);
    };

    return descriptor;
  };
}