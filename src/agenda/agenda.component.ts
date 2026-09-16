import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Appointment } from '../models/Appointment';
import { AppointmentService } from '../services/appointments.service';
import { DoctorService } from '../services/doctor.service';
import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.css'
})
export class AgendaComponent implements OnInit {
  appointmentService = inject(AppointmentService);
  doctorService = inject(DoctorService);
  patientService = inject(PatientService);

  selectedDoctorId = 0;
  selectedStatus = '';
  selectedWeekday = '';
  calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  selectedDay: Date | null = null;
  activeFilter: 'doctor' | 'status' | 'weekday' | null = null;

  ngOnInit(): void {
    this.appointmentService.list().subscribe();
    this.doctorService.list().subscribe();
    this.patientService.list().subscribe();
  }

  get calendarDays(): Date[] {
    const firstDay = new Date(this.calendarMonth);
    const mondayOffset = (firstDay.getDay() + 6) % 7;
    firstDay.setDate(firstDay.getDate() - mondayOffset);

    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(firstDay);
      day.setDate(firstDay.getDate() + index);
      return day;
    });
  }

  get filteredAppointments(): Appointment[] {
    return this.appointmentService.appointments().filter(appointment =>
      (!this.selectedDoctorId || appointment.doctor_id === this.selectedDoctorId)
      && (!this.selectedStatus || appointment.status === this.selectedStatus)
      && (!this.selectedWeekday || this.getWeekdayCode(appointment.appointment_date) === this.selectedWeekday)
    );
  }

  toggleFilter(filter: 'doctor' | 'status' | 'weekday'): void {
    this.activeFilter = this.activeFilter === filter ? null : filter;
  }

  closeFilter(): void {
    this.activeFilter = null;
  }

  selectDoctor(id: number): void {
    this.selectedDoctorId = id;
    this.closeFilter();
  }

  selectStatus(status: string): void {
    this.selectedStatus = status;
    this.closeFilter();
  }

  selectWeekday(day: string): void {
    this.selectedWeekday = day;
    this.closeFilter();
  }

  getSelectedDoctorLabel(): string {
    return this.selectedDoctorId
      ? this.getDoctorName(this.selectedDoctorId)
      : 'Todos os médicos';
  }

  getSelectedStatusLabel(): string {
    return this.selectedStatus ? this.getStatusLabel(this.selectedStatus) : 'Todos os status';
  }

  getSelectedWeekdayLabel(): string {
    return this.selectedWeekday
      ? this.getSelectedWeekdayName(this.selectedWeekday)
      : 'Todos os dias';
  }

  getSelectedWeekdayName(day: string): string {
    const labels: Record<string, string> = {
      MONDAY: 'Segunda-feira',
      TUESDAY: 'Terça-feira',
      WEDNESDAY: 'Quarta-feira',
      THURSDAY: 'Quinta-feira',
      FRIDAY: 'Sexta-feira',
      SATURDAY: 'Sábado',
      SUNDAY: 'Domingo'
    };

    return labels[day] || day;
  }

  getWeekdayCode(date: string): string {
    return this.getDayCode(new Date(`${date}T00:00:00`));
  }

  previousMonth(): void {
    this.calendarMonth = new Date(
      this.calendarMonth.getFullYear(),
      this.calendarMonth.getMonth() - 1,
      1
    );
  }

  nextMonth(): void {
    this.calendarMonth = new Date(
      this.calendarMonth.getFullYear(),
      this.calendarMonth.getMonth() + 1,
      1
    );
  }

  currentMonth(): void {
    const today = new Date();
    this.calendarMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  }

  getAppointmentsForDay(day: Date): Appointment[] {
    const dateKey = this.toDateKey(day);
    return this.filteredAppointments.filter(appointment => appointment.appointment_date === dateKey);
  }

  openDay(day: Date): void {
    this.selectedDay = new Date(day);
  }

  closeDay(): void {
    this.selectedDay = null;
  }

  get selectedDayAppointments(): Appointment[] {
    return this.selectedDay ? this.getAppointmentsForDay(this.selectedDay) : [];
  }

  getCalendarTitle(): string {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${months[this.calendarMonth.getMonth()]} ${this.calendarMonth.getFullYear()}`;
  }

  isCurrentMonth(day: Date): boolean {
    return day.getMonth() === this.calendarMonth.getMonth()
      && day.getFullYear() === this.calendarMonth.getFullYear();
  }

  getDayCode(day: Date): string {
    return ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][day.getDay()];
  }

  getDoctorName(id: number): string {
    return this.doctorService.doctors().find(doctor => doctor.id === id)?.name
      || 'Médico não encontrado';
  }

  getPatientName(id: number): string {
    return this.patientService.patients().find(patient => patient.id === id)?.name
      || 'Paciente não encontrado';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      cancelled: 'Cancelado',
      completed: 'Concluído'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getWeekdayLabel(day: Date): string {
    return ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][day.getDay()];
  }

  getSelectedDayTitle(day: Date): string {
    const weekdays = [
      'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
      'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];

    return `${weekdays[day.getDay()]}, ${String(day.getDate()).padStart(2, '0')}/${String(day.getMonth() + 1).padStart(2, '0')}/${day.getFullYear()}`;
  }

  toDateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}
