import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { Observable } from 'rxjs';

import { Component, HostListener } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CalendarFullComponent } from '../calendar-full/calendar-full.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';




export declare let Culqi: any;


@Injectable({
  providedIn: 'root'
})
export class ReserveService {
  public token_id?: string;

  TOKEN_CULQI = '';

  userDataJson: string | null | undefined;

  // DESARROLLO
  culqiKeyPublic = 'pk_test_3d5b167a050827d7';
  culqiKeyPrivate = 'sk_test_ea5045ad1a6bbb69';


  // PRODUCCION 
  // culqiKeyPublic = 'pk_live_ea1621fef7a79560';
  // culqiKeyPrivate = 'sk_live_5a6b4703c558ce41';

  private readonly URL = environment.urlBase
  constructor(private http: HttpClient,
    public router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
    // public calendarFull: CalendarFullComponent
    ) {
    document.addEventListener ('payment_event', (token: any) => {
      this.token_id = token.detail;
      console.log(this.token_id)
      console.log(token.email)

      let  dataPago = {
        source_id: this.token_id,
        email: 'alaimes64@gmail.com',
        currency_code: 'PEN',
        amount: JSON.parse(localStorage.getItem('paymentPrice')!) + '00'
      } 

      this.sendDataToCulqi(dataPago);

    });

   }


   @HostListener('document:payment_event', ['$event'])
   onPaymentEventCustom($event: CustomEvent) {
     this.TOKEN_CULQI = $event.detail;
   }

   initCulqi () {
    // Culqi.publicKey  = "pk_test_94tTaKyy2oea3bQf"
    Culqi.publicKey  = this.culqiKeyPublic
    // pk_live_ea1621fef7a79560   public
    // sk_live_5a6b4703c558ce41  privada
  }

  payorder(description: string, amount: number) {
    Culqi.settings ({
      title: 'Surco Tenis',
      currency: 'PEN',
      description: description,
      amount: amount*100
    });

    Culqi.options({
      lang: "auto",
      installments: false, // Habilitar o deshabilitar el campo de cuotas
      paymentMethods: {
        tarjeta: true,
        yape: false, 
        bancaMovil: true,
        agente: true,
        billetera: true,
        cuotealo: true,
      },
    });


    Culqi.options({
      style: {
        logo: 'https://surcotenis.pe/wp-content/uploads/2023/05/logo-300x140.png',
        bannerColor: '#157347', // hexadecimal
        buttonBackground: '#157347', // hexadecimal
        menuColor: '', // hexadecimal
        linksColor: '', // hexadecimal
        buttonText: '', // texto que tomará el botón
        buttonTextColor: '', // hexadecimal
        priceColor: '' // hexadecimal
      }
  });


  Culqi.open ();

  }

  open () {
    Culqi.open ();
  }





  getTokenCulqi(data: any) {
    let headers = new HttpHeaders({"Authorization": "Bearer pk_live_ea1621fef7a79560"});
    return this.http.post("https://secure.culqi.com/v2/tokens", data, { headers: headers});
  }

  sendDataToCulqi(data: any){
    let headers = new HttpHeaders({"Authorization": `Bearer ${this.culqiKeyPrivate}`});
    return this.http.post("https://api.culqi.com/v2/charges", data, { headers: headers}).subscribe(
      (resp: any) => {



        

        this.userDataJson = localStorage.getItem('userData');
        const userData = JSON.parse(this.userDataJson?this.userDataJson:"");
        const url = 'https://api-rest-tennis-joseyzambranov.replit.app/api/registro-cliente/guardar';
        const dataPayment =  JSON.parse(localStorage.getItem('dataPayment')!);
         const httpOptions = {
          headers: {
            Authorization: `Bearer ${userData.token}`
          }
        };
        this.http.post(url, dataPayment, httpOptions).subscribe(
          (response) => {
            this.toastr.success('Reserva guardada con éxito:', 'Éxito');



            // this.modalService.dismissAll();
            // this.calendarFull.loadEvents()
            // this.calendarFull.isLoading2 = false; 
          },
          (error) => {
            this.toastr.error('Error al guardar la reserva:', error.error);
            // this.calendarFull.isLoading2 = false; 
          }
        );





        Swal.fire({
          icon: 'success',
          title: `${resp['outcome'].user_message}`,
          text:  `${resp['outcome'].merchant_message}`,
          confirmButtonText: 'Ok, muchas gracias!!',
        })
         Culqi.close();
      },
      (error) => {
        Swal.fire({
          icon: 'warning',
          text: `${error.error.user_message}`,
          confirmButtonText: 'Ok, entendido',
        })
        Culqi.close();
      },
      () => {
        console.log("La petición se completó correctamente.");
      }
    );
  }




  



  getLocalidad(): Observable<any> {
    return this.http.get(`${this.URL}localidad/listar`)
  }



}
