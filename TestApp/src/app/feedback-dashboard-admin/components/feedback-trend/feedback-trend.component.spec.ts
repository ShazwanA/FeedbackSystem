import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackTrendComponent } from './feedback-trend.component';

describe('FeedbackTrendComponent', () => {
  let component: FeedbackTrendComponent;
  let fixture: ComponentFixture<FeedbackTrendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackTrendComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
