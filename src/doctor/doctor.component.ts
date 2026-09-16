import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';





import { DoctorService } from '../services/doctor.service';
import { SpecialtyService } from '../services/specialty.service';
import { Doctor } from '../models/Doctor';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorsComponent implements OnInit {

  doctorService = inject(DoctorService);
  specialtyService = inject(SpecialtyService);

  showForm = signal(false);
  editingDoctorId: number | null = null;

  newDoctor: Partial<Doctor> = {
    name: '',
    crm: '',
    specialtyId: 0,
    email: ''
  };

  ngOnInit(): void {

    this.doctorService.list().subscribe();

    this.specialtyService.getAll().subscribe();

  }

  toggleForm(): void {

    this.editingDoctorId = null;
    this.showForm.update(value => !value);

  }

  saveDoctor(): void {

    if (!this.newDoctor.name || !this.newDoctor.crm) {

      alert('Preencha todos os campos obrigatórios.');

      return;

    }

    const request = this.editingDoctorId === null
      ? this.doctorService.create(this.newDoctor)
      : this.doctorService.update(this.editingDoctorId, this.newDoctor);

    request.subscribe(() => {

      this.showForm.set(false);
      this.editingDoctorId = null;

      this.newDoctor = {
        name: '',
        crm: '',
        specialtyId: 0,
        email: ''
      };

    });

  }

  editDoctor(doctor: Doctor): void {
    this.editingDoctorId = doctor.id;
    this.newDoctor = { ...doctor };
    this.showForm.set(true);
  }

}