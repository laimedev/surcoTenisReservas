import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { Observable } from 'rxjs';



export declare let Culqi: any;


@Injectable({
  providedIn: 'root'
})
export class ReserveService {
  public token_id?: string;

  private readonly URL = environment.urlBase
  constructor(private http: HttpClient) {
    document.addEventListener ('payment_event', (token: any) => {
      this.token_id = token.detail;
      console.log(this.token_id)
    });

   }


   initCulqi () {
    Culqi.publicKey  = "pk_test_94tTaKyy2oea3bQf"
  }

  payorder(description: string, amount: number) {
    Culqi.settings ({
      title: 'Culqi Store',
      currency: 'PEN',
      description: description,
      amount: amount*100
    });

    Culqi.options({
      lang: 'auto',
      modal: true,
      installments: false,
      customButton:"",
  });
  Culqi.open ();

  }

  open () {
    Culqi.open ();
  }







  getLocalidad(): Observable<any> {
    return this.http.get(`${this.URL}localidad/listar`)
  }



}
