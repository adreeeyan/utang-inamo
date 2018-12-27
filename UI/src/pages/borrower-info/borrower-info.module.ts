import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BorrowerInfoPage } from './borrower-info';

@NgModule({
  declarations: [
    BorrowerInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(BorrowerInfoPage),
  ],
})
export class BorrowerInfoPageModule {}
