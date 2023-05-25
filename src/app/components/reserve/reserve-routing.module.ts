import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CalendarFullComponent } from './calendar-full/calendar-full.component';
import { HeaderComponent } from '../header/header.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';


const routes: Routes = [
  {path: 'reserve', children: [
    {path: '', component: CalendarFullComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'profile', component: ProfileComponent},
    { path: '', component: HeaderComponent, outlet: 'header' },
  ]}
];


@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReserveRoutingModule { }
