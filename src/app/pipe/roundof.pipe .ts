import { Pipe, PipeTransform } from '@angular/core';

/* tslint:disable */ 

@Pipe({name: 'round'})
export class RoundPipe implements PipeTransform {

  transform (input:number) {
    return Math.round(input);
  }


  /* transform(value: number, digits: number) {
    return Math.round(value / (10 ** digits)) * (10 ** digits);
  } */
  
}