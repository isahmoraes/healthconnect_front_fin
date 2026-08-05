import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../services/appointments.service';
import { Appointment } from '../models/Appointment';
import { DoctorService } from '../services/doctor.service';
import { PatientService } from '../services/patient.service';
import { SpecialtyService } from '../services/specialty.service';




@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {

  appointmentService = inject(AppointmentService);
  doctorService = inject(DoctorService);
  patientService = inject(PatientService);
  specialtyService = inject(SpecialtyService);

  isModalOpen = signal(false);

  newAppointment: Partial<Appointment> = {
    patientId: '',
    doctorId: '',
    dateTime: '',
    observations: ''
  };

  ngOnInit(): void {
    this.appointmentService.list().subscribe();
    this.doctorService.list().subscribe();
    this.patientService.list().subscribe();
  }

  openModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {

    this.isModalOpen.set(false);

    this.newAppointment = {
      patientId: '',
      doctorId: '',
      dateTime: '',
      observations: ''
    };

  }

  saveAppointment(): void {

    if (
      !this.newAppointment.patientId ||
      !this.newAppointment.doctorId ||
      !this.newAppointment.dateTime
    ) {
      alert('Fill in all required fields.');
      return;
    }

    this.appointmentService.create(this.newAppointment).subscribe(() => {
      this.closeModal();
    });

  }

  cancelAppointment(id: string): void {

    if (confirm('Do you really want to cancel this appointment?')) {

      this.appointmentService
        .updateStatus(id, 'CANCELADO')
        .subscribe();

    }

  }

  getPatientName(id: string): string {

    return this.patientService
      .patients()
      .find(p => p.id === id)?.name || 'Patient not found';

  }

  getDoctorName(id: string): string {

    return this.doctorService
      .doctors()
      .find(d => d.id === id)?.name || 'Doctor not found';

  }

 getStatusClass(status: Appointment['status']) {

  switch (status) {

    case 'CONFIRMADO':
      return 'confirmed';

    case 'PENDENTE':
      return 'pending';

    case 'CANCELADO':
      return 'cancelled';

    case 'CONCLUIDO':
      return 'completed';

    default:
      return '';
  }

}

}