import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddHsnPage } from './add-hsn.page';

const routes: Routes = [
  {
    path: '',
    component: AddHsnPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddHsnPageRoutingModule {}
