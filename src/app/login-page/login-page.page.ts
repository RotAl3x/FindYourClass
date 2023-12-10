import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthService} from "../services/auth-service.service";
import {delay} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss'],
})
export class LoginPagePage implements OnInit {

 formData:FormGroup = new FormGroup({});
  isToastOpen = false;
  isToastErrorOpen = false;

  constructor(private authService: AuthService,
              private router:Router) { }

  ngOnInit() {
    this.formData = new FormGroup({
      email: new FormControl(),
      password: new FormControl
    })
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  setOpenError(isOpen: boolean) {
    this.isToastErrorOpen = isOpen;
  }

  async onSubmit(){
    try {
      await this.authService.login(this.formData.value);
      await delay(1000);
      this.setOpen(true);
      await this.router.navigate(['tabs']);
    } catch (e) {
      this.setOpenError(true);
      console.log(e);
    }
  }

}
