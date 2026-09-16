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
  editingAppointmentId: number | null = null;

  newAppointment: Partial<Appointment> = {
    patient_id: 0,
    doctor_id: 0,
    specialty_id: 0,
    appointment_date: '',
    time: '',
    is_recurrence: false,
    obs: ''
  };

  ngOnInit(): void {
    this.appointmentService.list().subscribe();
    this.doctorService.list().subscribe();
    this.patientService.list().subscribe();
    this.specialtyService.getAll().subscribe();
  }

  openModal(): void {
    this.editingAppointmentId = null;
    this.isModalOpen.set(true);
  }

  closeModal(): void {

    this.isModalOpen.set(false);
    this.editingAppointmentId = null;

    this.newAppointment = {
      patient_id: 0,
      doctor_id: 0,
      specialty_id: 0,
      appointment_date: '',
      time: '',
      is_recurrence: false,
      obs: ''
    };

  }

  saveAppointment(): void {

    if (
      !this.newAppointment.patient_id ||
      !this.newAppointment.doctor_id ||
      !this.newAppointment.specialty_id ||
      !this.newAppointment.appointment_date ||
      !this.newAppointment.time
    ) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const request = this.editingAppointmentId === null
      ? this.appointmentService.create(this.newAppointment)
      : this.appointmentService.update(this.editingAppointmentId, this.newAppointment);

    request.subscribe(() => {
      this.closeModal();
    });

  }

  editAppointment(appointment: Appointment): void {
    this.editingAppointmentId = appointment.id;
    this.newAppointment = { ...appointment };
    this.isModalOpen.set(true);
  }

  cancelAppointment(id: number): void {

    if (confirm('Deseja realmente cancelar este agendamento?')) {

      this.appointmentService
        .updateStatus(id, 'cancelled')
        .subscribe();

    }

  }

  getPatientName(id: number): string {

    const patient = this.patientService
      .patients()
      .find(item => item.id === id);

    if (patient) {
      return patient.name;
    }

    this.patientService.getById(id).subscribe();
    return 'Paciente não encontrado';

  }

  getDoctorName(id: number): string {

    const doctor = this.doctorService
      .doctors()
      .find(item => item.id === id);

    if (doctor) {
      return doctor.name;
    }

    this.doctorService.getById(id).subscribe();
    return 'Médico não encontrado';

  }

  getSpecialtyName(id: number): string {

    const specialty = this.specialtyService
      .specialties()
      .find(item => item.id === id);

    if (specialty) {
      return specialty.name;
    }

    this.specialtyService.getById(id).subscribe();
    return 'Especialidade não encontrada';

  }

 getStatusClass(status: Appointment['status']) {

  switch (status) {

    case 'confirmed':
      return 'confirmed';

    case 'pending':
      return 'pending';

    case 'cancelled':
      return 'cancelled';

    case 'completed':
      return 'completed';

    default:
      return '';
  }

}

  getStatusLabel(status: Appointment['status']): string {

    switch (status) {

      case 'confirmed':
        return 'Confirmado';

      case 'pending':
        return 'Pendente';

      case 'cancelled':
        return 'Cancelado';

      case 'completed':
        return 'Concluído';

      default:
        return status;
    }

  }

}