import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BannerListPage } from './banner-list.page';

const routes: Routes = [
  {
    path: '',
    component: BannerListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BannerListPageRoutingModule {}
