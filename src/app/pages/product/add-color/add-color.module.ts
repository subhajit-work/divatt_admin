import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddColorPageRoutingModule } from './add-color-routing.module';

import { AddColorPage } from './add-color.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AddColorPageRoutingModule
  ],
  declarations: [AddColorPage]
})
export class AddColorPageModule {}
