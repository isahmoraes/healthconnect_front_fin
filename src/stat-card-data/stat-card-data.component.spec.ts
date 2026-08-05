import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatCardDataComponent } from './stat-card-data.component';

describe('StatCardDataComponent', () => {
  let component: StatCardDataComponent;
  let fixture: ComponentFixture<StatCardDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatCardDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatCardDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
