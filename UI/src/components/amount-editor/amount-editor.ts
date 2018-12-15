import { Component, ViewChild, ElementRef } from '@angular/core';
import { ViewController } from 'ionic-angular';
import fitty from "fitty";

@Component({
  selector: 'amount-editor',
  templateUrl: 'amount-editor.html'
})
export class AmountEditorComponent {

  @ViewChild("total") totalDiv: ElementRef;;

  amount: string = "";

  constructor(public viewCtrl: ViewController) {
    console.log('Hello AmountEditorComponent Component');
  }

  ionViewDidLoad() {
    this.amount = this.viewCtrl.data ? this.viewCtrl.data.amount.toString() : "";

    // this makes the amount font size flexible
    fitty(this.totalDiv.nativeElement, { maxSize: 64, minSize: 20, multiLine: true });

    // register keyboard events
    document.onkeydown = (e: any) => {
      e = e || window.event;
      if (e.key) {
        if (e.key == "Backspace") {
          this.backspace();
        }
        else if (e.key == "=" || e.key == "Enter") {
          this.calculate();
        }
        else {
          this.addKey(e.key);
        }
      }
    };
  }

  accept() {
    this.calculate();
    this.viewCtrl.dismiss(this.amount);
  }

  addKey(key) {
    const isDigit = !isNaN(key);
    const isOperator = ["+", "-", "*", "/"].indexOf(key) != -1;
    const isPeriod = key === ".";

    if (!isDigit && !isOperator && !isPeriod) {
      return;
    }

    // Remove that zero first if its the only value
    if (this.amount === "0") {
      this.amount = "";
    }

    this.amount += key.toString();
  }

  backspace() {
    this.amount = this.amount.substr(0, this.amount.length - 1);
  }

  clear() {
    this.amount = "";
  }

  calculate() {
    try {
      this.amount = eval(`${this.amount}`).toString();
    } catch{
      this.amount = "";
    }
  }

  get displayAmount() {
    // Change the operators to cool ones
    let amount = this.amount.toString();
    amount = amount.replace(/\*/g, "×");
    amount = amount.replace(/\//g, "÷");

    // Display 0 if no value
    if (amount === "") {
      amount = "0";
    }

    return amount;
  }

}
