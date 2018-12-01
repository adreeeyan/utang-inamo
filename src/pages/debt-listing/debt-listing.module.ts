import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DebtListingPage } from './debt-listing';
import { PipesModule } from '../../pipes/pipes.module';
import { DebtInfoPageModule } from '../debt-info/debt-info.module';

@NgModule({
  declarations: [
    DebtListingPage,
  ],
  imports: [
    IonicPageModule.forChild(DebtListingPage),
    PipesModule,
    DebtInfoPageModule
  ],
})
export class DebtListingPageModule {}
