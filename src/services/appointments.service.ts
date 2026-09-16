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

  private api= `${environment.apiUrl}/appointments`;


  appointments = signal<Appointment[]>([]);
  loading = signal<boolean>(false);

  list(): Observable<Appointment[]> {

    

    return this.http.get<Appointment[]>(`${this.api}/all/`).pipe(
      tap(data => this.appointments.set(data))
    );

    
  }

 

  create(appointment: Partial<Appointment>): Observable<Appointment> {

    const newAppointment: Appointment = {

      id: Date.now(),

      patient_id: appointment.patient_id ?? 0,


      doctor_id: appointment.doctor_id ?? 0,

      specialty_id: appointment.specialty_id ?? 0,

      appointment_date: appointment.appointment_date || new Date().toISOString().slice(0, 10),

      time: appointment.time || '00:00',

      status: 'pending',

      is_recurrence: appointment.is_recurrence ?? false,

      obs: appointment.obs || ''

    };

    return this.http.post<Appointment>(`${this.api}/create`, appointment).pipe(

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

  update(id: number, appointment: Partial<Appointment>): Observable<Appointment> {

    return this.http.patch<Appointment>(`${this.api}/update_by_id/${id}`, appointment).pipe(

      tap((updated) => {
        this.appointments.update(list =>
          list.map(item => item.id === id ? updated : item)
        );
      })

    );

  }

  updateStatus(
    id: number,
    status: Appointment['status']
  ): Observable<Appointment | null> {

    return this.http.patch<Appointment>(
      `${this.api}/update_by_id/${id}`,
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

  delete(id: number): Observable<void | null> {

    return this.http.delete<void>(`${this.api}/delete/${id}`).pipe(

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