import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'metersToKilometers'
})
export class MetersToKilometersPipe implements PipeTransform {

  transform(distance: number | string, extension: string = 'km'): unknown {
    const distNum: number = Number(distance);
    if (distNum > 1000) {
      return (distNum / 1000).toFixed(2) + ' km.';
    } else {
      return distNum + ' m.';
    }
  }
}
