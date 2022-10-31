import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BannerListPageRoutingModule } from './banner-list-routing.module';

import { BannerListPage } from './banner-list.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    BannerListPageRoutingModule
  ],
  declarations: [BannerListPage]
})
export class BannerListPageModule {}
