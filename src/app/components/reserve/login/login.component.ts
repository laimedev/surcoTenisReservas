import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'ngx-webstorage-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  isLoading: boolean | undefined;

  errorSession: boolean = false
  formLogin: FormGroup = new FormGroup({});

  constructor(
    private cookie: CookieService,
    public authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  
    ){
      
  }

  ngOnInit(): void {

    this.formLogin = new FormGroup(
      {
        email: new FormControl('jose4@gmail.com', [
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

    this.isLoading = true; // Mostrar el spinner de carga


      if(this.formLogin.valid) {
        this.authService.sendCredentials(this.formLogin.value)
        .subscribe(resp => {

          this.isLoading = false; 


          const userData = {
            nombre: resp.nombre,
            token: resp.token,
            codCliente: resp.codCliente
          };
          const userDataJson = JSON.stringify(userData);
          localStorage.setItem('userData', userDataJson);
          localStorage.setItem('token', resp.token);

          this.toastr.success('Credenciales exitosas', 'Éxito');

          this.router.navigate(["/reserve/profile"])

          setTimeout(() => {
            this.router.navigate(['/reserve/profile']);
            location.reload();
          }, 1000);



        },
          err => {
            this.errorSession = true
            this.isLoading = false; 

            //console.log('Ocurrio error con tu email o password');
            this.toastr.error('Ocurrio error con tu email o password:', err);
            console.error('Ocurrio error con tu email o password:', err);
          })
    } else {
      this.toastr.error('Todos los datos son importantes');
      
    }
  }




 
}
