import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ControllerAuthService {

  constructor() { }

  private login = false;

  controllerLoginAuth(): void{
    this.login = true;
  }

  controllerLogoutAuth(): void{
    this.login = false;
  }

  get Guard(){
    return this.login;
  }

}
