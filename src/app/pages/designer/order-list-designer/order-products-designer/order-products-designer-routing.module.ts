import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderProductsDesignerPage } from './order-products-designer.page';

const routes: Routes = [
  {
    path: '',
    component: OrderProductsDesignerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderProductsDesignerPageRoutingModule {}
