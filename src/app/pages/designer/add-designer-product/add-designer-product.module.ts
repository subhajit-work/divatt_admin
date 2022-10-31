import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddDesignerProductPageRoutingModule } from './add-designer-product-routing.module';

import { AddDesignerProductPage } from './add-designer-product.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AddDesignerProductPageRoutingModule
  ],
  declarations: [AddDesignerProductPage]
})
export class AddDesignerProductPageModule {}
