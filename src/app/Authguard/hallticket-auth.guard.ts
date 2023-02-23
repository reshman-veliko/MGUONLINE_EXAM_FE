import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HallticketAuthService } from '../Services/hallticket-auth.service';

@Injectable({
  providedIn: 'root'
})
export class HallticketAuthGuard implements CanActivate {
  constructor(private authService: HallticketAuthService,
    private myRoute: Router){
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.authService.Guard){
        return true;
      }
      else{
        this.myRoute.navigate(['']);
      }
  }
  
}
