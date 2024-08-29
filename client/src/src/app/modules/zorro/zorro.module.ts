import { NgModule } from "@angular/core";
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import { UserOutline, MenuOutline, FormOutline } from '@ant-design/icons-angular/icons';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

const icons: IconDefinition[] = [
    UserOutline,
    MenuOutline,
    FormOutline,
];

@NgModule({
    imports: [
        NzIconModule.forRoot(icons)
    ],
    exports: [
        NzButtonModule,
        NzIconModule,
        NzToolTipModule,
    ]
})
export class ZorroModule { }