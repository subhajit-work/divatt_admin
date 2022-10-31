import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddRolePageRoutingModule } from './add-role-routing.module';

import { AddRolePage } from './add-role.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AddRolePageRoutingModule
  ],
  declarations: [AddRolePage]
})
export class AddRolePageModule {}
