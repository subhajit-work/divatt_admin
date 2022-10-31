import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpecifictionListPageRoutingModule } from './specifiction-list-routing.module';

import { SpecifictionListPage } from './specifiction-list.page';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    SpecifictionListPageRoutingModule
  ],
  declarations: [SpecifictionListPage]
})
export class SpecifictionListPageModule {}
