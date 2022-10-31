import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEmployeePage } from './add-employee.page';

const routes: Routes = [
  {
    path: '',
    component: AddEmployeePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddEmployeePageRoutingModule {}
