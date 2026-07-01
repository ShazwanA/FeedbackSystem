import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveNewstudentComponent } from './approve-newstudent.component';

describe('ApproveNewstudentComponent', () => {
  let component: ApproveNewstudentComponent;
  let fixture: ComponentFixture<ApproveNewstudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveNewstudentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveNewstudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
