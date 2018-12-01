import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DebtInfoPage } from './debt-info';

@NgModule({
  declarations: [
    DebtInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(DebtInfoPage),
  ],
})
export class DebtInfoPageModule {}
