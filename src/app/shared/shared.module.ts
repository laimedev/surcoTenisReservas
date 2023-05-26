import { NgModule } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarFullComponent } from '../components/reserve/calendar-full/calendar-full.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [
    
  ],
  imports: [
    FullCalendarModule,
    NgbModule
  ],
  exports: [
   
    FullCalendarModule
  ]
})
export class SharedModule { }
