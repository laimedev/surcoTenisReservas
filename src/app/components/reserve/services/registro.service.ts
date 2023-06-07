import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  apiUrl = 'https://api-rest-tennis.joseyzambranov.repl.co/api/register';

  constructor(private http: HttpClient) {}

  registrarCliente(datosRegistro: any) {
    return this.http.post(this.apiUrl, datosRegistro);
  }
}
