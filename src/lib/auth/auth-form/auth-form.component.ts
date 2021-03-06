import { Component, ChangeDetectionStrategy,
  OnInit, Input, Optional } from '@angular/core';
import { Router } from '@angular/router';

import { ConfigService } from '../../core';
import { AuthService, AuthOptions } from '../shared';

@Component({
  selector: 'igo-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.styl'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AuthFormComponent implements OnInit {

  @Input()
  get alreadyConnectedDiv(): boolean {
    return this._alreadyConnectedDiv;
  }
  set alreadyConnectedDiv(value: boolean ) {
    this._alreadyConnectedDiv = value.toString() === 'true';
  }
  private _alreadyConnectedDiv: boolean = false;

  @Input()
  get backgroundDisable(): boolean {
    return this._backgroundDisable;
  }
  set backgroundDisable(value: boolean) {
    this._backgroundDisable = value.toString() === 'true';
  }
  private _backgroundDisable: boolean = true;

  private options: AuthOptions;
  private user;

  public visible: boolean = true;

  constructor(
    public auth: AuthService,
    private config: ConfigService,
    @Optional() private router: Router
  ) {
    this.options = this.config.getConfig('auth') || {};
    this.visible = Object.getOwnPropertyNames(this.options).length !== 0;

    if (this.auth.decodeToken()) {
        this.user = {
          name: this.auth.decodeToken().user.sourceId
        };
    }
  }

  public ngOnInit() {
    this.analyzeRoute();
  }

  protected login() {
    this.auth.goToRedirectUrl();
  }

  protected logout() {
    this.auth.logout().subscribe(() => {
      if (this.router && this.options.loginRoute) {
        this.router.navigate([this.options.loginRoute]);
      }
    });
  }

  private analyzeRoute() {
    if (!this.router) { return; }

    const logoutRoute = this.options.logoutRoute;
    const loginRoute = this.options.loginRoute;
    const currentRoute = this.router.url;

    const isLogoutRoute: boolean = currentRoute === logoutRoute;
    const isLoginRoute: boolean = currentRoute === loginRoute;

    if (isLogoutRoute) {
      this.logout();
    } else if (isLoginRoute) {
      this.backgroundDisable = false;
      this.alreadyConnectedDiv = true;
    }
  }
}
