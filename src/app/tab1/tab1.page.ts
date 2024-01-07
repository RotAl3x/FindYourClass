import {Component, OnInit} from '@angular/core';
import {IHour} from "../models/hour";
import {HourService} from "../services/hour.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ILocation} from "../models/location";
import {LocationService} from "../services/location.service";
import {DatePipe, WeekDay} from "@angular/common";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  name: string='';
  hours:IHour[]=[];
  allHours:IHour[]=[];
  locations:ILocation[]=[];
  formData:FormGroup = new FormGroup({});
  public dayToSearch= {text: 'Monday',value: 1}
  public dayPicker = [
    {
      name:'weekDay',
      options: Object.keys(WeekDay).filter(w=>w.length>1).map((w,i)=>{return {text: w,value: i}}),
    },
  ];

  constructor(private hourService:HourService,
              private formBuilder:FormBuilder,
              private locationService:LocationService,
              private datePipe: DatePipe
  ) {
    this.formData = this.formBuilder.group({
      courseName: new FormControl(),
      locationId: new FormControl(),
      startHour: new FormControl(),
      endHour: new FormControl(),
      datesToHour: new FormControl(),
    });
  }

  async ngOnInit() {
    this.locations = await this.locationService.getAll();
    this.allHours= await this.hourService.getAllByUserId();
    this.hours= this.filterHourByWeekDay()
  }

  filterHourByWeekDay(){
    return this.allHours.filter(h=>h.datesToHour.filter(d=>new Date(d.date).getDay() == this.dayToSearch.value).length>0)
  }

  dateToHour (date:Date){
    return this.datePipe.transform(date,'H:mm');
  }

}
