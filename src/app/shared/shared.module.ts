import { NgModule } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarFullComponent } from '../components/reserve/calendar-full/calendar-full.component';

@NgModule({
  declarations: [
    
  ],
  imports: [
    FullCalendarModule
  ],
  exports: [
   
    FullCalendarModule
  ]
})
export class SharedModule { }
