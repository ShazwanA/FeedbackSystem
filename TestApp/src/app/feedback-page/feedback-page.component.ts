import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services/services.service';

@Component({
  selector: 'app-feedback-page',
  templateUrl: './feedback-page.component.html',
  styleUrls: ['./feedback-page.component.css']
})
export class FeedbackPageComponent implements OnInit {

   questions: any = [];

  answers: any = {};

  constructor(private service: ServicesService) {}

  ngOnInit() {

    this.service.allFeedbackQuestions().subscribe(res => {
      this.questions = res;
    });

  }

  submitFeedback() {

    console.log(this.answers);

  }

}
