import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DesignerListPage } from './designer-list.page';

const routes: Routes = [
  {
    path: '',
    component: DesignerListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignerListPageRoutingModule {}
