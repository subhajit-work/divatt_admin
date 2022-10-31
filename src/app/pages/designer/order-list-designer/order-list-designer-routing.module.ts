import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderListDesignerPage } from './order-list-designer.page';

const routes: Routes = [
  {
    path: '',
    component: OrderListDesignerPage
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderListDesignerPageRoutingModule {}
