import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ReserveService } from '../services/reserve.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef, ViewChild } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import * as moment from 'moment';
import { SharedModule } from '../../../shared/shared.module';
import esLocale from '@fullcalendar/core/locales/es';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import KRGlue from '@lyracom/embedded-form-glue'
import { firstValueFrom } from 'rxjs'
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'app-calendar-full',
  templateUrl: './calendar-full.component.html',
  styleUrls: ['./calendar-full.component.scss']
})

export class CalendarFullComponent implements OnInit {
  @ViewChild('reservationModal') reservationModal: any;
  @ViewChild('paymentModal') paymentModal: any;

  title: string = 'Reserva de Cancha'
  message: string = ''

  showReservationForm = false;
  reservationForm: any = {
    clientId: null,
    locationId: null,
    startDateTime: null,
    endDateTime: null,
    price:null,
    comment: '',
    timeGame:null,
    }

    calendarVisible = true;

 /***********************************CALENDARIO******************************************* */
  calendarOptions: CalendarOptions = {

    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridDay'
    },
    initialView: 'timeGridDay',
    events: [],
    hiddenDays: this.getHiddenDays(),
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    select: this.handleEventsDate.bind(this),
    slotMinTime: '06:00:00',
    slotMaxTime: '22:00:00',
    slotDuration: '00:60:00',
    contentHeight: 'auto',
    selectLongPressDelay: 0,
    validRange: () => {
      const today = moment().startOf('day');
      const dayOfWeek = today.day(); // Obtener el día de la semana (0: domingo, 1: lunes, 2: martes, 3: miércoles, 4: jueves, 5: viernes, 6: sábado)
      let start, end;
      if (dayOfWeek == 0) { // Si es lunes
        start = today.clone().toDate(); // Inicio: mañana (miercoles)
        end = today.clone().add(4, 'days').toDate();
      }
      if (dayOfWeek == 1) { // Si es lunes
        start = today.clone().toDate(); // Inicio: mañana (miercoles)
        end = today.clone().add(3, 'days').toDate();
      }
      if (dayOfWeek == 2) { // Si es martes
        start = today.clone().toDate(); // Inicio: mañana (miercoles)
        end = today.clone().add(2, 'days').toDate();
      }
      if (dayOfWeek == 3) { // Si es miercoles
        start = today.clone().toDate(); // Inicio: mañana (miercoles)
        end = today.clone().add(3, 'days').toDate(); // Fin: mañana + 3 días (hasta viernes)
      }
      if (dayOfWeek == 4) { // Si es jueves
        start = today.clone().toDate(); // Inicio: mañana (jueves)
        end = today.clone().add(2, 'days').toDate(); // Fin: mañana + 2 días (hasta viernes)
      }
      if (dayOfWeek == 5) {// Si es viernes
        start = today.clone().toDate(); // Inicio: hoy (viernes)
        end = today.clone().add(3, 'days').toDate(); // Fin: hoy + 3 días (hasta domingo)
      }
      if (dayOfWeek == 6) {// Si es sabado
        start = today.clone().toDate(); // Inicio: sábado
        end = today.clone().add(5, 'days').toDate();
      }
      return {
        start: start,
        end: end
      };
    },
    locale: esLocale,
    selectAllow: function(selectInfo) {
      // Obtener la duración de la selección en minutos
      const duration = (selectInfo.end.getTime() - selectInfo.start.getTime()) / (1000 * 60);
      // Permitir solo selecciones de 50 minutos
      return duration === 60 || duration === 120 ;
    },

    slotLabelFormat: [
      { hour: 'numeric', minute: '2-digit', hour12: true, meridiem: 'short'},
      { month: 'short', day: 'numeric', weekday: 'short' }
    ],
    //nowIndicator: true,

  };
  currentEvents: EventApi[] = [];

  product = [{
    description : "Reserva de Cancha Tenis",
    amount: 0
  }];
  currentDate: Date = new Date();

  public localidad: any = [];
  localidadSelect = 2;
  userDataJson: string | null | undefined;
  isLoading: boolean | undefined;
  isLoading2: boolean | undefined;
  spinner: any;

  public valor: number = 50; // Inicializamos el valor en 50
  isSumaDisabled: boolean = false; // Indica si el botón de suma está deshabilitado
  isRestaDisabled: boolean = true; // Indica si el botón de resta está deshabilitado
  payload: {
    ddUsuario: number;
    ddlClientes: any;
    ddlLocalidad: number;
    ddCaja: number;
    txtFecha: string;
    txtHoraInicial: string;
    txtHoraFinal: string;
    txtTiempo: any;
    estado: string;
    pago: number;
    txtComentario: any;
    costoTarifa: any;
    created_at: string;
    updated_at: string;
    venta_id:string;
   } | undefined;
  codRegistro: any;
  clickPage: boolean = false;
  codigoUnico: any;

  constructor(public http: HttpClient,
    private clqSrv : ReserveService,
    public router: Router,
    public reserveServices: ReserveService,
    private changeDetector: ChangeDetectorRef,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private activeModal: NgbActiveModal,
    private chRef: ChangeDetectorRef,
    config: NgbModalConfig
    ){
      config.backdrop = 'static';
      config.keyboard = false;
  }

  ngOnInit(): void {

    this.clqSrv.initCulqi();
    this.loadEvents();
    this.obetenerLocalidades();
    this.userDataJson = localStorage.getItem('userData');
    const userData = JSON.parse(this.userDataJson!);
    this.getInfoClient(userData.codCliente)

  }
