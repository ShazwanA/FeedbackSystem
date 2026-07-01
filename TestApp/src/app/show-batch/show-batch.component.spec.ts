import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowBatchComponent } from './show-batch.component';

describe('ShowBatchComponent', () => {
  let component: ShowBatchComponent;
  let fixture: ComponentFixture<ShowBatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowBatchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
