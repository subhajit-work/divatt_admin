import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HsnListPageRoutingModule } from './hsn-list-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { HsnListPage } from './hsn-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    HsnListPageRoutingModule
  ],
  declarations: [HsnListPage]
})
export class HsnListPageModule {}
