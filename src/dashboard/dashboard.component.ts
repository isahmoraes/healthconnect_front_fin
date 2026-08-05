import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentService } from '../services/appointments.service';
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

  totalAppointments = computed(() =>
    this.appointmentService.appointments().length
  );

  totalConfirmed = computed(() =>
    this.appointmentService
      .appointments()
      .filter(a => a.status === 'CONFIRMADO').length
  );

  totalPending = computed(() =>
    this.appointmentService
      .appointments()
      .filter(a => a.status === 'PENDENTE').length
  );

  totalCancelled = computed(() =>
    this.appointmentService
      .appointments()
      .filter(a => a.status === 'CANCELADO').length
  );

  recentAppointments = computed(() =>
    this.appointmentService
      .appointments()
      .slice(0, 5)
  );

  ngOnInit(): void {
    this.appointmentService.list().subscribe();
  }

  getStatusClass(status: string): string {

    switch (status) {

      case 'CONFIRMADO':
        return 'status-confirmed';

      case 'PENDENTE':
        return 'status-pending';

      case 'CANCELADO':
        return 'status-cancelled';

      default:
        return 'status-default';

    }

  }

}