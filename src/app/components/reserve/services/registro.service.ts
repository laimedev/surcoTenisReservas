import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  apiUrl = `${environment.url}api/register`;

  constructor(private http: HttpClient) {}

  registrarCliente(datosRegistro: any) {
    return this.http.post(this.apiUrl, datosRegistro);
  }
}
