import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trim',
})
export class TrimPipe implements PipeTransform {
  transform(value: string, length: number): string {
    const trim = value.slice(0, length);
    if (value.length > length) {
      return trim + '...';
    } else {
      return trim;
    }
  }
}
