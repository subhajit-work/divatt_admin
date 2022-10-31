import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonHeaderComponent } from '../common-component/common-header/common-header.component';
// Material module start
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatRippleModule} from '@angular/material/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatStepperModule} from '@angular/material/stepper';
// Material module end
import { ProgressBarModule } from 'angular-progress-bar';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgSelectModule } from '@ng-select/ng-select'; // angular dropdown
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { CommonFooterComponent } from '../common-component/common-footer/common-footer.component';
import { MustMatchDirective } from '../directives/directives/must-match.directive';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    CommonHeaderComponent, //header component share
    CommonFooterComponent, //footer component share
    MustMatchDirective
  ],
  imports: [
    CommonModule,
    IonicModule,
    
    // Material module start
    MatExpansionModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatBadgeModule,
    MatButtonModule,
    MatRippleModule,
    MatTabsModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatStepperModule,
    SlickCarouselModule,
    // Material module end
    ProgressBarModule,
    NgApexchartsModule,
    NgSelectModule, // angular dropdown
    MatCheckboxModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  exports: [
    CommonHeaderComponent, //header component share
    CommonFooterComponent, //footer component share
    MustMatchDirective,
    // Material module start
    MatTooltipModule,
    IonicModule,
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatButtonModule,
    MatRippleModule,
    MatTabsModule,
    SlickCarouselModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatStepperModule,
    // Material module end
    ProgressBarModule,
    NgApexchartsModule,
    NgSelectModule, // angular dropdown
    MatCheckboxModule,
    MatDatepickerModule,
    MatProgressSpinnerModule
  ]
})
export class SharedModule { }
