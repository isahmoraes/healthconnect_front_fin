import { Component, inject, Signal, signal } from '@angular/core';
import { ServiceHours } from '../models/ServiceHours';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { Doctor } from '../models/Doctor';
import { DoctorService } from '../services/doctor.service';

@Component({
  selector: 'app-service-hours',
  imports: [CommonModule, FormsModule],
  templateUrl: './service-hours.component.html',
  styleUrl: './service-hours.component.css'
})
export class ServiceHoursComponent {

  serviceHours: ServiceHours[] = [];
  doctorService = inject(DoctorService);
  doctors = this.doctorService.doctors;
  
  isModalOpen = signal(false);

  newServiceHour: Partial<ServiceHours> = {
    doctorId: '',
    dayOfWeek: 0,
    startTime: '',
    endTime: ''
  };


  openModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {

    this.isModalOpen.set(false);

    this.newServiceHour = {
      doctorId: '',
      dayOfWeek: 0,
      startTime: '',
      endTime: ''
    };

  }

  saveServiceHour(): void {

    if (
      !this.newServiceHour.doctorId ||
      !this.newServiceHour.dayOfWeek ||
      !this.newServiceHour.startTime ||
      !this.newServiceHour.endTime
    ) {

      alert('Fill in all required fields.');
      return;

    }

    this.serviceHours.push({
      id: Date.now().toString(),
      doctorId: this.newServiceHour.doctorId!,
      dayOfWeek: this.newServiceHour.dayOfWeek!,
      startTime: this.newServiceHour.startTime!,
      endTime: this.newServiceHour.endTime!
    } as ServiceHours);

    this.closeModal();

  }

  editServiceHour(serviceHour: ServiceHours): void {

    this.newServiceHour = { ...serviceHour };

    this.isModalOpen.set(true);

  }

  deleteServiceHour(id: string): void {

    if (confirm('Do you really want to delete this service hour?')) {

      this.serviceHours = this.serviceHours.filter(
        item => item.id !== id
      );

    }

  }

}