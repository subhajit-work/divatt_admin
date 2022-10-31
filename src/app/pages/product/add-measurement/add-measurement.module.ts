import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddMeasurementPageRoutingModule } from './add-measurement-routing.module';

import { AddMeasurementPage } from './add-measurement.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AddMeasurementPageRoutingModule
  ],
  declarations: [AddMeasurementPage]
})
export class AddMeasurementPageModule {}