/*****************************************\PAGO********************************************* */
  payment(){
    this.clqSrv.payorder(this.product[0]["description"],this.product[0]["amount"]);
  }

  updateLocalidad(event: any){
    this.localidadSelect = event.target.value;
    this.loadEvents();
  }

  irLogin(){
    this.router.navigate(["reserve/login"])
  }
  /********************************LISTAR PEGISTROS************************************ */
  loadEvents() {
    this.isLoading = true;
    const url = `https://api-rest-tennis.joseyzambranov.repl.co/api/registro-cliente/listar/?id=${this.localidadSelect}`;

    this.http.get<any[]>(url).subscribe(
      (data: any[]) => {
        const events = data.map((item) => ({
          id: item.id,
          title: item.title,
          start: formatDate(item.start),
          end: formatDate(item.end),
          backgroundColor: item.backgroundColor,
          textColor: item.textColor,
          extendedProps: item.extendedProps
        }));
        this.isLoading = false;
        this.calendarOptions.events = events;
        this.changeDetector.detectChanges();


      },
      (error: any) => {
        console.log('Error fetching events:', error);
        this.isLoading = false;
      }
    );

    function formatDate(dateString: string): Date {
      const parts = dateString.split(' '); // Separar por espacios
      const formattedDate = `${parts[1]} ${parts[2]} ${parts[3]} ${parts[9]}`; // Formato: 'May 22 2023 12:00:00'

      return moment(formattedDate, 'MMM DD YYYY HH:mm:ss').toDate();
    }
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleEventClick(clickInfo: EventClickArg) {
    Swal.fire({
      //icon: 'error',
      title: 'Fecha no válida',
      text: 'La fecha ya fue seleccionada.',
    });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  handleEventsDate(clickDate: DateSelectArg) {
    const selectedDateTime = moment(clickDate.start.toISOString());

    if (selectedDateTime.isSameOrAfter(moment(), 'minute')) {
      if (this.userDataJson) {
        const dayOfWeek = selectedDateTime.day();
        const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
        const isSaturday = dayOfWeek === 6;
        const isSunday = dayOfWeek === 0;

        let isWithinValidTimeRange = false;
        if (isWeekday) {
          isWithinValidTimeRange = selectedDateTime.isBetween(
            selectedDateTime.clone().set('hour', 6).set('minute', 0),
            selectedDateTime.clone().set('hour', 22).set('minute', 0),
            'minute',
            '[)'
          );
        } else if (isSaturday) {
          isWithinValidTimeRange = selectedDateTime.isBetween(
            selectedDateTime.clone().set('hour', 6).set('minute', 0),
            selectedDateTime.clone().set('hour', 20).set('minute', 0),
            'minute',
            '[)'
          );
        } else if (isSunday) {
          isWithinValidTimeRange = selectedDateTime.isBetween(
            selectedDateTime.clone().set('hour', 6).set('minute', 0),
            selectedDateTime.clone().set('hour', 18).set('minute', 0),
            'minute',
            '[)'
          );
        }

        if (isWithinValidTimeRange) {
          this.showReservationForm = true;
          this.reservationForm.startDateTime = this.formatDateTime(clickDate.start.toISOString());
          const endDateTime = moment(clickDate.end.toISOString()).subtract(10, 'minutes').toISOString();
          this.reservationForm.endDateTime = this.formatDateTime(endDateTime);
          this.reservationForm.timeGame = this.calculateTimeDuration(
            new Date(this.reservationForm.startDateTime),
            new Date(this.reservationForm.endDateTime)
          );
          this.validateDateReserve(
            this.formatTime(this.reservationForm.startDateTime),
            this.formatDate(this.reservationForm.startDateTime),
            this.formatTime(this.reservationForm.endDateTime)
          );

        } else {
          Swal.fire({
            title: 'Horario no válido',
            text: 'Las reservas están permitidas de lunes a viernes de 6 am a 10 pm, los sábados de 6 am a 8 pm y los domingos de 6 am a 6 pm.',
          });
        }
      } else {
        // Mostrar el mensaje de iniciar sesión con SweetAlert2
        Swal.fire({
          title: 'Es necesario iniciar sesión o registrarse',
          text: 'Para poder reservar una cancha, por favor inicie sesión o registre una cuenta.',
          showCancelButton: true,
          confirmButtonText: 'Iniciar sesión',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['reserve/login']); // Redireccionar al inicio de sesión
          }
        });
      }
    } else {
      Swal.fire({
        title: 'Fecha no válida',
        text: 'No se puede seleccionar una fecha anterior a la fecha actual.',
      });
    }
  }
/*******************REVERVAR ************************************************** */
  submitReservationForm2() {
    this.isLoading2 = true;
    this.userDataJson = localStorage.getItem('userData');
    const userData = JSON.parse(this.userDataJson?this.userDataJson:"");
    const payload = {
      ddUsuario: 1,
      ddlClientes: userData.codCliente,
      ddlLocalidad: this.localidadSelect,
      ddCaja: 7,
      txtFecha: this.formatDate(this.reservationForm.startDateTime),
      txtHoraInicial: this.formatTime(this.reservationForm.startDateTime),
      txtHoraFinal: this.formatTime(this.reservationForm.endDateTime),
      txtTiempo: this.reservationForm.timeGame,
      estado: 'SIN CONFIRMAR',
      pago: 0,
      txtComentario: this.reservationForm.comment,
      costoTarifa:this.reservationForm.price,
      created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
    console.log({payload})



    this.isLoading2 = false;
    this.modalService.dismissAll();


    this.product[0].amount = this.reservationForm.price
    localStorage.setItem('paymentPrice', this.reservationForm.price);
    localStorage.setItem('dataPayment',  JSON.stringify(payload));

   this.payment();

  }

  submitReservationForm() {

    this.isLoading2 = true;
    this.userDataJson = localStorage.getItem('userData');
    const userData = JSON.parse(this.userDataJson?this.userDataJson:"");
    const url = 'https://api-rest-tennis.joseyzambranov.repl.co/api/registro-cliente/guardar';
    const payload = {
      ddUsuario: 1,
      ddlClientes: userData.codCliente,
      ddlLocalidad: this.localidadSelect,
      ddCaja: 7,
      txtFecha: this.formatDate(this.reservationForm.startDateTime),
      txtHoraInicial: this.formatTime(this.reservationForm.startDateTime),
      txtHoraFinal: this.formatTime(this.reservationForm.endDateTime),
      txtTiempo: this.reservationForm.timeGame,
      estado: 'SIN CONFIRMAR',
      pago: 0,
      txtComentario: this.reservationForm.comment,
      costoTarifa:this.reservationForm.price,
      created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    console.log({payload})

    const httpOptions = {
      headers: {
        Authorization: `Bearer ${userData.token}`
      }
    };

    this.http.post(url, payload, httpOptions).subscribe(
       (response) => {
        console.log({response})
        localStorage.setItem('codRegistro',  JSON.stringify(response));
         this.toastr.success('Reserva guardada con éxito:', 'Éxito');

        this.modalService.dismissAll();
        this.loadEvents()
        //this.payment();
        Swal.fire({
          icon: 'success',
          title: '¡Tu reserva ha sido registrada exitosamente!',
          text:  "Ahora puede realizar el pago en caja",
          confirmButtonText: 'Ok, muchas gracias!!',
        }).then(()=>{
          this.router.navigate(['/reserve/profile']);
            setTimeout(() => {
              this.router.navigate(['/reserve/profile']);
              location.reload();
            }, 1000);
        })
        this.isLoading2 = false;
       },
       (error) => {
         this.toastr.error('Error al guardar la reserva:', error.error);
        Swal.fire({
          icon: 'warning',
          text: `${error.error.error}`,
          confirmButtonText: 'Ok, entendido',
        }).then(() => {
          location.reload(); // Utilizar window.location.reload() en lugar de location.reload()
        });

         this.isLoading2 = false;
       }
     );
  }

  formatDate(dateString: string): string {
    return moment(dateString).format('YYYY-MM-DD');
  }

  formatTime(dateTimeString: string): string {
    const dateTime = new Date(dateTimeString);
    return dateTime.toTimeString().split(' ')[0];
  }

  calculateTimeDuration(startDateTime: Date, endDateTime: Date): string {
    const durationMs = endDateTime.getTime() - startDateTime.getTime();
    const durationMinutes = Math.floor(durationMs / (1000 * 60) ); // - 10 de mantenimiento
    return `${durationMinutes} minuto(s)`;
  }


  formatDateTime(dateTimeString: string): string {
    return moment(dateTimeString).format('YYYY-MM-DDTHH:mm');
  }



  obetenerLocalidades() {
     // Mostrar el spinner de carga

    this.reserveServices.getLocalidad().subscribe(
      (resp) => {
        this.localidad = resp;
         // Ocultar el spinner de carga
      },
      (error) => {
        console.log(error);
        // Ocultar el spinner de carga
      }
    );
  }


  openReservationModal() {
    this.modalService.open(this.reservationModal, { centered: true }); // Abre el modal utilizando la referencia
  }

  restarMinutos(horaFinal: string, minutos: number): string {
    const horaFinMoment = moment(horaFinal, 'HH:mm:ss');
    const nuevaHoraFinMoment = horaFinMoment.subtract(minutos, 'minutes');
    return nuevaHoraFinMoment.format('HH:mm:ss');
  }

  validateDateReserve(horainicio: any, fechRegistro: any, horafinal: any) {
    this.isLoading = true;
    const userData = JSON.parse(this.userDataJson ? this.userDataJson : '');
    const validationEndpoint = 'https://api-rest-tennis.joseyzambranov.repl.co/api/registro-cliente/validar-Fecha-reserva';
    const validationPayload = {
      txtFecha: fechRegistro,
      txtHoraInicial: horainicio,
      txtHoraFinal: horafinal,
      ddlLocalidad: this.localidadSelect,

    };
    console.log({ validationPayload })
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userData.token}`
      })
    };

    this.http.post(validationEndpoint, validationPayload, httpOptions).subscribe(
      (response: any) => {
        if (response.ok) {
          // Si la reserva es válida, puedes continuar con el resto del flujo
          this.isLoading = false;
          this.validateCountReserve(
            this.formatDate(this.reservationForm.startDateTime),
            this.formatTime(this.reservationForm.startDateTime),
            this.formatTime(this.reservationForm.endDateTime)
          );
        } else {
          Swal.fire({
            title: 'Reserva no válida',
            text: response.error,
          });
          this.isLoading = false;
        }
      },
      (error: any) => {
        Swal.fire({
          title: 'Error en la reserva',
          text: error.error.error,
        });
        this.isLoading = false;
        this.loadEvents()
      }
    );
  }

  validateCountReserve(fechRegistro: any,horainicio: any,  horafinal: any) {
    this.isLoading = true;
    const userData = JSON.parse(this.userDataJson ? this.userDataJson : '');
    const validationEndpoint = 'https://api-rest-tennis.joseyzambranov.repl.co/api/registro-cliente/validar-cantidad-reserva';
    const validationPayload = {
      txtFecha: fechRegistro,
      ddlLocalidad: this.localidadSelect,
      ddlClientes: userData.codCliente,
      txtHoraInicial: horainicio,
      txtHoraFinal: horafinal,
    };
  console.log({validationPayload})
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userData.token}`
      })
    };

    this.http.post(validationEndpoint, validationPayload, httpOptions).subscribe(
      (response: any) => {
        if (response.ok) {
          // Si la reserva es válida, puedes continuar con el resto del flujo
          this.isLoading = false;
          // ... continuar con el flujo de reserva
          this.validatePrice(
            this.formatTime(this.reservationForm.startDateTime),
            this.formatDate(this.reservationForm.startDateTime),
            this.formatTime(this.reservationForm.endDateTime)
          );
        }
      },
      (error: any) => {
        Swal.fire({
          title: 'Error en la reserva',
          text: error.error.error,
        });
        // Manejar el error si es necesario
        this.isLoading = false;

        return false
      }
    );
  }
  validatePrice(horainicio: any, fechRegistro: any, horafinal: any) {

    this.isLoading = true
    const userData = JSON.parse(this.userDataJson?this.userDataJson:"");
    const priceEndpoint = 'https://api-rest-tennis.joseyzambranov.repl.co/api/registro-cliente/precio';
    const pricePayload = {
      fechRegistro: fechRegistro,
      horainicio: horainicio,
      horafinal: horafinal,
      codCliente: userData.codCliente,
      codLocalidad: this.localidadSelect
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userData.token}`
      })
    };

    this.http.post(priceEndpoint, pricePayload, httpOptions).subscribe(
      (response: any) => {
        const precio = response.precio;
        // Aquí puedes usar el precio obtenido para realizar cualquier acción necesaria antes de guardar la reserva
        let priceTime = this.calPriceTime(this.reservationForm.startDateTime,this.reservationForm.endDateTime,precio)
        this.reservationForm.price=priceTime

        console.log(this.reservationForm.price)
        this.showReservationForm = true; // Mostrar el formulario de reserva
        this.openReservationModal();
      //this.openPaymentModal()
        // Continuar con el proceso de guardar la reserva...
        this.isLoading = false
      },
      (error: any) => {
        console.log('Error obteniendo el precio:', error);
        // Manejar el error si es necesario
        this.isLoading = false
      }
    );
  }
  getHiddenDays() {
    const today = moment().startOf('day');
    const dayOfWeek = today.day();
    if (dayOfWeek === 6) { // Si el día actual es sábado
      return [0]; // Ocultar el domingo
    } else {
      return []; // No ocultar ningún día
    }
  }

  sumar() {
    this.valor += 50;
    if (this.valor === 100) {
      this.isSumaDisabled = true;
      this.isRestaDisabled = false;
    }
  }

  restar() {
    this.valor -= 50;
    if (this.valor === 50) {
      this.isSumaDisabled = false;
      this.isRestaDisabled = true;
    }
  }

  calPriceTime(horaInicio: any, horaFin: any, precioBase: any) {
    var fechaInicio = new Date(horaInicio);
    var fechaFin = new Date(horaFin);
    var duracion = (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60); // Duración en minutos
    if (
      fechaInicio.getHours() === 17 && fechaInicio.getMinutes() === 0 &&
      fechaFin.getHours() === 18 && fechaFin.getMinutes() === 50
    ) {
      var resultado = parseFloat(precioBase) + 28; // Sumar 28 al precio base
      return resultado.toFixed(2);
    }
    var multiplicador = 1;
    if (duracion > 50) {
      multiplicador = 2;
    }
    var resultado = multiplicador * parseFloat(precioBase); // Multiplicar por el precio base
    return resultado.toFixed(2);
  }
  openPaymentModal() {
    this.modalService.open(this.paymentModal, { centered: true }); // Abre el modal utilizando la referencia
    this.izipay()
  }

  submitReservationForm3() {
    this.codigoUnico = this.generateOrderId()
    this.isLoading2 = true;
    this.userDataJson = localStorage.getItem('userData');
    const userData = JSON.parse(this.userDataJson?this.userDataJson:"");
    this.payload = {
      ddUsuario: 1,
      ddlClientes: userData.codCliente,
      ddlLocalidad: this.localidadSelect,
      ddCaja: 7,
      txtFecha: this.formatDate(this.reservationForm.startDateTime),
      txtHoraInicial: this.formatTime(this.reservationForm.startDateTime),
      txtHoraFinal: this.formatTime(this.reservationForm.endDateTime),
      txtTiempo: this.reservationForm.timeGame,
      estado: 'SIN CONFIRMAR',
      pago: 0,
      txtComentario: this.reservationForm.comment,
      costoTarifa:this.reservationForm.price,
      created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      venta_id: this.codigoUnico,
    };
    console.log(this.payload)



    this.isLoading2 = false;
    this.modalService.dismissAll();


    //this.product[0].amount = this.reservationForm.price
    //localStorage.setItem('paymentPrice', this.reservationForm.price);
    //localStorage.setItem('dataPayment',  JSON.stringify(payload));

   this.openPaymentModal();

  }
  izipay() {
    this.isLoading = true;

    const userData = JSON.parse(localStorage.getItem('userData')!);
    const endpoint = 'https://api.micuentaweb.pe';
    //TEST
    //const publicKey = '81246030:testpublickey_kt72SwvRQKdOYwyTtZ6dkKnZyvTY1oaztrWmJrVbG5oC0';
    //PRODUCCION
    const publicKey = "81246030:publickey_uoRIDdgvkxZL4m0cSakghA11gBpPkbCPaMo1cEr9BJOD8"
    let formToken = '';

    const createPaymentObservable = this.http.post(
      'https://api-rest-tennis.joseyzambranov.repl.co/createPayment',
      {
        paymentConf: {
          amount: JSON.stringify(this.reservationForm.price * 100),
          currency: 'PEN',
          orderId: this.codigoUnico,
          customer: {
            email: userData.email
        }

        },

      },

      { responseType: 'text' }
    );
    firstValueFrom(createPaymentObservable)
      .then((resp: any) => {
        formToken = resp;
        return KRGlue.loadLibrary(endpoint, publicKey); /* Load the remote library */
      })
      .then(({ KR }) =>
        KR.setFormConfig({
          /* set the minimal configuration */
          formToken: formToken,
          'kr-language': 'es-ES' /* to update initialization parameter */,

        })

      )

      .then(({ KR }) => KR.onSubmit(this.onSubmit))
      .then(({ KR }) => KR.attachForm('#myPaymentForm')) /* Attach a payment form  to myPaymentForm div*/
      .then(({ KR, result }) => KR.showForm(result.formId)) /* show the payment form */
      .then(({ KR }) =>
        KR.button.onClick(() => {
          this.isLoading = true;
          return new Promise<boolean>((resolve, reject) => {

            this.crearRegistro()
              .then(() => {
                this.isLoading = false;
                resolve(true);
              })
              .catch((error) => {
                this.isLoading = false;
                reject(error);
              });
          });
        })
      ).then(({KR}) =>KR.onError((event)=>{
        console.log({event})
        this.eliminarRegistro(this.codRegistro)
        Swal.fire({
          icon: 'warning',
          text: `${event.errorMessage}`,
          confirmButtonText: 'Ok, entendido',
        }).then(() => {

          this.modalService.dismissAll()
          location.reload();
          this.isLoading = false; // Utilizar window.location.reload() en lugar de location.reload()
        });
      }))
      .catch((error) => {
        this.isLoading = false;
        this.message = error.message + ' (see console for more details)';


      });
      this.isLoading = false;
  }


  //izipay() {
  //  //this.crearRegistro()
  //  //console.log(this.codRegistro)
  //  const endpoint = 'https://api.micuentaweb.pe'
  //  const publicKey = '81246030:testpublickey_kt72SwvRQKdOYwyTtZ6dkKnZyvTY1oaztrWmJrVbG5oC0'
  //  let formToken = ''
  //  const observable = this.http.post(
  //    'http://localhost:5000/createPayment',
  //    { paymentConf: { amount:JSON.stringify(this.reservationForm.price * 100) , currency: 'PEN' ,orderId : "" } },
  //    { responseType: 'text' }
  //  )
  //  firstValueFrom(observable)
  //    .then((resp: any) => {
  //      formToken = resp
  //      return KRGlue.loadLibrary(
  //        endpoint,
  //        publicKey
  //      ) /* Load the remote library */
  //    })
  //    .then(({ KR }) =>
  //      KR.setFormConfig({
  //        /* set the minimal configuration */
  //        formToken: formToken,
  //        'kr-language': 'es-ES' /* to update initialization parameter */
  //      })
  //    )
//
  //    .then(({ KR }) => KR.onSubmit(this.onSubmit))
  //    .then(({ KR }) =>
  //      KR.attachForm('#myPaymentForm')
//
  //    ) /* Attach a payment form  to myPaymentForm div*/
  //    .then(({ KR, result }) =>
  //      KR.showForm(result.formId)
  //    ) /* show the payment form */
  //    .then(({KR})=>KR.button.onClick(()=>{
  //                  return new Promise<boolean>((resolve, reject) => {
  //                              this.crearRegistro()
  //                                .then(() => {
  //                                  resolve(true);
  //                                })
  //                                .catch((error) => {
  //                                  reject(error);
  //                                });
  //                            });
  //                }))
  //    .catch(error => {
  //      this.message = error.message + ' (see console for more details)'
  //    })
  //}
//

  //izipay() {
  //  const userData = JSON.parse(this.userDataJson ? this.userDataJson : '');
  //  this.crearRegistro()
  //    .then(() => {
  //      console.log(this.codRegistro);
  //      const endpoint = 'https://api.micuentaweb.pe';
  //      const publicKey = '81246030:testpublickey_kt72SwvRQKdOYwyTtZ6dkKnZyvTY1oaztrWmJrVbG5oC0';
  //      let formToken = '';
  //      const observable = this.http.post(
  //        'http://localhost:5000/createPayment',
  //        {
  //          paymentConf: {
  //            amount: JSON.stringify(this.reservationForm.price * 100),
  //            currency: 'PEN',
  //            orderId: this.codRegistro,
  //            customer: {
  //              email: userData.email
  //          }
//
  //           } },
  //        { responseType: 'text' }
  //      );
  //      return firstValueFrom(observable)
  //        .then((resp: any) => {
  //          formToken = resp;
  //          return KRGlue.loadLibrary(
  //            endpoint,
  //            publicKey
  //          ); /* Load the remote library */
  //        })
  //        .then(({ KR }) =>
  //          KR.setFormConfig({
  //            /* set the minimal configuration */
  //            formToken: formToken,
  //            'kr-language': 'es-ES' /* to update initialization parameter */
  //          })
  //        )
  //        .then(({ KR }) => KR.onSubmit(this.onSubmit))
  //        .then(({ KR }) =>
  //          KR.attachForm('#myPaymentForm')
  //        ) /* Attach a payment form  to myPaymentForm div*/
  //        .then(({ KR, result }) =>
  //          KR.showForm(result.formId)
  //        ) /* show the payment form */
  //          .then(({KR})=>KR.button.onClick(()=>{
  //            return new Promise<boolean>((resolve, reject) => {
  //                        this.crearRegistro()
  //                          .then(() => {
  //                            resolve(true);
  //                          })
  //                          .catch((error) => {
  //                            reject(error);
  //                          });
  //                      });
  //          }))
  //        .catch(error => {
  //          this.message = error.message + ' (see console for more details)';
  //        });
  //    })
  //    .catch(error => {
  //      console.error('Error al crear el registro:', error);
  //    });
  //}


//
//izipay() {
//  const userData = JSON.parse(this.userDataJson ? this.userDataJson : '');
//  this.codRegistro = '';
//
//  const endpoint = 'https://api.micuentaweb.pe';
//  const publicKey = '81246030:testpublickey_kt72SwvRQKdOYwyTtZ6dkKnZyvTY1oaztrWmJrVbG5oC0';
//  let formToken = '';
//
//  const observable = this.http.post(
//    'http://localhost:5000/createPayment',
//    {
//      paymentConf: {
//        amount: JSON.stringify(this.reservationForm.price * 100),
//        currency: 'PEN',
//        orderId: this.codRegistro,
//        customer: {
//          email: userData.email
//        }
//      }
//    },
//    { responseType: 'text' }
//  );
//
//  firstValueFrom(observable)
//    .then((resp: any) => {
//      formToken = resp;
//      return KRGlue.loadLibrary(endpoint, publicKey);
//    })
//    .then(({ KR }) => {
//      KR.setFormConfig({
//        formToken: formToken,
//        'kr-language': 'es-ES'
//      });
//
//      KR.button.onClick(() => {
//        return new Promise<boolean>((resolve, reject) => {
//          this.crearRegistro()
//            .then(() => {
//              resolve(true);
//            })
//            .catch((error) => {
//              reject(error);
//            });
//        });
//      });
//    })
//    .then(({ KR }) => KR.onSubmit(this.onSubmit))
//    .then(({ KR }) => KR.attachForm('#myPaymentForm'))
//    .then(({ KR, result }) => KR.showForm(result.formId))
//    .catch((error) => {
//      this.message = error.message + ' (see console for more details)';
//    });
//}





  private onSubmit = (paymentData: KRPaymentResponse) => {
console.log(this.codRegistro)
    this.http
      .post('https://api-rest-tennis.joseyzambranov.repl.co/validatePayment', paymentData, {
        responseType: 'text'
      })
      .subscribe((response: any) => {
        if (response) {
          console.log({response})
      let importePago = this.reservationForm.price
       let date = moment().format('YYYY-MM-DD HH:mm:ss')
       this.updateRegistro(this.codRegistro,this.codigoUnico)

       this.registrarPago( date,importePago,this.codRegistro)

          this.message = 'Payment successful!'
          this.chRef.detectChanges()
          Swal.fire({
            icon: 'success',
            title: `Su compra a sido exitosa`,
            text:  `su operacion fue realizada exitosamente`,
            confirmButtonText: 'Ok, muchas gracias!!',
          }).then(()=>{
            this.modalService.dismissAll()
            this.router.navigate(['/reserve/profile']);
              setTimeout(() => {
                this.router.navigate(['/reserve/profile']);
                location.reload();
              }, 1000);

          })

        }
      },
      (error: any) => {
        console.error('Error al validar el pago:', error);

      }
    );
}
  /*
  private onSubmit = (paymentData: KRPaymentResponse) => {
    const codRegistro =  JSON.parse(localStorage.getItem('codRegistro')!);
    const userData = JSON.parse(this.userDataJson?this.userDataJson:"");

    this.isLoading2 = true;
    this.userDataJson = localStorage.getItem('userData');


    const url = `https://api-rest-tennis.joseyzambranov.repl.co/api/registro-cliente/guardar`;
    const httpOptions = {
      headers: {
        Authorization: `Bearer ${userData.token}`
      }
    };

    this.http.post(url, this.payload ,httpOptions).subscribe(
      (response: any) => {
        const newData = Object.assign({}, paymentData, { orderId : response.codRegistro ,
          email: "joseyzambranovpe@gmail.com",



        })
        console.log({newData})
        this.toastr.success('Reserva guardada con éxito:', 'Éxito');
        console.log(response);
        this.http
      .post('http://localhost:5000/validatePayment', newData, {
        responseType: 'text'
      })
      .subscribe((response: any) => {
        if (response) {
          this.message = 'Payment successful!'
          this.chRef.detectChanges()
        }
      })
      },
      (error) => {
        this.toastr.error('Error al guardar la reserva:', error.error);
        Swal.fire({
          icon: 'warning',
          text: `${error.error.error}`,
          confirmButtonText: 'Ok, entendido',
        }).then(() => {
          location.reload(); // Utilizar window.location.reload() en lugar de location.reload()
        });

      }
    );
  }
  */
