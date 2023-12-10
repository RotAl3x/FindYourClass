import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {IHour} from "../models/hour";
import {AuthService} from "./auth-service.service";

@Injectable({
  providedIn: 'root'
})
export class HourService {

  private readonly _baseUrl = environment.apiUrl;

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  public async getById(id:string): Promise<IHour> {
    const url = this._baseUrl + `api/hour/${id}`
    const options = await this.authService.getOptions(true);
    return await firstValueFrom(this.http.get<IHour>(url,options));
  }

  public async getAllByUserId(): Promise<IHour[]> {
    const url = this._baseUrl + `api/hour/userId`
    const options = await this.authService.getOptions(true);
    const test= await firstValueFrom(this.http.get<IHour[]>(url,options));
    console.log(test);
    return test;
  }

  public async create(data: Partial<IHour>): Promise<IHour> {
    const url = this._baseUrl + 'api/course';
    const options = await this.authService.getOptions(true);
    return await firstValueFrom(this.http.post<IHour>(url, data, options));
  }

  public async update(data: Partial<IHour>): Promise<IHour> {
    const url = this._baseUrl + 'api/course/edit';
    const options = await this.authService.getOptions(true);
    return await firstValueFrom(this.http.patch<IHour>(url, data, options));
  }

  public async delete(data: string | undefined): Promise<any> {
    const url = this._baseUrl + 'api/course/delete/' + data;
    const options = await this.authService.getOptions(true);
    return await firstValueFrom(this.http.delete<string>(url, options));
  }
}
