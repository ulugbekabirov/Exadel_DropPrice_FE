import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'metersToKilometers'
})
export class MetersToKilometersPipe implements PipeTransform {

  transform(distance: number, extension: string = 'km'): unknown {
    if (distance > 1000) {
      return (distance / 1000).toFixed(2) + 'km.';
    } else {
      return distance + 'm.';
    }
  }

}
