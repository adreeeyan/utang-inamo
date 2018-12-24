import { NgModule } from '@angular/core';
import { AmountEditorComponent } from './amount-editor/amount-editor';
import { IonicModule } from 'ionic-angular';
import { LoadingComponent } from './loading/loading';
@NgModule({
	declarations: [AmountEditorComponent,
    LoadingComponent],
	imports: [IonicModule.forRoot(AmountEditorComponent)],
	exports: [AmountEditorComponent,
    LoadingComponent]
})
export class ComponentsModule { }
