import {Component, OnInit, ViewChild} from '@angular/core';
import {IHour} from "../models/hour";
import {HourService} from "../services/hour.service";
import {IonModal} from "@ionic/angular";
import { OverlayEventDetail } from '@ionic/core/components';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {delay} from "rxjs";
import {ILocation} from "../models/location";
import {LocationService} from "../services/location.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: string='';
  hours:IHour[]=[];
  locations:ILocation[]=[];
  @ViewChild(IonModal) modal: IonModal | undefined;
  formData:FormGroup = new FormGroup({});

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
    console.log(this.locations)
  }

  async cancel() {
    // @ts-ignore
    this.modal.dismiss(null, 'cancel');
    this.hours= await this.hourService.getAllByUserId();
  }

  confirm() {
    // @ts-ignore
    this.modal.dismiss(null, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
  }

  dateToHour (date:Date){
    return this.datePipe.transform(date,'h:mm');
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
