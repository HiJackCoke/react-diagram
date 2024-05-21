const has = Object.prototype.hasOwnProperty;

export const deepEqual = (foo: any, bar: any) => {
   let constructor;
   let length;

   if (foo === bar) return true;

   if (foo && bar && foo.constructor === bar.constructor) {
      constructor = foo.constructor;

      if (constructor === Date) return foo.getTime() === bar.getTime();
      if (constructor === RegExp) return foo.toString() === bar.toString();

      if (constructor === Array) {
         if ((length = foo.length) === bar.length) {
            while (length-- && deepEqual(foo[length], bar[length]));
         }
         return length === -1;
      }

      if (!constructor || typeof foo === 'object') {
         length = 0;
         for (constructor in foo) {
            if (
               has.call(foo, constructor) &&
               ++length &&
               !has.call(bar, constructor)
            )
               return false;
            if (
               !(constructor in bar) ||
               !deepEqual(foo[constructor], bar[constructor])
            )
               return false;
         }
         return Object.keys(bar).length === length;
      }
   }

   return foo !== foo && bar !== bar;
};
