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

  newDoctor: Partial<Doctor> = {
    name: '',
    crm: '',
    specialtyId: '',
    email: ''
  };

  ngOnInit(): void {

    this.doctorService.list().subscribe();

    this.specialtyService.getAll().subscribe();

  }

  toggleForm(): void {

    this.showForm.update(value => !value);

  }

  saveDoctor(): void {

    if (!this.newDoctor.name || !this.newDoctor.crm) {

      alert('Please fill in all required fields.');

      return;

    }

    this.doctorService.create(this.newDoctor).subscribe(() => {

      this.showForm.set(false);

      this.newDoctor = {
        name: '',
        crm: '',
        specialtyId: '',
        email: ''
      };

    });

  }

}