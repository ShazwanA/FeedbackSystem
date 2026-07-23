import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ServicesService } from 'src/app/services/services.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-error-state',
  templateUrl: './error-state.component.html',
  styleUrls: ['./error-state.component.css']
})
export class ErrorStateComponent {

  userRole: string | null = null;

  constructor(
    private shared: SharedService,
    private services: ServicesService
  ) {}

  @Input() title = 'Something went wrong';
  @Input() message = 'Unable to load data.';
  @Input() buttonText = 'Retry';
  @Output() retry = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }

  redirectToHome(): void {
    this.userRole = this.services.getRole();
    if (this.userRole === 'admin') {
      window.location.href = this.shared.ADMIN_PATH;
    }
    else if (this.userRole === 'faculty') {
      window.location.href = this.shared.FACULTY_PATH;
    }
    else if (this.userRole === 'student') {
      window.location.href = this.shared.STUDENT_PATH;
    }
  else {
    this.services.logout();
  }
}
}