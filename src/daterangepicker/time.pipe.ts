import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'time'})
export class TimePipe implements PipeTransform {
  transform(value) {
    if (value < 10){
      value = '0' + value;
    }
    return value;
  }
}
