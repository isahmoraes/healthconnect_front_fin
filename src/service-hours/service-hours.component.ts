import { Component, OnInit, inject, signal } from '@angular/core';
import { ServiceHours } from '../models/ServiceHours';
import { Appointment } from '../models/Appointment';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { DoctorService } from '../services/doctor.service';
import { AppointmentService } from '../services/appointments.service';
import { PatientService } from '../services/patient.service';
import { SpecialtyService } from '../services/specialty.service';

@Component({
  selector: 'app-service-hours',
  imports: [CommonModule, FormsModule],
  templateUrl: './service-hours.component.html',
  styleUrl: './service-hours.component.css'
})
export class ServiceHoursComponent implements OnInit {

  serviceHours: ServiceHours[] = [];
  doctorService = inject(DoctorService);
  appointmentService = inject(AppointmentService);
  patientService = inject(PatientService);
  specialtyService = inject(SpecialtyService);
  doctors = this.doctorService.doctors;
  
  isModalOpen = signal(false);

  newServiceHour: Partial<ServiceHours> = {
    doctorId: 0,
    availabilityType: 'ATENDIMENTO',
    scheduleMode: 'WEEKLY',
    workingDays: 'MONDAY_FRIDAY',
    date: '',
    dayOfWeek: '',
    startTime: '',
    endTime: ''
  };
  editingServiceHourId: number | null = null;
  selectedDoctorId = 0;
  selectedStatus = '';
  selectedPeriod = 'month';
  calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  activeFilter: 'doctor' | 'availability' | 'schedule' | 'weekday' | 'workingDays' | null = null;

  ngOnInit(): void {
    this.doctorService.list().subscribe();
    this.appointmentService.list().subscribe();
    this.patientService.list().subscribe();
    this.specialtyService.getAll().subscribe();
  }


  openModal(): void {
    this.editingServiceHourId = null;
    this.isModalOpen.set(true);
  }

  closeModal(): void {

    this.isModalOpen.set(false);
    this.editingServiceHourId = null;

    this.newServiceHour = {
      doctorId: 0,
      availabilityType: 'ATENDIMENTO',
      scheduleMode: 'WEEKLY',
      workingDays: 'MONDAY_FRIDAY',
      date: '',
      dayOfWeek: '',
      startTime: '',
      endTime: ''
    };

  }

  saveServiceHour(): void {

    if (
      !this.newServiceHour.doctorId ||
      (this.newServiceHour.scheduleMode === 'SINGLE_DAY' && !this.newServiceHour.dayOfWeek) ||
      (this.newServiceHour.scheduleMode === 'SPECIFIC' && !this.newServiceHour.date) ||
      !this.newServiceHour.startTime ||
      !this.newServiceHour.endTime
    ) {

      alert('Preencha todos os campos obrigatórios.');
      return;

    }

    const serviceHour: ServiceHours = {
      id: this.editingServiceHourId ?? Date.now(),
      doctorId: this.newServiceHour.doctorId!,
      availabilityType: this.newServiceHour.availabilityType || 'ATENDIMENTO',
      scheduleMode: this.newServiceHour.scheduleMode || 'WEEKLY',
      workingDays: this.newServiceHour.workingDays || 'MONDAY_FRIDAY',
      date: this.newServiceHour.date || '',
      dayOfWeek: this.newServiceHour.dayOfWeek!,
      startTime: this.newServiceHour.startTime!,
      endTime: this.newServiceHour.endTime!
    } as ServiceHours;

    this.serviceHours = this.editingServiceHourId === null
      ? [...this.serviceHours, serviceHour]
      : this.serviceHours.map(item => item.id === serviceHour.id ? serviceHour : item);

    this.closeModal();

  }

  editServiceHour(serviceHour: ServiceHours): void {

    this.editingServiceHourId = serviceHour.id;
    this.newServiceHour = { ...serviceHour };

    this.isModalOpen.set(true);

  }

  getDoctorName(serviceHour: ServiceHours): string {
    const doctor = serviceHour.doctor
      || this.doctorService.doctors().find(item => item.id === serviceHour.doctorId);

    if (doctor) {
      return doctor.name;
    }

    this.doctorService.getById(serviceHour.doctorId).subscribe();
    return 'Buscando médico...';
  }

  getWeekDayName(dayOfWeek: string): string {
    const weekDays: Record<string, string> = {
      MONDAY: 'Segunda-feira',
      TUESDAY: 'Terça-feira',
      WEDNESDAY: 'Quarta-feira',
      THURSDAY: 'Quinta-feira',
      FRIDAY: 'Sexta-feira',
      SATURDAY: 'Sábado',
      SUNDAY: 'Domingo'
    };

    return weekDays[dayOfWeek] || dayOfWeek;
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
    if (this.selectedPeriod === 'all') {
      return true;
    }

    if (this.selectedPeriod === 'day') {
      return date.toDateString() === today.toDateString();
    }

    if (this.selectedPeriod === 'week') {
      const start = new Date(today);
      start.setDate(today.getDate() - today.getDay());
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 7);
      return date >= start && date < end;
    }

