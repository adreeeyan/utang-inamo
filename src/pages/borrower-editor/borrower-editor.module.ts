import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BorrowerEditorPage } from './borrower-editor';

@NgModule({
  declarations: [
    BorrowerEditorPage,
  ],
  imports: [
    IonicPageModule.forChild(BorrowerEditorPage),
  ],
})
export class BorrowerEditorPageModule {}
