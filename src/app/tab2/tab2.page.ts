import {Component, OnInit} from '@angular/core';
import {IHour} from "../models/hour";
import {HourService} from "../services/hour.service";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  hours:IHour[]=[];

  constructor(private hourService:HourService) {}

  async ngOnInit() {
    this.hours= await this.hourService.getAllByUserId();
    console.log(this.hours);
  }

}
