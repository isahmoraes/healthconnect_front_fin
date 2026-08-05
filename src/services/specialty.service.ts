import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Specialty } from '../models/Specialty';
import { environment } from '../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class SpecialtyService {

  private http = inject(HttpClient);

  private api= `${environment.apiUrl}/specialties`;

  specialties = signal<Specialty[]>([]);

  getAll(): Observable<Specialty[]> {

    return this.http.get<Specialty[]>(`${this.api}/all/`).pipe(
      tap(data => this.specialties.set(data))
    );

  }

  create(specialty: Partial<Specialty>): Observable<Specialty> {

    return this.http.post<Specialty>(this.api, specialty).pipe(
      tap(newSpecialty =>
        this.specialties.update(list => [...list, newSpecialty])
      )
    );

  }

  delete(id: string): Observable<void> {

    return this.http.delete<void>(`${this.api}/${id}`).pipe(
      tap(() =>
        this.specialties.update(list =>
          list.filter(specialty => specialty.id !== id)
        )
      )
    );

  }

}