import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{


  errorSession: boolean = false
  formLogin: FormGroup = new FormGroup({});

  constructor(private cookie: CookieService,
              public authService: AuthService){

  }


  ngOnInit(): void {

    this.formLogin = new FormGroup(
      {
        email: new FormControl('charly4@gmail.com', [
          Validators.required,
        ]),
        password: new FormControl('123456',
          [
            Validators.required,
          ])
      }
    )

  }



  sendLogin(): void {
      if(this.formLogin.valid) {
        this.authService.sendCredentials(this.formLogin.value)
        .subscribe(resp => {
          console.log(resp);
        },
          err => {
            this.errorSession = true
            console.log('Ocurrio error con tu email o password');
          })
    } else {

      
    }
  }




 
}
