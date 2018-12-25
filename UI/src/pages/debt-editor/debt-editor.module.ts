import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DebtEditorPage } from './debt-editor';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    DebtEditorPage,
  ],
  imports: [
    IonicPageModule.forChild(DebtEditorPage),
    ComponentsModule,
    PipesModule,
    DirectivesModule
  ],
})
export class DebtEditorPageModule {}
