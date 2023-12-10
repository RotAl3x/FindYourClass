import {EventEmitter, Injectable, OnInit} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {IAuthSession, IChangePassword, ILogin, IRegister, IRole, IUser} from "../models/login";
import { firstValueFrom, map, tap} from "rxjs";
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService{
  private static readonly tokenStorageKey: string = 'token';
  private static readonly sessionStorageKey: string = 'session';
  private _token?: string;
  private _session?: IAuthSession;
  private _authState: EventEmitter<boolean> = new EventEmitter();
  private readonly _baseUrl = environment.apiUrl;

  private storage: Storage | null = null;
  constructor(private http: HttpClient,
              private _storage: Storage,
              private router: Router) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    this.storage = await this._storage.create();
  }
  public async login(requestModel: Partial<ILogin>): Promise<any> {
    const url = this._baseUrl + 'api/auth/login';
    return firstValueFrom(this.http.post<IAuthSession>(url, requestModel)
      .pipe(tap(async res => {
        await this.saveSession(res);
      }))
      .pipe(map(() => {
        return true;
      })));
  }

  public async changePassword(data: Partial<IChangePassword>): Promise<any> {
    const url = this._baseUrl + 'api/auth/changePassword';
    const options = await this.getOptions(true);
    return await firstValueFrom(this.http.post(url, data, options));
  }

  public async register(data: Partial<IRegister>): Promise<any> {
    const url = this._baseUrl + 'api/auth/register';
    const options = await this.getOptions(true);
    return firstValueFrom(this.http.post(url, data, options));
  }

  public async saveSession(authSession?: IAuthSession): Promise<void> {
    if (authSession) {
      if(this.storage)await this.storage.set(AuthService.tokenStorageKey, authSession.token);
      if(this.storage)await this.storage.set(AuthService.sessionStorageKey, authSession);
    } else {
      if(this.storage) await this.storage.remove(AuthService.tokenStorageKey);
      if(this.storage) await this.storage.remove(AuthService.sessionStorageKey);
    }
    await this.loadSession();
  }

  public async getOptions(needsAuth?: boolean): Promise<{ headers?: HttpHeaders, responseType: any }> {
    return {headers: await this.getHeaders(needsAuth), responseType: 'text'};
  }

  public async hasRole(role: string): Promise<boolean> {
    const session = await this.getSession();
    if (!session || !session.role) {
      return false;
    }

    return session.role.indexOf(role) !== -1;
  }

  public async getHeaders(needsAuth?: boolean): Promise<HttpHeaders> {
    if (!needsAuth) {
      return new HttpHeaders();
    }
    const session = await this.getSession();

    if (!session) {
      return new HttpHeaders();
    }

    return new HttpHeaders().append('Authorization', `${session.tokenType} ${session.token}`);
  }

  public async getSession(): Promise<IAuthSession | undefined> {
    if (!this._session) {
      if(this.storage) this._session = <IAuthSession>await this.storage.get(AuthService.sessionStorageKey);
    }
    return this._session;
  }

  public async getUsersByRole(role: string): Promise<IUser[]> {
    const url = this._baseUrl + 'api/auth/getAllUsersByRole/' + role;
    return await firstValueFrom(this.http.get<IUser[]>(url));
  }

  public async getAllRoles(): Promise<string[]> {
    const url = this._baseUrl + 'api/auth/getAllRoles';
    return await firstValueFrom(this.http.get<string[]>(url));
  }

  public async logout(): Promise<void> {
    await this.saveSession();
    await this.router.navigate(['/']);
  }

  private async loadSession(): Promise<void> {
    const initialStatus = !!this._token;
    const oldToken = this._token;
    if(this.storage) this._token = <string>await this.storage.get(AuthService.tokenStorageKey);
    if (this._token) {
      if(this.storage) this._session = <IAuthSession>await this.storage.get(AuthService.sessionStorageKey);
    } else {
      this._session = undefined;
    }
    const differentStatus = initialStatus !== !!this._token || oldToken !== this._token;
    if (differentStatus) {
      this._authState.emit(!!this._token);
    }
  }
}
