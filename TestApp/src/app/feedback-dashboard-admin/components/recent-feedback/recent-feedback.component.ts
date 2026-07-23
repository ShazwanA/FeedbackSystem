import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recent-feedback',
  templateUrl: './recent-feedback.component.html',
  styleUrls: ['./recent-feedback.component.css']
})
export class RecentFeedbackComponent {

  @Input() recentFeedback: any[] = [];

  displayedColumns: string[] = [

    'student',
    'faculty',
    'subject',
    'rating',
    'submitted_on'

  ];

}