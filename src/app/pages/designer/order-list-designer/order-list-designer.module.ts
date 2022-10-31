import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderListDesignerPageRoutingModule } from './order-list-designer-routing.module';

import { OrderListDesignerPage } from './order-list-designer.page';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    OrderListDesignerPageRoutingModule
  ],
  declarations: [OrderListDesignerPage]
})
export class OrderListDesignerPageModule {}
