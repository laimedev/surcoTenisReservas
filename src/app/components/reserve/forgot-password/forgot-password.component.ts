import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';
  isLoading: boolean = false;
 
  constructor(private http: HttpClient,public router: Router,) {}
  
  sendResetRequest() {
    this.isLoading = true;
    this.http.post('https://api-rest-tennis.joseyzambranov.repl.co/api/forgot-password', { email: this.email })
      .subscribe(
        (response:any) => {
          this.isLoading = false;
          this.message = response.message;
          Swal.fire({
            icon: 'success',
            title: `${response.message}`,
            text:  `Porfavor revise su correo electronico`,
            confirmButtonText: 'Ok, muchas gracias!!',
          }).then(()=>{
              
            this.router.navigate(['/reserve/']);
              setTimeout(() => {
                this.router.navigate(['/reserve/']);
              }, 1000);

          })
          
        },
        (error) => {
          this.isLoading = false;
          Swal.fire({
            icon: 'warning',
            text:  `Error al enviar el correo electronico ${error.error.error}`,
            confirmButtonText: 'Ok, muchas gracias!!',
          })
          this.message = error.error.error;
          console.error(error);
        }
        
      );
      
  }
}
