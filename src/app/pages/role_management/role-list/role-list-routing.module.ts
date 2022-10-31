import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoleListPage } from './role-list.page';

const routes: Routes = [
  {
    path: '',
    component: RoleListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoleListPageRoutingModule {}
