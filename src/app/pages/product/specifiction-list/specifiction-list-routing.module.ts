import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpecifictionListPage } from './specifiction-list.page';

const routes: Routes = [
  {
    path: '',
    component: SpecifictionListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpecifictionListPageRoutingModule {}
