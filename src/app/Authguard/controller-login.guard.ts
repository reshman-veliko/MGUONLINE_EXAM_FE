import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ControllerAuthService } from '../Services/controller-auth.service';

@Injectable({
  providedIn: 'root'
})
export class ControllerLoginGuard implements CanActivate {
  constructor(private authService: ControllerAuthService,
    private myRoute: Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.authService.Guard){
        return true;
      }
      else{
        this.myRoute.navigate(['/landing/invigilator']);
      }
  }
  
}
