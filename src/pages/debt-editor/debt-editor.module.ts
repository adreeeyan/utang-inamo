import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DebtEditorPage } from './debt-editor';

@NgModule({
  declarations: [
    DebtEditorPage,
  ],
  imports: [
    IonicPageModule.forChild(DebtEditorPage),
  ],
})
export class DebtEditorPageModule {}
