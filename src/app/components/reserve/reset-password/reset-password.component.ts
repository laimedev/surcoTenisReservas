import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  password: string | undefined;
  message: string | undefined;
  isLoading:boolean|undefined;
  showPassword = false;
  passwordToggleIcon = "fa fa-eye-slash";

  constructor(private http: HttpClient,public router: Router) {}

  resetPassword(): void {
    this.isLoading = true;
    const token = window.location.href.split('?token=')[1];
    const resetUrl = `${environment.url}api/forgot-password/reset-password`;
    const body = { token, password: this.password };

    this.http.post(resetUrl, body)
      .subscribe(
        (response:any) => {
          this.isLoading = false;
          this.message = response.message;
          Swal.fire({
            icon: 'success',
            title: `${response.message}`,
            confirmButtonText: 'Ok, muchas gracias!!',
          }).then(()=>{

            this.router.navigate(['/reserve/login']);
              setTimeout(() => {
                this.router.navigate(['/reserve/login']);
              }, 1000);

          })

        },
        (error) => {
          this.isLoading = false;
          Swal.fire({
            icon: 'warning',
            text:  `Error al resetear la contraseña ${error.error.error}`,
            confirmButtonText: 'Ok, muchas gracias!!',
          })
          this.message = error.error.error;
          console.error(error);
        }

      );
  }
  togglePassword(): void {
    this.showPassword = !this.showPassword;
    if (this.passwordToggleIcon == 'fa fa-eye-slash'){
      this.passwordToggleIcon = 'fa fa-eye'
    } else {
      this.passwordToggleIcon = 'fa fa-eye-slash';
    }
  }
}
