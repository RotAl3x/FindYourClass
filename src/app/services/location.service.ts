import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
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

  public async create(data: Partial<ILocation>): Promise<ILocation> {
    const url = this._baseUrl + 'api/location/AddLocation';
    return await firstValueFrom(this.http.post<ILocation>(url, data));
  }

  public async addFile(data: FormData): Promise<string> {
    const url = this._baseUrl + 'api/location/UploadFile';
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    // @ts-ignore
    return await firstValueFrom(this.http.post<any>(url, data,{ responseType: 'text' as const}));
  }
}
