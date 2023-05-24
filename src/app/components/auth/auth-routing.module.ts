import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  {path: 'login', children: [
    {path: '', component: LoginComponent},
    { path: '', component: HeaderComponent, outlet: 'header' },
  ]}
];




@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class AuthRoutingModule { }
