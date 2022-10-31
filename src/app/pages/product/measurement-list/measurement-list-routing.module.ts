import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeasurementListPage } from './measurement-list.page';

const routes: Routes = [
  {
    path: '',
    component: MeasurementListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeasurementListPageRoutingModule {}
