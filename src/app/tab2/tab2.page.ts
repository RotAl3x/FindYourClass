import {Component, OnInit, ViewChild} from '@angular/core';
import {IHour} from "../models/hour";
import {HourService} from "../services/hour.service";
import {IonModal} from "@ionic/angular";
import { OverlayEventDetail } from '@ionic/core/components';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ILocation} from "../models/location";
import {LocationService} from "../services/location.service";
import {DatePipe, WeekDay} from "@angular/common";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
  name: string='';
  hours:IHour[]=[];
  allHours:IHour[]=[];
  locations:ILocation[]=[];
  @ViewChild(IonModal) modal: IonModal | undefined;
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

  public pickerButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Confirm',
      handler: (value:any) => {
        this.dayToSearch = value.weekDay
        this.hours = this.filterHourByWeekDay()
      },
    },
  ];

  filterHourByWeekDay(){
    return this.allHours.filter(h=>h.datesToHour.filter(d=>new Date(d.date).getDay() == this.dayToSearch.value).length>0)
  }

  async cancel() {
    // @ts-ignore
    this.modal.dismiss(null, 'cancel');
    this.allHours= await this.hourService.getAllByUserId();
    this.hours= this.filterHourByWeekDay()
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
  }

  dateToHour (date:Date){
    return this.datePipe.transform(date,'H:mm');
  }

  async onSubmit(){
    try{
      await this.hourService.create(this.formData.value);
      this.formData.reset();
    }
    catch (e){
      console.log(e);
    }
  }

}
