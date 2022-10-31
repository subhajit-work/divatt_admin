import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderProductsListPageRoutingModule } from './order-products-list-routing.module';

import { OrderProductsListPage } from './order-products-list.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    OrderProductsListPageRoutingModule
  ],
  declarations: [OrderProductsListPage]
})
export class OrderProductsListPageModule {}
