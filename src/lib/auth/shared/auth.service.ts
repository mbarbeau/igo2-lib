import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Rx';
import { JwtHelper } from 'angular2-jwt';

import { ConfigService } from '../../core';
import { Base64 } from '../../utils';

import { AuthOptions } from '../shared';

@Injectable()
export class AuthService {
  public redirectUrl: string;
  private options: AuthOptions;
  private token: string;

  constructor(private http: Http,
              private config: ConfigService,
              private router: Router) {

    this.options = this.config.getConfig('auth') || {};
    this.token = localStorage.getItem(this.options.tokenKey);
  }

  login(username: string, password: string): any {
    const myHeader = new Headers();
    myHeader.append('Content-Type', 'application/json');

    const body = JSON.stringify({
      username: username,
      password: this.encodePassword(password)
    });

    return this.http.post(`${this.options.url}/login`, body, { headers: myHeader })
      .map((res: any) => {
        const data = res.json();
        this.token = data.token;
        localStorage.setItem(this.options.tokenKey, this.token);
      });
  }

  loginWithToken(token: string, type: string): any {
    const myHeader = new Headers();
    myHeader.append('Content-Type', 'application/json');

    const body = JSON.stringify({
      token: token,
      typeConnexion: type
    });

    return this.http.post(`${this.options.url}/login`, body, { headers: myHeader })
      .map((res: any) => {
        const data = res.json();
        this.token = data.token;
        localStorage.setItem(this.options.tokenKey, this.token);
      });
  }

  logout() {
    this.token = undefined;
    localStorage.removeItem(this.options.tokenKey);
    return Observable.of(true);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.options.tokenKey);
    const jwtHelper = new JwtHelper();
    return token && !jwtHelper.isTokenExpired(token);
  }

  getToken(): string {
    return localStorage.getItem(this.options.tokenKey);
  }

  decodeToken() {
    if (this.isAuthenticated()) {
      const token = localStorage.getItem(this.options.tokenKey);
      const jwtHelper = new JwtHelper();
      return jwtHelper.decodeToken(token);
    }
    return false;
  }

  goToRedirectUrl() {
    const redirectUrl = this.redirectUrl || this.router.url;

    if (redirectUrl === this.options.loginRoute) {
      this.router.navigateByUrl('/');
    } else if (redirectUrl) {
      this.router.navigateByUrl(redirectUrl);
    }
  }

  private encodePassword(password: string) {
    return Base64.encode(password);
  }

  get logged() {
    return this.isAuthenticated();
  }
}