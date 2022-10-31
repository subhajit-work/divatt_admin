import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddSubcategoryPageRoutingModule } from './add-subcategory-routing.module';

import { AddSubcategoryPage } from './add-subcategory.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AddSubcategoryPageRoutingModule
  ],
  declarations: [AddSubcategoryPage]
})
export class AddSubcategoryPageModule {}
