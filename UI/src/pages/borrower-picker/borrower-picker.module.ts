import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BorrowerPickerPage } from './borrower-picker';

@NgModule({
  declarations: [
    BorrowerPickerPage,
  ],
  imports: [
    IonicPageModule.forChild(BorrowerPickerPage),
  ],
})
export class BorrowerPickerPageModule {}
