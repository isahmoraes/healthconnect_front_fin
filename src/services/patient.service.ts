import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { Patient } from '../models/Patient';
import { environment } from '../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/patients`;

  patients = signal<Patient[]>([
    {
      id: 'pat-1',
      name: 'Ana Maria Silva',
      cpf: '123.456.789-00',
      phone: '(11) 98765-4321',
      email: 'ana.silva@email.com',
      'birthDate': '1990-05-15'
    }
  ]);

  list(): Observable<Patient[]> {

    return this.http.get<Patient[]>(`${this.api}/all/`).pipe(

      tap((data) => {

        if (data && data.length > 0) {
          this.patients.set(data);
        }

      }),

      catchError(() => of(this.patients()))

    );

  }

  create(patient: Partial<Patient>): Observable<Patient> {

    const newPatient: Patient = {

      id: Date.now().toString(),

      name: patient.name || '',

      cpf: patient.cpf || '',

      phone: patient.phone || '',

      email: patient.email || '',

      birthDate: patient.birthDate || '',

    };

    return this.http.post<Patient>(this.api, patient).pipe(

      tap((created) => {

        this.patients.update(list => [...list, created]);

      }),

      catchError(() => {

        this.patients.update(list => [...list, newPatient]);

        return of(newPatient);

      })

    );

  }

  delete(id: string): Observable<void | null> {

    return this.http.delete<void>(`${this.api}/${id}`).pipe(

      tap(() => {

        this.patients.update(list =>
          list.filter(patient => patient.id !== id)
        );

      }),

      catchError(() => {

        this.patients.update(list =>
          list.filter(patient => patient.id !== id)
        );

        return of(null);

      })

    );

  }

}