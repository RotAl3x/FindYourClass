import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth-service.service";
import {IHour} from "../models/hour";
import {firstValueFrom} from "rxjs";
import {ILocation} from "../models/location";

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private readonly _baseUrl = environment.apiUrl;

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  public async getAll(): Promise<ILocation[]> {
    const url = this._baseUrl + `api/location/getAll`
    return await firstValueFrom(this.http.get<ILocation[]>(url));
  }
}
