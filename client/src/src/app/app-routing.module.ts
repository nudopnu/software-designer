import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExplorerComponent } from './components/explorer/explorer.component';
import { EditorComponent } from './routes/editor/editor.component';

const routes: Routes = [
  { path: '', component: ExplorerComponent },
  { path: 'editor', component: EditorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
