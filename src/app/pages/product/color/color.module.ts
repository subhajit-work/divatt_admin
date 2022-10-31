import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ColorPageRoutingModule } from './color-routing.module';

import { ColorPage } from './color.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ColorPageRoutingModule
  ],
  declarations: [ColorPage]
})
export class ColorPageModule {}
