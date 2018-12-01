import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DebtListingPage } from './debt-listing';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    DebtListingPage,
  ],
  imports: [
    IonicPageModule.forChild(DebtListingPage),
    PipesModule
  ],
})
export class DebtListingPageModule {}
