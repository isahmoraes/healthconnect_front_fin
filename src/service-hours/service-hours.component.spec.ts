import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceHoursComponent } from './service-hours.component';

describe('ServiceHoursComponent', () => {
  let component: ServiceHoursComponent;
  let fixture: ComponentFixture<ServiceHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceHoursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
