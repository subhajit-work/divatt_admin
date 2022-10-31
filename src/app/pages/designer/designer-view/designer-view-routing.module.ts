import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DesignerViewPage } from './designer-view.page';

const routes: Routes = [
  {
    path: '',
    component: DesignerViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignerViewPageRoutingModule {}
