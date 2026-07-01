import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAllFeedbackQuestionsComponent } from './show-all-feedback-questions.component';

describe('ShowAllFeedbackQuestionsComponent', () => {
  let component: ShowAllFeedbackQuestionsComponent;
  let fixture: ComponentFixture<ShowAllFeedbackQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAllFeedbackQuestionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowAllFeedbackQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
