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
  editingSpecialtyId: number | null = null;

  newSpecialty: Partial<Specialty> = {
    name: '',
    description: ''
  };

  ngOnInit(): void {
    this.specialtyService.getAll().subscribe();
  }

  toggleForm(): void {
    this.editingSpecialtyId = null;
    this.showForm.update(value => !value);
  }

  saveSpecialty(): void {

    if (!this.newSpecialty.name) {
      alert('Digite o nome da especialidade.');
      return;
    }

    const request = this.editingSpecialtyId === null
      ? this.specialtyService.create(this.newSpecialty)
      : this.specialtyService.update(this.editingSpecialtyId, this.newSpecialty);

    request.subscribe(() => {

      this.showForm.set(false);
      this.editingSpecialtyId = null;

      this.newSpecialty = {
        name: '',
        description: ''
      };

    });

  }

  editSpecialty(specialty: Specialty): void {
    this.editingSpecialtyId = specialty.id;
    this.newSpecialty = { ...specialty };
    this.showForm.set(true);
  }

  removeSpecialty(id: number): void {

    if (confirm('Deseja excluir esta especialidade?')) {
      this.specialtyService.delete(id).subscribe();
    }

  }

}