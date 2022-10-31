import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RolePermissionPageRoutingModule } from './role-permission-routing.module';

import { RolePermissionPage } from './role-permission.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RolePermissionPageRoutingModule
  ],
  declarations: [RolePermissionPage]
})
export class RolePermissionPageModule {}
