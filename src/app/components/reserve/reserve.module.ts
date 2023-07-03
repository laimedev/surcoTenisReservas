import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { CalendarFullComponent } from './calendar-full/calendar-full.component';
import { ReserveRoutingModule } from './reserve-routing.module';
import { NgbCarousel, NgbModule,NgbActiveModal,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { FullCalendarModule } from '@fullcalendar/angular';
import { ProfileComponent } from './profile/profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
//import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    ReserveRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    FullCalendarModule   , 
  ],
  providers: [NgbActiveModal,NgbModal ],
})
export class ReserveModule { }
