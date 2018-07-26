import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
    imports: [
        ModalModule.forRoot(),
        ToastrModule.forRoot({
            maxOpened: 1,
            positionClass: 'toast-top-center',
            preventDuplicates: true
        })
    ],
    exports: [ModalModule],
    declarations: [],
    providers: []
})

export class NgxBootstrapModule {
}
