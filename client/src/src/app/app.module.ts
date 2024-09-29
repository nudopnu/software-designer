import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExplorerComponent } from './components/explorer/explorer.component';
import { GridComponent } from './components/grid/grid.component';
import { MarkdownEditorComponent } from './components/markdown-editor/markdown-editor.component';
import { NodeAttributeComponent } from './components/node-attribute/node-attribute.component';
import { NodeLabelComponent } from './components/node-label/node-label.component';
import { NodeTitleComponent } from './components/node-title/node-title.component';
import { NodeComponent } from './components/node/node.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ZorroModule } from './modules/zorro/zorro.module';
import { EditorComponent } from './routes/editor/editor.component';
import { DraggableDirective } from './directives/draggable.directive';
import { PickerComponent } from './components/picker/picker.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    GridComponent,
    EditorComponent,
    MarkdownEditorComponent,
    ExplorerComponent,
    NodeComponent,
    NodeTitleComponent,
    NodeAttributeComponent,
    NodeLabelComponent,
    DraggableDirective,
    PickerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ZorroModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    provideAnimationsAsync(),
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
