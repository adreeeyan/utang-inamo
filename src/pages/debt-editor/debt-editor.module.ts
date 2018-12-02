import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DebtEditorPage } from './debt-editor';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    DebtEditorPage,
  ],
  imports: [
    IonicPageModule.forChild(DebtEditorPage),
    ComponentsModule
  ],
})
export class DebtEditorPageModule {}
