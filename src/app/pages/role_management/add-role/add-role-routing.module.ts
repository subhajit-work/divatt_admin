import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddRolePage } from './add-role.page';

const routes: Routes = [
  {
    path: '',
    component: AddRolePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddRolePageRoutingModule {}
