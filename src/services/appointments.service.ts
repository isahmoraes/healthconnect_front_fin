import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { Appointment } from '../models/Appointment';
import { environment } from '../environments/environment.development';



@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private http = inject(HttpClient);

  private api= `${environment.apiUrl}/specialties`;

  // State Signals
  appointments = signal<Appointment[]>([
    {
      id: '1',
      patientId: 'pat-1',
      doctorId: 'doc-1',
      specialtyId: 'spec-1',
      dateTime: new Date().toISOString(),
      status: 'CONFIRMADO',
      observations: 'Routine appointment'
    }
  ]);

  loading = signal<boolean>(false);

  list(): Observable<Appointment[]> {

    this.loading.set(true);

    return this.http.get<Appointment[]>(this.api).pipe(

      tap({
        next: (data) => {

          if (data && data.length > 0) {
            this.appointments.set(data);
          }

          this.loading.set(false);

        }
      }),

      catchError((error) => {

        console.warn('Backend unavailable. Keeping local data.', error);

        this.loading.set(false);

        return of(this.appointments());

      })

    );

  }

  create(appointment: Partial<Appointment>): Observable<Appointment> {

    const newAppointment: Appointment = {

      id: Date.now().toString(),

      patientId: appointment.patientId || '',

      doctorId: appointment.doctorId || '',

      specialtyId: appointment.specialtyId || '',

      dateTime: appointment.dateTime || new Date().toISOString(),

      status: 'PENDENTE',

      observations: appointment.observations || ''

    };

    return this.http.post<Appointment>(this.api, appointment).pipe(

      tap((created) => {

        this.appointments.update(list => [...list, created]);

      }),

      catchError(() => {

        // Local fallback
        this.appointments.update(list => [...list, newAppointment]);

        return of(newAppointment);

      })

    );

  }

  updateStatus(
    id: string,
    status: Appointment['status']
  ): Observable<Appointment | null> {

    return this.http.patch<Appointment>(
      `${this.api}/${id}`,
      { status }
    ).pipe(

      tap(() => {

        this.appointments.update(list =>
          list.map(item =>
            item.id === id
              ? { ...item, status }
              : item
          )
        );

      }),

      catchError(() => {

        this.appointments.update(list =>
          list.map(item =>
            item.id === id
              ? { ...item, status }
              : item
          )
        );

        return of(null);

      })

    );

  }

  delete(id: string): Observable<void | null> {

    return this.http.delete<void>(`${this.api}/${id}`).pipe(

      tap(() => {

        this.appointments.update(list =>
          list.filter(item => item.id !== id)
        );

      }),

      catchError(() => {

        this.appointments.update(list =>
          list.filter(item => item.id !== id)
        );

        return of(null);

      })

    );

  }

}