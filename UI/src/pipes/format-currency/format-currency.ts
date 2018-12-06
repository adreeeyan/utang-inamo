import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCurrency',
})
export class FormatCurrencyPipe implements PipeTransform {
  /**
   * Takes a number and transforms it to the currect currency format.
   */
  transform(value: number, ...args) {
    let currency = this.formatter.format(value);
    // replace PHP with ₱
    currency = currency.replace("PHP", "₱");
    return currency;
  }

  formatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2
  });

}
