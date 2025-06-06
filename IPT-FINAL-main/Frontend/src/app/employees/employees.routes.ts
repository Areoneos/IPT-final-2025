import { Routes } from '@angular/router';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
import { TransferComponent } from './transfer.component';

export const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'add', component: AddEditComponent },
  { path: 'edit/:id', component: AddEditComponent },
  { path: 'transfer/:id', component: TransferComponent }
]; 