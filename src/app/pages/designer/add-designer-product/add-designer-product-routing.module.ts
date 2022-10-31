import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddDesignerProductPage } from './add-designer-product.page';

const routes: Routes = [
  {
    path: '',
    component: AddDesignerProductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddDesignerProductPageRoutingModule {}
