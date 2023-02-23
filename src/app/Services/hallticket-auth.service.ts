import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class HallticketAuthService {

  constructor(private dataService: DataService) { 
  }

  private hallticketGuard = false;

  hallTicketValid(): void{
    this.hallticketGuard = true;
  }

  get Guard(){
    return this.hallticketGuard;
  }

}
