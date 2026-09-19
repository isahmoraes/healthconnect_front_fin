import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Appointment } from '../models/Appointment';
import { DoctorSchedule } from '../models/DoctorSchedule';
import { AppointmentService } from '../services/appointments.service';
import { DoctorService } from '../services/doctor.service';
import { PatientService } from '../services/patient.service';
import { SpecialtyService } from '../services/specialty.service';
import { DoctorScheduleService } from '../services/doctor_schedule.service';

@Component({
  selector: 'app-doctor-schedule',
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor_schedule.html',
  styleUrl: './doctor_schedule.component.css'
})
export class DoctorScheduleComponent implements OnInit {
  doctorSchedules: DoctorSchedule[] = [];
  doctorService = inject(DoctorService);
  appointmentService = inject(AppointmentService);
  patientService = inject(PatientService);
  specialtyService = inject(SpecialtyService);
  doctorScheduleService = inject(DoctorScheduleService);

  isModalOpen = signal(false);
  editingDoctorScheduleId: number | null = null;
  selectedDoctorId = 0;
  selectedStatus = '';
  selectedPeriod = 'month';
  calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  activeFilter: 'doctor' | 'weekday' | null = null;
  newDoctorSchedule: Partial<DoctorSchedule> = this.createEmptyDoctorSchedule();

  ngOnInit(): void {
    this.doctorService.list().subscribe();
    this.appointmentService.list().subscribe();
    this.patientService.list().subscribe();
    this.specialtyService.getAll().subscribe();
    this.doctorScheduleService.list().subscribe((data) => {
      this.doctorSchedules = data;
    });
  }

  private createEmptyDoctorSchedule(): Partial<DoctorSchedule> {
    return { doctor_id: 0, day_of_week: '', start_time: '', end_time: '' };
  }

  openModal(): void {
    this.editingDoctorScheduleId = null;
    this.newDoctorSchedule = this.createEmptyDoctorSchedule();
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingDoctorScheduleId = null;
    this.activeFilter = null;
    this.newDoctorSchedule = this.createEmptyDoctorSchedule();
  }

  saveDoctorSchedule(): void {
    if (!this.newDoctorSchedule.doctor_id || !this.newDoctorSchedule.day_of_week
      || !this.newDoctorSchedule.start_time || !this.newDoctorSchedule.end_time) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const payload: Partial<DoctorSchedule> = {
      doctor_id: this.newDoctorSchedule.doctor_id,
      day_of_week: this.newDoctorSchedule.day_of_week,
      start_time: this.newDoctorSchedule.start_time,
      end_time: this.newDoctorSchedule.end_time
    };

    const request = this.editingDoctorScheduleId === null
      ? this.doctorScheduleService.create(payload)
      : this.doctorScheduleService.update(this.editingDoctorScheduleId, payload);

    request.subscribe((saved) => {
      this.doctorSchedules = this.editingDoctorScheduleId === null
        ? [...this.doctorSchedules, saved]
        : this.doctorSchedules.map(item => item.id === saved.id ? saved : item);
      this.closeModal();
    });
  }

  editDoctorSchedule(doctorSchedule: DoctorSchedule): void {
    this.editingDoctorScheduleId = doctorSchedule.id;
    this.newDoctorSchedule = { ...doctorSchedule };
    this.isModalOpen.set(true);
  }

  deleteDoctorSchedule(id: number): void {
    if (confirm('Deseja realmente excluir este horário de atendimento?')) {
      this.doctorScheduleService.delete(id).subscribe(() => {
        this.doctorSchedules = this.doctorSchedules.filter(item => item.id !== id);
      });
    }
  }

  getDoctorName(doctorSchedule: DoctorSchedule): string {
    const doctor = doctorSchedule.doctor
      || this.doctorService.doctors().find(item => item.id === doctorSchedule.doctor_id);
    return doctor?.name || 'Médico não encontrado';
  }

  getWeekDayName(dayOfWeek: string): string {
    const weekDays: Record<string, string> = {
      MONDAY: 'Segunda-feira', TUESDAY: 'Terça-feira', WEDNESDAY: 'Quarta-feira',
      THURSDAY: 'Quinta-feira', FRIDAY: 'Sexta-feira', SATURDAY: 'Sábado', SUNDAY: 'Domingo'
    };
    return weekDays[dayOfWeek] || dayOfWeek;
  }

