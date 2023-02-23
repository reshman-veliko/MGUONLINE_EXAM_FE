import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mark-list',
  templateUrl: './mark-list.component.html',
  styleUrls: ['./mark-list.component.scss']
})
export class MarkListComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  Submit(): void{
    this.router.navigate(["landing/student/initial"]);
  }

}
