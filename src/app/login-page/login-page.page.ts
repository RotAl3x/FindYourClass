import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth-service.service";
import {Router} from "@angular/router";
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss'],
})
export class LoginPagePage implements OnInit {

 formData:FormGroup = new FormGroup({});
  isToastOpen = false;
  toastMessage='';

  constructor(private authService: AuthService,
              private router:Router) { }

  ngOnInit() {
    this.formData = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    })
  }

  setOpen(isOpen: boolean,message: string) {
    this.isToastOpen = isOpen;
    this.toastMessage = message;
  }

  async onSubmit(){
    this.formData.markAllAsTouched();
    if (!this.formData.valid) {
      this.setOpen(true,"Check form");
      return;
    }
    try {
      await this.authService.login(this.formData.value);
      this.setOpen(true,"Login successfully");
      await delay(1000);
      await this.router.navigate(['tabs']);
    } catch (e:any) {
      this.setOpen(true,e.error);
    }
  }

}
