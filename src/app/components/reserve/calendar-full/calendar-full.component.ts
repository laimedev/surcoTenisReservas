import { HttpClient } from '@angular/common/http';
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
@Component({
  selector: 'app-calendar-full',
  templateUrl: './calendar-full.component.html',
  styleUrls: ['./calendar-full.component.scss']
})

export class CalendarFullComponent implements OnInit {

  // settings: any = {
  //   title: '',
  //   currency: '',
  //   description: '',
  //   amount: 0
  // };

  showReservationForm = false;
  reservationForm: any = {
    clientId: null,
    locationId: null,
    startDateTime: null,
    endDateTime: null,
    comment: ''
    }

    calendarVisible = true;
  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    events: [],
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    select: this.handleEventsDate.bind(this)
  };
  currentEvents: EventApi[] = [];

  product = [{
    description : "Polo Culqi Lover",
    amount: 100
  }];



  constructor(public http: HttpClient,
    private clqSrv : ReserveService,
    public router: Router,
    private changeDetector: ChangeDetectorRef
    ){

  }



  ngOnInit(): void {

    this.clqSrv.initCulqi();
    this.loadEvents();
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }


  payment(){
    this.clqSrv.payorder(this.product[0]["description"],this.product[0]["amount"]);
  }


  irLogin(){
    this.router.navigate(["reserve/login"])
  }
  loadEvents() {
    const url = 'https://api-rest-tennis.joseyzambranov.repl.co/api/registro-cliente/listar/?id=2';

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

        this.calendarOptions.events = events;
        this.changeDetector.detectChanges();

        console.log('Events:', events);
      },
      (error: any) => {
        console.log('Error fetching events:', error);
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
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  handleEventsDate(clickDate: DateSelectArg) {
    this.showReservationForm = true;
    this.reservationForm.startDateTime = this.formatDateTime(clickDate.start.toISOString());
    this.reservationForm.endDateTime = this.formatDateTime(clickDate.end.toISOString());
    console.log(this.reservationForm.startDateTime);
  }

  submitReservationForm() {
    const url = 'https://api-rest-tennis.joseyzambranov.repl.co/api/registro-cliente/guardar';

    const startDateTime = new Date(this.reservationForm.startDateTime);
    const endDateTime = new Date(this.reservationForm.endDateTime);

    const payload = {
      ddUsuario: 1,
      ddlClientes: 30,
      ddlLocalidad: 2,
      ddCaja: 7,
      txtFecha: this.formatDate(this.reservationForm.startDateTime),
      txtHoraInicial: this.formatTime(this.reservationForm.startDateTime),
      txtHoraFinal: this.formatTime(this.reservationForm.endDateTime),
      txtTiempo: this.calculateTimeDuration(startDateTime, endDateTime),
      estado: 'SIN CONFIRMAR',
      pago: 0,
      txtComentario: this.reservationForm.comment
    };

    console.log({ payload });

     this.http.post(url, payload).subscribe(
       (response) => {
         console.log('Reservation saved successfully:', response);
         // Realizar acciones adicionales después de guardar la reserva si es necesario
       },
       (error) => {
         console.log('Error saving reservation:', error);
         // Manejar el error de guardado de reserva si es necesario
       }
     );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const isoString = date.toISOString(); // Obtener representación en formato ISO
    return isoString.slice(0, 16); // Recortar los últimos caracteres
  }

  formatTime(dateTimeString: string): string {
    const dateTime = new Date(dateTimeString);
    return dateTime.toTimeString().split(' ')[0];
  }

  calculateTimeDuration(startDateTime: Date, endDateTime: Date): string {
    const durationMs = endDateTime.getTime() - startDateTime.getTime();
    const durationMinutes = Math.floor(durationMs / (1000 * 60));
    return `${durationMinutes} minuto(s)`;
  }
  

  formatDateTime(dateTimeString: string): string {
    return moment(dateTimeString).format('YYYY-MM-DDTHH:mm');
  }
  
}
