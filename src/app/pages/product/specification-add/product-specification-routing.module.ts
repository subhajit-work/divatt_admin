import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductSpecificationPage } from './product-specification.page';

const routes: Routes = [
  {
    path: '',
    component: ProductSpecificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductSpecificationPageRoutingModule {}
