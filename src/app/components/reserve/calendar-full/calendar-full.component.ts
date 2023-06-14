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
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calendar-full',
  templateUrl: './calendar-full.component.html',
  styleUrls: ['./calendar-full.component.scss']
})

export class CalendarFullComponent implements OnInit {
  @ViewChild('reservationModal') reservationModal: any;
 
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
  /*
    calendarOptions: CalendarOptions = {
    
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridDay'
    },
    initialView: 'timeGridDay',
    events: [],
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
    //slotMinWidth:100,
    //longPressDelay:0, // Tiempo de espera para arrastrar eventos
    //eventLongPressDelay: 0, // Tiempo de espera para arrastrar eventos
    selectLongPressDelay: 0,
    //validRange: () => {
    //  return {
    //    start: moment().toDate(),
    //    end: moment().add(7, 'days').toDate()
    //  };
    //},

    //validRange: () => {
    //  const today = moment("2023-06-09").utc().startOf('day');
    //  const dayOfWeek = today.day(); // Obtener el día de la semana (0: domingo, 1: lunes,2 martes,3 miercoles , 4 jueves , 5 viernes,  6: sábado)
    //  let start, end;
    //console.log({today})
    //console.log({dayOfWeek})
    //  if (dayOfWeek <= 3) { // Si es domingo, lunes, martes o miércoles
    //    start = today.toDate(); // Inicio: hoy
    //    end = today.clone().add(3, 'days').toDate(); // Fin: hoy + 3 días (hasta miércoles)
    //  } else if (dayOfWeek <= 4) { // Si es miércoles o jueves
    //    start = today.clone().add(1, 'days').toDate(); // Inicio: mañana (jueves)
    //    end = today.clone().add(2, 'days').toDate(); // Fin: mañana + 2 días (hasta viernes)
    //  } else { // Si es viernes
    //    start = today.clone().toDate(); // Inicio: hoy (viernes)
    //    console.log({start})
    //    end = today.clone().add(3, 'days').toDate(); // Fin: hoy + 3 días (hasta domingo)
    //  }
    //
    //  return {
    //    start: start,
    //    end: end
    //  };
    //},
    validRange: () => {
      const today = moment("2023-06-10").startOf('day');
      const dayOfWeek = today.day(); // Obtener el día de la semana (0: domingo, 1: lunes, 2: martes, 3: miércoles, 4: jueves, 5: viernes, 6: sábado)
      let start, end;
      console.log({today})
      console.log({dayOfWeek})
      if (dayOfWeek == 0) { // Si es lunes
        start = today.clone().toDate(); // Inicio: mañana (miercoles)
        end = today.clone().toDate();
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
        end = today.clone().add(3, 'days').toDate();
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
      return duration === 60;
    },
    slotLabelFormat: [
      { hour: 'numeric', minute: '2-digit', hour12: true, meridiem: 'short'},
      { month: 'short', day: 'numeric', weekday: 'short' }
    ],
    //nowIndicator: true,

  };
  */
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

  constructor(public http: HttpClient,
    private clqSrv : ReserveService,
    public router: Router,
    public reserveServices: ReserveService,
    private changeDetector: ChangeDetectorRef,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private activeModal: NgbActiveModal
    ){

  }

  ngOnInit(): void {

    this.clqSrv.initCulqi();
    this.loadEvents();
    this.obetenerLocalidades();
    this.userDataJson = localStorage.getItem('userData');
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
      
          //  this.validatePrice(
          //    this.formatTime(this.reservationForm.startDateTime),
          //    this.formatDate(this.reservationForm.startDateTime),
          //    this.formatTime(this.reservationForm.endDateTime)
          //  );
          //
          
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
      costoTarifa:this.reservationForm.price
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
         
        // this.modalService.dismissAll();
        this.loadEvents()
        this.payment();
        this.isLoading2 = false; 
       },
       (error) => {
         this.toastr.error('Error al guardar la reserva:', error.error);
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
/*
  validateDateReserve(horainicio: any, fechRegistro: any, horafinal: any) {
    this.isLoading = true;
    const userData = JSON.parse(this.userDataJson ? this.userDataJson : '');
    const validationEndpoint = 'https://api-rest-tennis.joseyzambranov.repl.co/api/registro-cliente/validar-Fecha-reserva';
    const validationPayload = {
      txtFecha: fechRegistro,
      txtHoraInicial: horainicio,
      txtHoraFinal: horafinal,
      ddlLocalidad: this.localidadSelect
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
          console.log('Reserva válida');
          this.isLoading = false;
          // ... continuar con el flujo de reserva
        }
      },
      (error: any) => {
        console.log('Error en la validación de reserva:', error);
        Swal.fire({
          title: 'Error en la reserva',
          text: error.error,
        });
        // Manejar el error si es necesario
        this.isLoading = false;
        
        return false
      }
    );
  }*/

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
}