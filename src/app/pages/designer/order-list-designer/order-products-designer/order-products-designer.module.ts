import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderProductsDesignerPageRoutingModule } from './order-products-designer-routing.module';

import { OrderProductsDesignerPage } from './order-products-designer.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    OrderProductsDesignerPageRoutingModule
  ],
  declarations: [OrderProductsDesignerPage]
})
export class OrderProductsDesignerPageModule {}
