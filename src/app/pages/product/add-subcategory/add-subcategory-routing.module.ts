import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSubcategoryPage } from './add-subcategory.page';

const routes: Routes = [
  {
    path: '',
    component: AddSubcategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddSubcategoryPageRoutingModule {}
