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
    validRange: () => {
      return {
        start: moment().toDate(),
        end: moment().add(7, 'days').toDate()
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
  currentEvents: EventApi[] = [];

  product = [{
    description : "Polo Culqi Lover",
    amount: 100
  }];
  currentDate: Date = new Date();

  public localidad: any = [];
  localidadSelect = 2; 
  userDataJson: string | null | undefined;
  isLoading: boolean | undefined;
  isLoading2: boolean | undefined;
  spinner: any;


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
      this.showReservationForm = true;
      this.reservationForm.startDateTime = this.formatDateTime(clickDate.start.toISOString());
      this.reservationForm.endDateTime = this.formatDateTime(clickDate.end.toISOString());
      this.reservationForm.timeGame = this.calculateTimeDuration(new Date(this.reservationForm.startDateTime), new Date(this.reservationForm.endDateTime)),
      this.validatePrice(this.formatTime(this.reservationForm.startDateTime),this.formatDate(this.reservationForm.startDateTime), this.formatTime(this.reservationForm.endDateTime))
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
      this.reservationForm.price=precio

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
      costoTarifa:this.reservationForm.price
    };
    console.log({payload})
    this.isLoading2 = false; 
    this.modalService.dismissAll();

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
         this.toastr.success('Reservation saved successfully:', 'Éxito');
         this.modalService.dismissAll();
        this.loadEvents()
        this.isLoading2 = false; 
       },
       (error) => {
         this.toastr.error('Error saving reservation:', error.error);
         // Manejar el error de guardado de reserva si es necesario
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
    const durationMinutes = Math.floor(durationMs / (1000 * 60) - 10); // - 10 de mantenimiento
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
  
}
