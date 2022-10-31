import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductSpecificationPageRoutingModule } from './product-specification-routing.module';

import { ProductSpecificationPage } from './product-specification.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ProductSpecificationPageRoutingModule
  ],
  declarations: [ProductSpecificationPage]
})
export class ProductSpecificationPageModule {}
