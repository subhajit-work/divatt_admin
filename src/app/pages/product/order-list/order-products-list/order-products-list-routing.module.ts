import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderProductsListPage } from './order-products-list.page';

const routes: Routes = [
  {
    path: '',
    component: OrderProductsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderProductsListPageRoutingModule {}
