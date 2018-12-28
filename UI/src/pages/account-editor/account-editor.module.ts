import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountEditorPage } from './account-editor';

@NgModule({
  declarations: [
    AccountEditorPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountEditorPage),
  ],
})
export class AccountEditorPageModule {}
