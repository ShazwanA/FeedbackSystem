import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMyBatchesComponent } from './show-my-batches.component';

describe('ShowMyBatchesComponent', () => {
  let component: ShowMyBatchesComponent;
  let fixture: ComponentFixture<ShowMyBatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowMyBatchesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowMyBatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
