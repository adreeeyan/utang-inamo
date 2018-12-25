import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BorrowerPickerPage } from './borrower-picker';
import { Contacts } from '@ionic-native/contacts';

@NgModule({
  declarations: [
    BorrowerPickerPage,
  ],
  providers: [
    Contacts
  ],
  imports: [
    IonicPageModule.forChild(BorrowerPickerPage),
  ],
})
export class BorrowerPickerPageModule {}
