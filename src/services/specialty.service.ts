import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
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

  getById(id: number): Observable<Specialty | null> {

    return this.http.get<Specialty>(`${this.api}/find_by_id/${id}`).pipe(

      tap((specialty) => {
        if (specialty) {
          this.specialties.update(list =>
            list.some(item => item.id === id)
              ? list.map(item => item.id === id ? specialty : item)
              : [...list, specialty]
          );
        }
      }),

      catchError(() => of(this.specialties().find(specialty => specialty.id === id) ?? null))

    );

  }

  create(specialty: Partial<Specialty>): Observable<Specialty> {

    return this.http.post<Specialty>(`${this.api}/create/`, specialty).pipe(
      tap(newSpecialty =>
        this.specialties.update(list => [...list, newSpecialty])
      )
    );

  }

  update(id: number, specialty: Partial<Specialty>): Observable<Specialty> {

    return this.http.patch<Specialty>(`${this.api}/update_by_id/${id}`, specialty).pipe(

      tap((updated) => {
        this.specialties.update(list =>
          list.map(item => item.id === id ? updated : item)
        );
      })

    );

  }

  delete(id: number): Observable<void> {

    return this.http.delete<void>(`${this.api}/delete/${id}`).pipe(
      tap(() =>
        this.specialties.update(list =>
          list.filter(specialty => specialty.id !== id)
        )
      )
    );

  }

}