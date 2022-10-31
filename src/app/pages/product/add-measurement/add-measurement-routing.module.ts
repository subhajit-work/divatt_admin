import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMeasurementPage } from './add-measurement.page';

const routes: Routes = [
  {
    path: '',
    component: AddMeasurementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddMeasurementPageRoutingModule {}
