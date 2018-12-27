import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BorrowerPickerPage } from './borrower-picker';
import { Contacts } from '@ionic-native/contacts';
import { BorrowerInfoPageModule } from '../borrower-info/borrower-info.module';

@NgModule({
  declarations: [
    BorrowerPickerPage,
  ],
  providers: [
    Contacts
  ],
  imports: [
    IonicPageModule.forChild(BorrowerPickerPage),
    BorrowerInfoPageModule
  ],
})
export class BorrowerPickerPageModule {}
