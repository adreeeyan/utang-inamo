import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DebtInfoPage } from './debt-info';
import { PipesModule } from '../../pipes/pipes.module';
import { FormatCurrencyPipe } from '../../pipes/format-currency/format-currency';

@NgModule({
  declarations: [
    DebtInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(DebtInfoPage),
    PipesModule
  ],
  providers: [
    FormatCurrencyPipe
  ]
})
export class DebtInfoPageModule {}
