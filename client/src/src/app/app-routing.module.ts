import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorComponent } from './routes/editor/editor.component';
import { MarkdownEditorComponent } from './components/markdown-editor/markdown-editor.component';

const routes: Routes = [
  { path: '', component: MarkdownEditorComponent },
  { path: 'editor', component: EditorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
