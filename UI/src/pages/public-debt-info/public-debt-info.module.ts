import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublicDebtInfoPage } from './public-debt-info';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    PublicDebtInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(PublicDebtInfoPage),
    PipesModule
  ],
})
export class PublicDebtInfoPageModule {}
