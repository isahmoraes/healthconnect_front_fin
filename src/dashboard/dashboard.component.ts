import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentService } from '../services/appointments.service';
import { DoctorService } from '../services/doctor.service';
import { PatientService } from '../services/patient.service';
import { StatCardDataComponent } from '../stat-card-data/stat-card-data.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatCardDataComponent],

  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  appointmentService = inject(AppointmentService);
  patientService = inject(PatientService);
  doctorService = inject(DoctorService);

  totalAppointments = computed(() =>
    this.appointmentService.appointments().length
  );

  totalConfirmed = computed(() =>
    this.appointmentService
      .appointments()
      .filter(a => a.status === 'confirmed').length
  );

  totalPending = computed(() =>
    this.appointmentService
      .appointments()
      .filter(a => a.status === 'pending').length
  );

  totalCancelled = computed(() =>
    this.appointmentService
      .appointments()
      .filter(a => a.status === 'cancelled').length
  );

  recentAppointments = computed(() =>
    this.appointmentService
      .appointments()
      .slice(0, 5)
  );

  ngOnInit(): void {
    this.appointmentService.list().subscribe();
    this.patientService.list().subscribe();
    this.doctorService.list().subscribe();
  }

  getPatientName(id: number): string {
    const patient = this.patientService
      .patients()
      .find(item => item.id === id);

    if (patient) {
      return patient.name;
    }

    this.patientService.getById(id).subscribe();
    return 'N/A';
  }

  getDoctorName(id: number): string {
    const doctor = this.doctorService
      .doctors()
      .find(item => item.id === id);

    if (doctor) {
      return doctor.name;
    }

    this.doctorService.getById(id).subscribe();
    return 'N/A';
  }

  getStatusClass(status: string): string {

    switch (status) {

      case 'confirmed':
        return 'status-confirmed';

      case 'pending':
        return 'status-pending';

      case 'cancelled':
        return 'status-cancelled';

      default:
        return 'status-default';

    }

  }

  getStatusLabel(status: string): string {

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