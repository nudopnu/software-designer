import { NgModule } from "@angular/core";
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import { UserOutline, MenuOutline, FormOutline, FolderOpenOutline, FolderOutline, FileOutline, FileTextOutline, CaretRightOutline, TeamOutline, BulbOutline } from '@ant-design/icons-angular/icons';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTreeModule } from 'ng-zorro-antd/tree';

const icons: IconDefinition[] = [
    UserOutline,
    MenuOutline,
    FormOutline,
    FolderOpenOutline,
    FolderOutline,
    FileOutline,
    FileTextOutline,
    CaretRightOutline,
    TeamOutline,
    BulbOutline,
];

@NgModule({
    imports: [
        NzIconModule.forRoot(icons)
    ],
    exports: [
        NzButtonModule,
        NzIconModule,
        NzToolTipModule,
        NzTreeModule,

    ]
})
export class ZorroModule { }