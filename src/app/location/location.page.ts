import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth-service.service";
import {Router} from "@angular/router";
import {LocationService} from "../services/location.service";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {

  formData:FormGroup = new FormGroup({});
  isToastOpen = false;
  toastMessage='';

  constructor(private locationService:LocationService,
              private router:Router) { }

  ngOnInit() {
    this.formData = new FormGroup({
      name: new FormControl(''),
      latitude: new FormControl(''),
      longitude: new FormControl(''),
      videoPath: new FormControl(''),
    })
  }

  setOpen(isOpen: boolean,message: string) {
    this.isToastOpen = isOpen;
    this.toastMessage = message;
  }

  async saveFile(e:any){
    console.log(e);
    let file:File = e.target.files[0];
    let formDate = new FormData();
    formDate.append('file',file);
    let path=await this.locationService.addFile(formDate);
    this.formData.controls['videoPath'].setValue(path);
    console.log(path);
  }


  async onSubmit(){
    try {
      await this.locationService.create(this.formData.value);
    } catch (e:any) {
      this.setOpen(true,e.error);
    }
  }

}
