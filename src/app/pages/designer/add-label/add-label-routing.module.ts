import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddLabelPage } from './add-label.page';

const routes: Routes = [
  {
    path: '',
    component: AddLabelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddLabelPageRoutingModule {}
