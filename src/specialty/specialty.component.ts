import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpecialtyService } from '../services/specialty.service';
import { Specialty } from '../models/Specialty';


@Component({
  selector: 'app-specialty',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './specialty.component.html',
  styleUrls: ['./specialty.component.css']
})
export class SpecialtyComponent implements OnInit {

  specialtyService = inject(SpecialtyService);

  showForm = signal(false);

  newSpecialty: Partial<Specialty> = {
    name: '',
    description: ''
  };

  ngOnInit(): void {
    this.specialtyService.getAll().subscribe();
  }

  toggleForm(): void {
    this.showForm.update(value => !value);
  }

  saveSpecialty(): void {

    if (!this.newSpecialty.name) {
      alert('Please enter the specialty name.');
      return;
    }

    this.specialtyService.create(this.newSpecialty).subscribe(() => {

      this.showForm.set(false);

      this.newSpecialty = {
        name: '',
        description: ''
      };

    });

  }

  removeSpecialty(id: string): void {

    if (confirm('Do you want to delete this specialty?')) {
      this.specialtyService.delete(id).subscribe();
    }

  }

}