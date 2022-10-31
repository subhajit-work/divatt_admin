import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ColorPage } from './color.page';

const routes: Routes = [
  {
    path: '',
    component: ColorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ColorPageRoutingModule {}
