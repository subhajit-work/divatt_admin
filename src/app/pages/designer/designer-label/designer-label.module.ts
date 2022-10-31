import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DesignerLabelPageRoutingModule } from './designer-label-routing.module';

import { DesignerLabelPage } from './designer-label.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    DesignerLabelPageRoutingModule
  ],
  declarations: [DesignerLabelPage]
})
export class DesignerLabelPageModule {}
