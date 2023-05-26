import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PdfMakeWrapper, Txt, Img, Table, QR } from 'pdfmake-wrapper';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public userData = JSON.parse(localStorage.getItem("userData")!);


  isLoading: boolean | undefined;



  public dia: any = [
    { value: "01", label: "01"},
    { value: "02", label: "02"},
    { value: "03", label: "03"},
    { value: "04", label: "04"},
    { value: "05", label: "05"},
    { value: "06", label: "06"},
    { value: "07", label: "07"},
    { value: "08", label: "08"},
    { value: "09", label: "09"},
    { value: "10", label: "10"},
    { value: "11", label: "11"},
    { value: "12", label: "12"},
    { value: "13", label: "13"},
    { value: "14", label: "14"},
    { value: "15", label: "15"},
    { value: "16", label: "16"},
    { value: "17", label: "17"},
    { value: "18", label: "18"},
    { value: "19", label: "19"},
    { value: "20", label: "20"},
    { value: "21", label: "21"},
    { value: "22", label: "22"},
    { value: "23", label: "23"},
    { value: "24", label: "24"},
    { value: "25", label: "25"},
    { value: "26", label: "26"},
    { value: "27", label: "27"},
    { value: "28", label: "28"},
    { value: "29", label: "29"},
    { value: "30", label: "30"},
    { value: "31", label: "31"},
  ];


  public mes: any = [
    { value: "01", label: "Enero"},
    { value: "02", label: "Febrero"},
    { value: "03", label: "Marzo"},
    { value: "04", label: "Abril"},
    { value: "05", label: "Mayo"},
    { value: "06", label: "Junio"},
    { value: "07", label: "Julio"},
    { value: "08", label: "Agosto"},
    { value: "09", label: "Setiembre"},
    { value: "10", label: "Octubre"},
    { value: "11", label: "Noviembre"},
    { value: "12", label: "Diciembre"},
  ]

  public anio: any = [
    { value: "2023", label: "2023"},
    { value: "2022", label: "2022"},
    { value: "2021", label: "2021"},
    { value: "2020", label: "2020"},
    { value: "2019", label: "2019"},
    { value: "2018", label: "2018"},
    { value: "2017", label: "2017"},
    { value: "2016", label: "2016"},
    { value: "2015", label: "2015"},
    { value: "2014", label: "2014"},
    { value: "2013", label: "2013"},
    { value: "2012", label: "2012"},
    { value: "2011", label: "2011"},
    { value: "2010", label: "2010"},
    { value: "2009", label: "2009"},
    { value: "2008", label: "2008"},
    { value: "2007", label: "2007"},
    { value: "2006", label: "2006"},
    { value: "2005", label: "2005"},
    { value: "2004", label: "2004"},
    { value: "2003", label: "2003"},
    { value: "2002", label: "2002"},
    { value: "2001", label: "2001"},
    { value: "2000", label: "2000"},
    { value: "1999", label: "1999"},
    { value: "1998", label: "1998"},
    { value: "1997", label: "1997"},
    { value: "1996", label: "1996"},
    { value: "1995", label: "1995"},
    { value: "1994", label: "1994"},
    { value: "1993", label: "1993"},
    { value: "1992", label: "1992"},
    { value: "1991", label: "1991"},
    { value: "1990", label: "1990"},
    { value: "1989", label: "1989"},
    { value: "1988", label: "1988"},
    { value: "1987", label: "1987"},
    { value: "1986", label: "1986"},
    { value: "1985", label: "1985"},
    { value: "1984", label: "1984"},
    { value: "1983", label: "1983"},
    { value: "1982", label: "1982"},
    { value: "1981", label: "1981"},
    { value: "1980", label: "1980"},
    { value: "1979", label: "1979"},
    { value: "1978", label: "1978"},
    { value: "1977", label: "1977"},
    { value: "1976", label: "1976"},
    { value: "1975", label: "1975"},
    { value: "1974", label: "1974"},
    { value: "1973", label: "1973"},
    { value: "1972", label: "1972"},
    { value: "1971", label: "1971"},
    { value: "1970", label: "1970"},
    { value: "1969", label: "1969"},
    { value: "1968", label: "1968"},
    { value: "1967", label: "1967"},
    { value: "1966", label: "1966"},
    { value: "1965", label: "1965"},
    { value: "1964", label: "1964"},
    { value: "1963", label: "1963"},
    { value: "1962", label: "1962"},
    { value: "1961", label: "1961"},
    { value: "1960", label: "1960"},
    { value: "1959", label: "1959"},
    { value: "1958", label: "1958"},
    { value: "1957", label: "1957"},
    { value: "1956", label: "1956"},
    { value: "1955", label: "1955"},
  ]

  errorSession: boolean = false
  formRegister: FormGroup = new FormGroup({});


  dateDay: any = '';
  dateMonth: any = '';
  dateYear: any = '';
  submitted = false;


  reservas: any = [];



  constructor(public http: HttpClient,
    public router: Router){

    this.formRegister = new FormGroup({
        tipo_documento: new FormControl('', [ Validators.required,]),
        numDocumento: new FormControl('', [ Validators.required,]),
        nombres: new FormControl('', [ Validators.required]),
        primer_apellido: new FormControl('', [ Validators.required]),
        segundo_apellido: new FormControl('', [ Validators.required]),

        genero: new FormControl('', [ Validators.required]),
        email: new FormControl('', [ Validators.required]),
        telefono: new FormControl('', [ Validators.required]),
        nivel: new FormControl('', [ Validators.required]),
        posicion: new FormControl('', [ Validators.required]),
      }
    )

  }

  ngOnInit(){

    this.getInfoClient();
    this.getReserveByClient();

  }

  



  getReserveByClient(){
    const token = localStorage.getItem("token");
		const authToken = `Bearer ${token}` ;
		const headers =  new HttpHeaders({
		'Authorization': authToken
		});

    const url = `https://api-rest-tennis.joseyzambranov.repl.co/api/registro-cliente/listar-cliente/${this.userData.codCliente}`;

    this.http.get<any[]>(url, {headers}).subscribe(
      (data: any) => {
        
        this.reservas = data;
        console.log(data);

      },
      (error: any) => {
        console.log('Error fetching events:', error);
      }
    );


  }


  getInfoClient(){

    const token = localStorage.getItem("token");
		const authToken = `Bearer ${token}` ;
		const headers =  new HttpHeaders({
		'Authorization': authToken
		});

    const url = `https://api-rest-tennis.joseyzambranov.repl.co/api/cliente/perfil/${this.userData.codCliente}`;
    this.http.get<any[]>(url, {headers}).subscribe(
      (data: any) => {
        
        console.log(data);

        this.formRegister.get('tipo_documento')?.setValue(data.tipo_documento);
        this.formRegister.get('numDocumento')?.setValue(data.numDocumento);
        this.formRegister.get('nombres')?.setValue(data.nombres);
        this.formRegister.get('primer_apellido')?.setValue(data.primer_apellido);
        this.formRegister.get('segundo_apellido')?.setValue(data.segundo_apellido);
        this.formRegister.get('genero')?.setValue(data.genero);
        this.formRegister.get('telefono')?.setValue(data.telefono);
        this.formRegister.get('email')?.setValue(data.email);
        this.formRegister.get('nivel')?.setValue(data.nivel);
        this.formRegister.get('posicion')?.setValue(data.posicion);

      },
      (error: any) => {
        console.log('Error fetching events:', error);
      }
    );
  }




  sendRegister(){


  }





  setDay(event: any){
    this.dateDay = event.target.value;
  }

  setMonth(event: any){
    this.dateMonth = event.target.value;
  }

  setYear(event: any){
    this.dateYear = event.target.value;
  }




  isControlValid(controlName: string): boolean {
		const control = this.formRegister.controls[controlName];
		return control.valid && (control.dirty || control.touched);
	}

	isControlInvalid(controlName: string): boolean {
		const control = this.formRegister.controls[controlName];
		return control.invalid && (control.dirty || control.touched);
	}

	controlHasError(validation: string, controlName: string) {
		const control = this.formRegister.controls[controlName];
		return control.hasError(validation) && (control.dirty || control.touched);
	}

	isControlTouched(controlName: string): boolean {
		const control = this.formRegister.controls[controlName];
		return control.dirty || control.touched;
	}




  logout(){
    

    Swal.fire({
      title: '¿Desea salir de la sesión?',
      text: `Se cerrara la sesión que mantiene activa.` ,
      icon: 'info',
      confirmButtonColor: '#BB2D3B',
      denyButtonColor:  '#1E2B37',
      showDenyButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Si, cerrar!',
      denyButtonText: 'No, cancelar'
      }).then((result) => {
        if(result.isConfirmed){
          console.log('si');
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          this.router.navigate(["/reserve"])

          setTimeout(() => {
            this.router.navigate(['/reserve']);
            location.reload();
          }, 1000);

        } else if(result.isDenied) {
          console.log('no');
        }
      })


  }



  async imprimir(data: any){
    // this.compras.serSel = compras;
    // console.log(this.compras.serSel._id);



    // this.tokio = this.compras.serSel.total;
    // console.log(this.tokio);
    // let ClaseConversor = conversor.conversorNumerosALetras;
    // let miConversor = new ClaseConversor();
    // var int_part = Math.trunc(this.tokio); 
    // var  n = (this.tokio + "").split(".");
    // var a = miConversor.convertToText(int_part);


    // if(this.tokio % 1 == 0){
    //   // this.totalTexto = a.toUpperCase() + ' Y  00/100 SOLES';
    // }
    // else {
    //   // this.totalTexto = a.toUpperCase() + ' Y ' + n[1] + '/100 SOLES'; 
    // }





    var titulo = 'EMPRESA MUNICIPAL SANTIAGO DE SURCO SA';
    var espacio = '   ';
    const pdf = new PdfMakeWrapper();
    pdf.pageSize('A7');
    pdf.pageMargins([ 8, 8, 10, 10 ]);
    pdf.info({
      title: 'TENIS Reserva - Ticket',
      author: 'laimedeveloper',
      subject: 'ticketReserva',
    });

    pdf.defaultStyle({
      fontSize: 7
    });

    pdf.add( await new Img(this.logoSurco).width('50').alignment('center').build() );
    pdf.add( new Txt(espacio).end);
    pdf.add( new Txt(titulo).alignment('center').bold().italics().end);
    pdf.add( new Txt('RUC. 20502733851 ').alignment('center').italics().end);
    pdf.add( new Txt('Calle Cerro Rico S/N Urb. San Ignacio De Monterrico').alignment('center').italics().end);
    pdf.add( new Txt('---------------------------------------------------------------------------------------------------').alignment('center').italics().end);
    pdf.add( new Txt('Ticket de reserva Nº ' + data.codRegistro + ' ' + ' ' + data.nomLocalidad).alignment('center').italics().end);
    pdf.add( new Txt('---------------------------------------------------------------------------------------------------').alignment('center').italics().end);
    pdf.add( new Txt( 'CLiente: ' + data.nomCliente + ' ' + data.primer_apellido + ' Nº documento: ' +  data.numDocumento ).alignment('center').italics().end);
    pdf.add( new Txt('---------------------------------------------------------------------------------------------------').alignment('center').italics().end);
    
    pdf.add (new Table([
      [ 'HORA INI', 'HORA FIN' ,'DURACIÓN' ,'TARIFA'],
      [ 
        data.horainicio , 
        data.horafinal ,
        data.duracion, 
        data.costoTarifa, 
      ],
  ]).alignment('left').italics().layout('noBorders').widths([ 40,40,35,50  ]).end);
  
  pdf.add( new Txt('---------------------------------------------------------------------------------------------------').alignment('center').italics().end);

  pdf.add( new Txt(espacio).end);
  
    pdf.add(new QR(data.codRegistro+'0000').fit(60).alignment('center').end);
    
  pdf.add( new Txt(espacio).end);
    

    pdf.add( new Txt('Su reservación se encuentra en estado ' + data.estadoRegistro  + ' cominiquese al siguiente numero (51)935-826-680, ó acerquese al centro para realizar el pago y disfrutar del juego.').alignment('center').italics().end);
    pdf.add( new Txt(espacio).end);
    pdf.add( new Txt('MUCHAS GRACIAS POR SU PREFERENCIA').alignment('center').bold().italics().end);
    pdf.add( new Txt(espacio).end);

    pdf.add( new Txt('www.surcotenis.pe').alignment('center').italics().end);
    pdf.add( new Txt(espacio).end);
    pdf.add( new Date().toLocaleString());
    pdf.add( new Txt(espacio).end);
    pdf.create().open();
  }




 
  logoSurco = "data:image/png;base64,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";



}
