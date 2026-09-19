import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },
  {
    path: 'appointments',
    loadComponent: () =>
      import('../appointments/appointments.component')
        .then(m => m.AppointmentsComponent)
  },
  {
    path: 'doctors',
    loadComponent: () =>
      import('../doctor/doctor.component')
        .then(m => m.DoctorsComponent)
  },
  {
    path: 'patients',
    loadComponent: () =>
      import('../patient/patient.component')
        .then(m => m.PatientsComponent)
  },
  {
    path: 'specialties',
    loadComponent: () =>
      import('../specialty/specialty.component')
        .then(m => m.SpecialtyComponent)
  },
  {
    path: 'schedules',
    loadComponent: () =>
      import('../doctor_schedule/doctor_schedule.component')
        .then(m => m.DoctorScheduleComponent)
  },
  {
    path: 'agenda',
    loadComponent: () =>
      import('../agenda/agenda.component')
        .then(m => m.AgendaComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];