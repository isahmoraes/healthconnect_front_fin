import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { Doctor } from '../models/Doctor';
import { environment } from '../environments/environment.development';




@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private http = inject(HttpClient);

  private api= `${environment.apiUrl}/doctors`;

  doctors = signal<Doctor[]>([
    {
      id: 1,
      name: 'Carlos Eduardo',
      crm: '123456/SP',
      specialtyId: 1,
      email: 'carlos.eduardo@clinic.com'
    }
  ]);

  list(): Observable<Doctor[]> {

    return this.http.get<Doctor[]>(`${this.api}/all/`).pipe(

      tap((data) => {

        if (data && data.length > 0) {
          this.doctors.set(data);
        }

      }),

      catchError(() => of(this.doctors()))

    );

  }

  getById(id: number): Observable<Doctor | null> {

    return this.http.get<Doctor>(`${this.api}/find_by_id/${id}`).pipe(

      tap((doctor) => {
        if (doctor) {
          this.doctors.update(list =>
            list.some(item => item.id === id)
              ? list.map(item => item.id === id ? doctor : item)
              : [...list, doctor]
          );
        }
      }),

      catchError(() => of(this.doctors().find(doctor => doctor.id === id) ?? null))

    );

  }

  create(doctor: Partial<Doctor>): Observable<Doctor> {

    const newDoctor: Doctor = {

      id: Date.now(),

      name: doctor.name || '',

      crm: doctor.crm || '',

      specialtyId: doctor.specialtyId ?? 0,

      email: doctor.email || '',

      phone: doctor.phone || ''

    };

    return this.http.post<Doctor>(`${this.api}/create`, doctor).pipe(

      tap((created) => {

        this.doctors.update(list => [...list, created]);

      }),

      catchError(() => {

        this.doctors.update(list => [...list, newDoctor]);

        return of(newDoctor);

      })

    );

  }

  update(id: number, doctor: Partial<Doctor>): Observable<Doctor> {

    return this.http.patch<Doctor>(`${this.api}/update_by_id/${id}`, doctor).pipe(

      tap((updated) => {
        this.doctors.update(list =>
          list.map(item => item.id === id ? updated : item)
        );
      })

    );

  }

}