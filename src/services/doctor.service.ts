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
      id: 'doc-1',
      name: 'Carlos Eduardo',
      crm: '123456/SP',
      specialtyId: 'spec-1',
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

  create(doctor: Partial<Doctor>): Observable<Doctor> {

    const newDoctor: Doctor = {

      id: Date.now().toString(),

      name: doctor.name || '',

      crm: doctor.crm || '',

      specialtyId: doctor.specialtyId || '',

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

}