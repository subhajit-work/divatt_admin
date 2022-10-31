import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddHsnPageRoutingModule } from './add-hsn-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { AddHsnPage } from './add-hsn.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AddHsnPageRoutingModule
  ],
  declarations: [AddHsnPage]
})
export class AddHsnPageModule {}
