import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddLabelPageRoutingModule } from './add-label-routing.module';

import { AddLabelPage } from './add-label.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AddLabelPageRoutingModule
  ],
  declarations: [AddLabelPage]
})
export class AddLabelPageModule {}
