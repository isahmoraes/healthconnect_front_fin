import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorScheduleComponent } from './doctor_schedule.component';

describe('DoctorScheduleComponent', () => {
  let component: DoctorScheduleComponent;
  let fixture: ComponentFixture<DoctorScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
