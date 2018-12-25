import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BorrowerEditorPage } from './borrower-editor';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    BorrowerEditorPage,
  ],
  imports: [
    IonicPageModule.forChild(BorrowerEditorPage),
    DirectivesModule
  ],
})
export class BorrowerEditorPageModule {}
