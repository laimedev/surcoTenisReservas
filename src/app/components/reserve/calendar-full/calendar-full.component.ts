import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ReserveService } from '../services/reserve.service';
import { Router } from '@angular/router';


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

  product = [{
    description : "Polo Culqi Lover",
    amount: 100
  }];

  constructor(public http: HttpClient,
    private clqSrv : ReserveService,
    public router: Router
    ){

  }



  ngOnInit(): void {

    this.clqSrv.initCulqi();

    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }


  payment(){
    this.clqSrv.payorder(this.product[0]["description"],this.product[0]["amount"]);
  }


  irLogin(){
    this.router.navigate(["reserve/login"])
  }

  
}
