import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DesignerViewPageRoutingModule } from './designer-view-routing.module';

import { DesignerViewPage } from './designer-view.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    DesignerViewPageRoutingModule
  ],
  declarations: [DesignerViewPage]
})
export class DesignerViewPageModule {}
