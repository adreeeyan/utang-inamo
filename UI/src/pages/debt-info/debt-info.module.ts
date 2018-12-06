import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DebtInfoPage } from './debt-info';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    DebtInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(DebtInfoPage),
    PipesModule
  ],
})
export class DebtInfoPageModule {}
