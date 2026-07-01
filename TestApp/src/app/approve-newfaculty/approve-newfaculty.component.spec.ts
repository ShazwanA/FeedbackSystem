import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveNewfacultyComponent } from './approve-newfaculty.component';

describe('ApproveNewfacultyComponent', () => {
  let component: ApproveNewfacultyComponent;
  let fixture: ComponentFixture<ApproveNewfacultyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveNewfacultyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveNewfacultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
