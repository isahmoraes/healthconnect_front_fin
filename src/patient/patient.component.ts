import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../services/patient.service';
import { Patient } from '../models/Patient';


@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientsComponent implements OnInit {

  patientService = inject(PatientService);

  showForm = signal(false);
  editingPatientId: number | null = null;

  newPatient: Partial<Patient> = {
    name: '',
    cpf: '',
    phone: '',
    email: ''
  };

  ngOnInit(): void {

    this.patientService.list().subscribe();

  }

  toggleForm(): void {

    this.editingPatientId = null;
    this.showForm.update(value => !value);

  }

  savePatient(): void {

    if (!this.newPatient.name || !this.newPatient.cpf) {

      alert('Preencha todos os campos obrigatórios.');

      return;

    }

    const request = this.editingPatientId === null
      ? this.patientService.create(this.newPatient)
      : this.patientService.update(this.editingPatientId, this.newPatient);

    request.subscribe(() => {

      this.showForm.set(false);
      this.editingPatientId = null;

      this.newPatient = {
        name: '',
        cpf: '',
        phone: '',
        email: ''
      };

    });

  }

  editPatient(patient: Patient): void {

    this.editingPatientId = patient.id;
    this.newPatient = { ...patient };

    this.showForm.set(true);

  }
}