/*
  crearRegistro() {

    this.isLoading2 = true;
    this.userDataJson = localStorage.getItem('userData');
    const userData = JSON.parse(this.userDataJson?this.userDataJson:"");

    const url = `https://api-rest-tennis.joseyzambranov.repl.co/api/registro-cliente/guardar`;
    const httpOptions = {
      headers: {
        Authorization: `Bearer ${userData.token}`
      }
    };

    this.http.post(url, this.payload ,httpOptions).subscribe(
      (response) => {
        this.toastr.success('Reserva guardada con éxito:', 'Éxito');
        console.log(response);
      },
      (error) => {
        this.toastr.error('Error al guardar la reserva:', error.error);
        Swal.fire({
          icon: 'warning',
          text: `${error.error.error}`,
          confirmButtonText: 'Ok, entendido',
        }).then(() => {
          location.reload(); // Utilizar window.location.reload() en lugar de location.reload()
        });

      }
    );
  }
  */
  crearRegistro() {
    return new Promise<void>((resolve, reject) => {
      this.userDataJson = localStorage.getItem('userData');
      const userData = JSON.parse(this.userDataJson ? this.userDataJson : '');

      //const url = `https://api-rest-tennis.joseyzambranov.repl.co/api/registro-cliente/guardar`;
      const url = `https://api-rest-tennis.joseyzambranov.repl.co/api/registro-cliente/guardar`;

      const httpOptions = {
        headers: {
          Authorization: `Bearer ${userData.token}`
        }
      };

      this.http.post(url, this.payload, httpOptions).subscribe(
        (response:any) => {
          this.toastr.success('Reserva guardada con éxito:', 'Éxito');
          console.log(response);
          this.codRegistro = response.codRegistro

          resolve(); // Resolver la promesa cuando se haya guardado el registro
        },
        (error) => {
          this.toastr.error('Error al guardar la reserva:', error.error);
          Swal.fire({
            icon: 'warning',
            text: `${error.error.error}`,
            confirmButtonText: 'Ok, entendido',
          }).then(() => {
            location.reload(); // Utilizar window.location.reload() en lugar de location.reload()
          });
          reject(error); // Rechazar la promesa en caso de error
        }
      );
    });
  }
  crearRegistro2(data: any) {

    const userData = JSON.parse(localStorage.getItem('userData')!);
    const url = `https://api-rest-tennis.joseyzambranov.repl.co/api/registro-cliente/guardar`;
    const dataPayment =  JSON.parse(localStorage.getItem('dataPayment')!);
    const httpOptions = {
      headers: {
        Authorization: `Bearer ${userData.token}`
      }
    };

    this.http.post(url, dataPayment ,httpOptions).subscribe(
      (response) => {
        this.toastr.success('Reserva guardada con éxito:', 'Éxito');
        localStorage.setItem('codRegistro',  JSON.stringify(response));
        //this.sendDataToCulqi(data);
      },
      (error) => {
        this.toastr.error('Error al guardar la reserva:', error.error);
        Swal.fire({
          icon: 'warning',
          text: `${error.error.error}`,
          confirmButtonText: 'Ok, entendido',
        }).then(() => {
          location.reload(); // Utilizar window.location.reload() en lugar de location.reload()
        });
        //Culqi.close();
      }
    );
  }

  updateRegistro( id : string , ventaId : string ) {
    const userData = JSON.parse(localStorage.getItem('userData')!);
    //const url = `https://api-rest-tennis.joseyzambranov.repl.co/api/registro-cliente/confirmar/${id}`;
    const url = `https://api-rest-tennis.joseyzambranov.repl.co/api/registro-cliente/confirmar/${id}`;
    const httpOptions = {
      headers: {
        Authorization: `Bearer ${userData.token}`
      }
    };
    const requestBody = {
      venta_id: ventaId // Agrega el campo venda_id al cuerpo de la solicitud
    };
    this.http.put(url,requestBody, httpOptions).subscribe(
      (response) => {
        console.log("Actualizado  correctamente")
      },
      (error) => {
        console.error('Error al Actualizar el registro:', error);
      }
    );
  }

  registrarPago( fechaPago : string , importePago : string ,codRegistro: string ) {
    const userData = JSON.parse(localStorage.getItem('userData')!);
    const url = `https://api-rest-tennis.joseyzambranov.repl.co/api/registro-cliente/registrar-pago`;
    const httpOptions = {
      headers: {
        Authorization: `Bearer ${userData.token}`
      }
    };
    const requestBody = {

        fechaPago:fechaPago,
        importePago:importePago,
        codRegistro:codRegistro

    };
    this.http.post(url,requestBody, httpOptions).subscribe(
      (response) => {
        console.log("pago registrado  correctamente")
      },
      (error) => {
        console.error('Error al pagar registrado:', error);
      }
    );
  }
  clickPayTest(){
    console.log("hello click")
    this.clickPage = true
  }


  eliminarRegistro(id: string) {
    const userData = JSON.parse(localStorage.getItem('userData')!);
    const url = `https://api-rest-tennis.joseyzambranov.repl.co/api/registro-cliente/eliminar/${id}`;
    const httpOptions = {
      headers: {
        Authorization: `Bearer ${userData.token}`
      }
    };

    this.http.delete(url, httpOptions).subscribe(
      (response) => {
        console.log("borrado correctamente")
      },
      (error) => {
        console.error('Error al eliminar el registro:', error);
      }
    );
  }
  //generateOrderId() {
  //  return uuidv4();
  //}



   generateOrderId() {
    const userData = JSON.parse(localStorage.getItem('userData')!);
    const timestamp = moment().format("ss");
    const randomDigits = Math.floor(Math.random() * 100000000);
    const randomLetters = this.generateRandomLetters(4); // Genera 4 letras aleatorias
    const orderId = (parseInt(timestamp) * 100000000 + randomDigits).toString().substr(0, 4) + userData.codCliente + randomLetters;

    return orderId;
  }

   generateRandomLetters(length: number) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Define las letras posibles
    let randomLetters = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      randomLetters += letters.charAt(randomIndex);
    }

    return randomLetters;
  }

  getInfoClient(id:any){
    const userData = JSON.parse(localStorage.getItem('userData')!);
if(userData.email == null){
  const token = localStorage.getItem("token");
  const authToken = `Bearer ${token}` ;
  const headers =  new HttpHeaders({
  'Authorization': authToken
  });

  const url = `https://api-rest-tennis.joseyzambranov.repl.co/api/cliente/perfil/${id}`;
  this.http.get<any[]>(url, {headers}).subscribe(
    (data: any) => {


    userData.email = data.email; // Agregar el valor de data.email al objeto userData
    localStorage.setItem('userData', JSON.stringify(userData));


    },
    (error: any) => {
      console.log('Error fetching events:', error);
    }
  );
}

}


}
