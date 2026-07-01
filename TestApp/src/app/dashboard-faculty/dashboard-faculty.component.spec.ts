import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFacultyComponent } from './dashboard-faculty.component';

describe('DashboardTeacherComponent', () => {
  let component: DashboardFacultyComponent;
  let fixture: ComponentFixture<DashboardFacultyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardFacultyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardFacultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
