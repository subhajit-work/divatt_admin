import { Pipe, PipeTransform } from '@angular/core';
import { identifierModuleUrl } from '@angular/compiler';

@Pipe({
  name: 'filtermulti'
})
export class FiltermultiPipe implements PipeTransform {
  transform(myobjects: Array<object>, args?: Array<object>): any {

    if (args && Array.isArray(myobjects)) {
      // copy all objects of original array into new array of objects
      var returnobjects = myobjects;
      // args are the compare oprators provided in the *ngFor directive
      args.forEach(function (filterobj) {
        let filterkey = Object.keys(filterobj)[0];

        let filtervalue = filterobj[filterkey];

        myobjects.forEach(function (objectToFilter) {
          if (objectToFilter[filterkey] != filtervalue && filtervalue != "") {
            // object didn't match a filter value so remove it from array via filter
            returnobjects = returnobjects.filter(obj => obj !== objectToFilter);
          }
        })
      });
      // return new object to *ngFor directive
      return returnobjects;
    }
  }
}

// Array.isArray use for check arry (may be array inside obj) then return true
/* Array.isArray([1, 2, 3]);  // true
  Array.isArray({foo: 123}); // false
  Array.isArray('foobar');   // false
  Array.isArray(undefined);  // false */


// Object.keys is use for get object propery name only (like id, name, )
  /* const object1 = {
    a: 'somestring',
    b: 42,
    c: false
  };
  
  console.log(Object.keys(object1));
  // expected output: Array ["a", "b", "c"]
  
  console.log(Object.keys(object1)[0]);
  // expected output:a 
                     b
                     c
                     
  console.log(Obj[Object.keys(object1)[0]]);
  // expected output:somestring 
                     42
                     false*/

