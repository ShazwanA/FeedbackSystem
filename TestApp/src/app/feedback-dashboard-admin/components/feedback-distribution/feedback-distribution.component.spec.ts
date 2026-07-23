import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackDistributionComponent } from './feedback-distribution.component';

describe('FeedbackDistributionComponent', () => {
  let component: FeedbackDistributionComponent;
  let fixture: ComponentFixture<FeedbackDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackDistributionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
