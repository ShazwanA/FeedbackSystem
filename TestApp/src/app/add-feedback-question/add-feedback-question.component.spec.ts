import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFeedbackQuestionComponent } from './add-feedback-question.component';

describe('AddFeedbackQuestionComponent', () => {
  let component: AddFeedbackQuestionComponent;
  let fixture: ComponentFixture<AddFeedbackQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFeedbackQuestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFeedbackQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
