import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DesignerLabelPage } from './designer-label.page';

const routes: Routes = [
  {
    path: '',
    component: DesignerLabelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignerLabelPageRoutingModule {}
