import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopFacultyComponent } from './top-faculty.component';

describe('TopFacultyComponent', () => {
  let component: TopFacultyComponent;
  let fixture: ComponentFixture<TopFacultyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopFacultyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopFacultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
