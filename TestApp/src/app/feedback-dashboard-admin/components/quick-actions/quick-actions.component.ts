import { Component } from '@angular/core';
import { Router } from '@angular/router';

export interface QuickAction {

  title: string;
  icon: string;
  color: string;
  route: string;

}

@Component({
  selector: 'app-quick-actions',
  templateUrl: './quick-actions.component.html',
  styleUrls: ['./quick-actions.component.css']
})
export class QuickActionsComponent {

  constructor(
    private router: Router
  ) {}

  actions: QuickAction[] = [

    {
      title: 'Add Faculty',
      icon: 'groups',
      color: '#1976d2',
      route: '/faculty'
    },

    {
      title: 'Add Student',
      icon: 'school',
      color: '#43a047',
      route: '/student'
    },

    {
      title: 'Assign Batch',
      icon: 'menu_book',
      color: '#fb8c00',
      route: '/batch'
    },

    {
      title: 'Feedback Form',
      icon: 'rate_review',
      color: '#8e24aa',
      route: '/feedback'
    },

    {
      title: 'Department',
      icon: 'business',
      color: '#3949ab',
      route: '/department'
    },

    {
      title: 'Subject',
      icon: 'book',
      color: '#e53935',
      route: '/subject'
    }

  ];

  navigate(route: string) {
    this.router.navigate([route]);
  }

}