import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackDashboardPageComponent } from './feedback-dashboard-page.component';

describe('FeedbackDashboardPageComponent', () => {
  let component: FeedbackDashboardPageComponent;
  let fixture: ComponentFixture<FeedbackDashboardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackDashboardPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackDashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
