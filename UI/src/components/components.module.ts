import { NgModule } from '@angular/core';
import { AmountEditorComponent } from './amount-editor/amount-editor';
import { IonicModule } from 'ionic-angular';
@NgModule({
	declarations: [AmountEditorComponent],
	imports: [IonicModule.forRoot(AmountEditorComponent)],
	exports: [AmountEditorComponent]
})
export class ComponentsModule { }
