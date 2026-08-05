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

    this.showForm.update(value => !value);

  }

  savePatient(): void {

    if (!this.newPatient.name || !this.newPatient.cpf) {

      alert('Please fill in all required fields.');

      return;

    }

    this.patientService.create(this.newPatient).subscribe(() => {

      this.showForm.set(false);

      this.newPatient = {
        name: '',
        cpf: '',
        phone: '',
        email: ''
      };

    });

  }

  editPatient(patient: Patient): void {

    this.newPatient = { ...patient };

    this.showForm.set(true);

  }
}