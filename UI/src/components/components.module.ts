import { NgModule } from '@angular/core';
import { AmountEditorComponent } from './amount-editor/amount-editor';
import { IonicModule } from 'ionic-angular';
import { LoadingComponent } from './loading/loading';
import { MoreThingsPopupComponent } from './more-things-popup/more-things-popup';
@NgModule({
    declarations: [
        AmountEditorComponent,
        LoadingComponent,
        MoreThingsPopupComponent
    ],
    imports: [
        IonicModule.forRoot(AmountEditorComponent),
        IonicModule.forRoot(MoreThingsPopupComponent)
    ],
    exports: [
        AmountEditorComponent,
        LoadingComponent,
        MoreThingsPopupComponent
    ]
})
export class ComponentsModule { }