  toggleFilter(filter: 'doctor' | 'weekday'): void {
    this.activeFilter = this.activeFilter === filter ? null : filter;
  }

  closeFilter(): void { this.activeFilter = null; }

  selectDoctor(id: number): void {
    this.newDoctorSchedule.doctor_id = id;
    this.closeFilter();
  }

  selectWeekday(day: string): void {
    this.newDoctorSchedule.day_of_week = day;
    this.closeFilter();
  }

  getSelectedDoctorLabel(): string {
    return this.newDoctorSchedule.doctor_id
      ? this.doctorService.doctors().find(doctor => doctor.id === this.newDoctorSchedule.doctor_id)?.name || 'Médico não encontrado'
      : 'Selecione um médico';
  }

  getSelectedWeekdayLabel(): string {
    return this.newDoctorSchedule.day_of_week
      ? this.getWeekDayName(this.newDoctorSchedule.day_of_week)
      : 'Selecione o dia';
  }

  get filteredAppointments(): Appointment[] {
    const today = new Date();
    return this.appointmentService.appointments().filter(appointment => {
      const date = new Date(`${appointment.appointment_date}T00:00:00`);
      return (!this.selectedDoctorId || appointment.doctor_id === this.selectedDoctorId)
        && (!this.selectedStatus || appointment.status === this.selectedStatus)
        && this.matchesPeriod(date, today);
    });
  }

  matchesPeriod(date: Date, today: Date): boolean {
    if (this.selectedPeriod === 'all') return true;
    if (this.selectedPeriod === 'day') return date.toDateString() === today.toDateString();
    if (this.selectedPeriod === 'week') {
      const start = new Date(today);
      start.setDate(today.getDate() - today.getDay());
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 7);
      return date >= start && date < end;
    }
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  }

  getAppointmentPatientName(id: number): string {
    return this.patientService.patients().find(patient => patient.id === id)?.name || 'Paciente não encontrado';
  }

  getAppointmentDoctorName(id: number): string {
    return this.doctorService.doctors().find(doctor => doctor.id === id)?.name || 'Médico não encontrado';
  }

  getAppointmentStatusLabel(status: string): string {
    const labels: Record<string, string> = { pending: 'Pendente', confirmed: 'Confirmado', cancelled: 'Cancelado', completed: 'Concluído' };
    return labels[status] || status;
  }

  getCalendarTitle(): string {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return `${months[this.calendarMonth.getMonth()]} ${this.calendarMonth.getFullYear()}`;
  }

  get calendarDays(): Date[] {
    const firstDay = new Date(this.calendarMonth);
    firstDay.setDate(firstDay.getDate() - ((firstDay.getDay() + 6) % 7));
    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(firstDay);
      day.setDate(firstDay.getDate() + index);
      return day;
    });
  }

  isCurrentMonth(day: Date): boolean {
    return day.getMonth() === this.calendarMonth.getMonth() && day.getFullYear() === this.calendarMonth.getFullYear();
  }

  goToPreviousMonth(): void { this.calendarMonth = new Date(this.calendarMonth.getFullYear(), this.calendarMonth.getMonth() - 1, 1); }
  goToNextMonth(): void { this.calendarMonth = new Date(this.calendarMonth.getFullYear(), this.calendarMonth.getMonth() + 1, 1); }
  goToToday(): void { const today = new Date(); this.calendarMonth = new Date(today.getFullYear(), today.getMonth(), 1); }

  getDayCode(day: Date): string {
    return ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][day.getDay()];
  }

  getAvailabilityForDay(day: Date): DoctorSchedule[] {
    const dayCode = this.getDayCode(day);
    return this.doctorSchedules.filter(item =>
      (!this.selectedDoctorId || item.doctor_id === this.selectedDoctorId) && item.day_of_week === dayCode
    );
  }

  getAppointmentsForDay(day: Date): Appointment[] {
    const date = this.toDateKey(day);
    return this.appointmentService.appointments().filter(item =>
      item.appointment_date === date && (!this.selectedDoctorId || item.doctor_id === this.selectedDoctorId)
    );
  }

  toDateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}
