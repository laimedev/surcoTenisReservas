import { Component } from '@angular/core';
import { RegistroService } from '../services/registro.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  constructor(
    private registroService: RegistroService,
    private router: Router,
    private toastr: ToastrService,
    ) {}

  registerUser(formValue: any) {
    const datosRegistro = {
      numDocumento: formValue.numDocumento,
      nombres: formValue.nombres,
      email: formValue.email,
      telefono: formValue.telefono,
      password: formValue.password,
      passwordConfirmation: formValue.passwordConfirmation,
      tipo_documento: formValue.tipo_documento,
      primer_apellido: formValue.primerApellido,
      segundo_apellido: formValue.segundoApellido,
      nivel: formValue.nivel,
      posicion: formValue.posicion,
      genero: formValue.genero,
      fechNac: formValue.fechaNacimiento
    };

    this.registroService.registrarCliente(datosRegistro)
      .subscribe(
        response => {
          // Registro exitoso, mostrar mensaje y redireccionar
          this.toastr.success('Registro exitoso', 'Éxito');
          this.router.navigate(['/reserve/login']); // Cambiar la ruta a la del login
        },
        error => {
          // Manejar errores en el registro
          this.toastr.error('Error en el registro::', error);
          console.error('Error en el registro:', error);
        }
      );
  }

}
