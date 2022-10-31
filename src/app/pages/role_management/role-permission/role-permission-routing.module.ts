import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RolePermissionPage } from './role-permission.page';

const routes: Routes = [
  {
    path: '',
    component: RolePermissionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolePermissionPageRoutingModule {}
