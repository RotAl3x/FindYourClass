import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IHour} from "../models/hour";
import {HourService} from "../services/hour.service";
import {ILocation} from "../models/location";
import {LocationService} from "../services/location.service";
import {DatePipe} from "@angular/common";
import {GoogleMap} from "@capacitor/google-maps";
import {environment} from "../../environments/environment";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  @ViewChild('map')
    // @ts-ignore
  mapRef: ElementRef<HTMLElement>;
  // @ts-ignore
  newMap: GoogleMap;
  name: string = '';
  hours: IHour[] = [];
  allHours: IHour[] = [];
  locations: ILocation[] = [];
  searchData: string = new Date().toISOString();
  formData: FormGroup = new FormGroup({});
  public dayToSearch = {text: 'Monday', value: 1}

  constructor(private hourService: HourService,
              private locationService: LocationService,
              private datePipe: DatePipe,
              private formBuilder: FormBuilder,
  ) {
    this.formData = this.formBuilder.group({
      searchData: new FormControl(),
    })
  }

  async ngOnInit() {
    this.locations = await this.locationService.getAll();
    this.allHours = await this.hourService.getAllByUserId();
    this.hours = this.confirmDate();
  }

  dateToHour(date: Date) {
    return this.datePipe.transform(date, 'H:mm');
  }

  async createMap(lat: number, lng: number, location: ILocation, element: HTMLElement) {
    // this.hours.forEach(h=>h.location.openMap=false)
    this.newMap = await GoogleMap.create({
      id: 'my-cool-map',
      element: element,
      apiKey: environment.apiKey,
      config: {
        center: {
          lat: lat,
          lng: lng,
        },
        zoom: 16,
      },
    });
    await this.newMap.addMarker({
      coordinate: {
        lat: lat,
        lng: lng,
      }
    })
    location.openMap = !location.openMap;
  }

  confirmDate() {
    let searchNewData = new Date(this.searchData);
    return this.allHours.filter(h => h.datesToHour.filter(d =>
      (new Date(d.date).getDate() == searchNewData.getDate() && new Date(d.date).getUTCMonth() == searchNewData.getUTCMonth() && new Date(d.date).getUTCFullYear() == searchNewData.getUTCFullYear())).length > 0)
  }
}
