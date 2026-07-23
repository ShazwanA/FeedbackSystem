import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-today-summary',
  templateUrl: './today-summary.component.html',
  styleUrls: ['./today-summary.component.css']
})
export class TodaySummaryComponent implements OnInit {

  @Input() todaySummaryData: any;

  constructor() { }

  ngOnInit(): void { }

}
