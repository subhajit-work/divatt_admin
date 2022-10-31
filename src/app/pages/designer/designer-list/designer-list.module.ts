import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DesignerListPageRoutingModule } from './designer-list-routing.module';

import { DesignerListPage } from './designer-list.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    DesignerListPageRoutingModule
  ],
  declarations: [DesignerListPage]
})
export class DesignerListPageModule {}