    return date.getMonth() === today.getMonth()
      && date.getFullYear() === today.getFullYear();
  }

  getAppointmentPatientName(id: number): string {
    return this.patientService.patients().find(patient => patient.id === id)?.name
      || 'Paciente não encontrado';
  }

  getAppointmentDoctorName(id: number): string {
    return this.doctorService.doctors().find(doctor => doctor.id === id)?.name
      || 'Médico não encontrado';
  }

  getAppointmentStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      cancelled: 'Cancelado',
      completed: 'Concluído'
    };

    return labels[status] || status;
  }

  getAvailabilityLabel(type: ServiceHours['availabilityType'] | string): string {
    const labels: Record<string, string> = {
      ATENDIMENTO: 'Atendimento',
      AUSENCIA: 'Ausência',
      FERIAS: 'Férias',
      VIAGEM: 'Viagem',
      INTERVALO: 'Intervalo',
      ALMOCO: 'Almoço'
    };

    return labels[type];
  }

  getScheduleModeLabel(mode: ServiceHours['scheduleMode']): string {
    if (mode === 'SINGLE_DAY') {
      return 'Um dia da semana';
    }

    return mode === 'SPECIFIC' ? 'Data específica' : 'Toda a semana';
  }

  getWorkingDaysLabel(days: ServiceHours['workingDays'] | string | undefined): string {
    return days === 'MONDAY_SATURDAY' ? 'Segunda a sábado' : 'Segunda a sexta';
  }

  toggleFilter(filter: 'doctor' | 'availability' | 'schedule' | 'weekday' | 'workingDays'): void {
    this.activeFilter = this.activeFilter === filter ? null : filter;
  }

  closeFilter(): void {
    this.activeFilter = null;
  }

  selectDoctor(id: number): void {
    this.newServiceHour.doctorId = id;
    this.closeFilter();
  }

  selectAvailability(type: string): void {
    this.newServiceHour.availabilityType = type as ServiceHours['availabilityType'];
    this.closeFilter();
  }

  selectSchedule(mode: ServiceHours['scheduleMode']): void {
    this.newServiceHour.scheduleMode = mode;
    if (mode === 'WEEKLY') {
      this.newServiceHour.dayOfWeek = '';
      this.newServiceHour.date = '';
    }
    this.closeFilter();
  }

  selectWorkingDays(days: ServiceHours['workingDays']): void {
    this.newServiceHour.workingDays = days;
    this.closeFilter();
  }

  selectWeekday(day: string): void {
    this.newServiceHour.dayOfWeek = day;
    this.closeFilter();
  }

  getSelectedDoctorLabel(): string {
    return this.newServiceHour.doctorId
      ? this.doctorService.doctors().find(doctor => doctor.id === this.newServiceHour.doctorId)?.name || 'Médico não encontrado'
      : 'Selecione um médico';
  }

  getSelectedAvailabilityLabel(): string {
    return this.newServiceHour.availabilityType
      ? this.getAvailabilityLabel(this.newServiceHour.availabilityType)
      : 'Selecione o tipo';
  }

  getSelectedScheduleLabel(): string {
    return this.newServiceHour.scheduleMode
      ? this.getScheduleModeLabel(this.newServiceHour.scheduleMode)
      : 'Selecione a configuração';
  }

  getSelectedWorkingDaysLabel(): string {
    return this.getWorkingDaysLabel(this.newServiceHour.workingDays);
  }

  getSelectedWeekdayLabel(): string {
    return this.newServiceHour.dayOfWeek
      ? this.getWeekDayName(this.newServiceHour.dayOfWeek)
      : 'Selecione o dia';
  }

  getCalendarTitle(): string {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    return `${months[this.calendarMonth.getMonth()]} ${this.calendarMonth.getFullYear()}`;
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

  isCurrentMonth(day: Date): boolean {
    return day.getMonth() === this.calendarMonth.getMonth()
      && day.getFullYear() === this.calendarMonth.getFullYear();
  }

  goToPreviousMonth(): void {
    this.calendarMonth = new Date(
      this.calendarMonth.getFullYear(),
      this.calendarMonth.getMonth() - 1,
      1
    );
  }

  goToNextMonth(): void {
    this.calendarMonth = new Date(
      this.calendarMonth.getFullYear(),
      this.calendarMonth.getMonth() + 1,
      1
    );
  }

  goToToday(): void {
    const today = new Date();
    this.calendarMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  }

  getDayCode(day: Date): string {
    return ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][day.getDay()];
  }

  getAvailabilityForDay(day: Date): ServiceHours[] {
    const date = this.toDateKey(day);
    const dayCode = this.getDayCode(day);

    return this.serviceHours.filter(item => {
      const matchesDoctor = !this.selectedDoctorId || item.doctorId === this.selectedDoctorId;
      const matchesDate = item.scheduleMode === 'SPECIFIC'
        ? item.date === date
        : item.scheduleMode === 'SINGLE_DAY'
          ? item.dayOfWeek === dayCode
          : true;
      return matchesDoctor && matchesDate;
    });
  }

  getAppointmentsForDay(day: Date): Appointment[] {
    const date = this.toDateKey(day);
    return this.appointmentService.appointments().filter(item =>
      item.appointment_date === date
      && (!this.selectedDoctorId || item.doctor_id === this.selectedDoctorId)
    );
  }

  toDateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  deleteServiceHour(id: number): void {

    if (confirm('Deseja realmente excluir este horário de atendimento?')) {

      this.serviceHours = this.serviceHours.filter(
        item => item.id !== id
      );

    }

  }

}