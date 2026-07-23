import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-faculty',
  templateUrl: './top-faculty.component.html',
  styleUrls: ['./top-faculty.component.css']
})
export class TopFacultyComponent implements OnInit {

  @Input() topFaculty!: any;
  constructor() { }

  ngOnInit(): void { }

}
