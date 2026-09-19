import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { DoctorSchedule } from '../models/DoctorSchedule';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DoctorScheduleService {
  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/doctor_schedule`;

  doctorSchedules = signal<DoctorSchedule[]>([]);

  list(): Observable<DoctorSchedule[]> {
    return this.http.get<DoctorSchedule[]>(`${this.api}/all/`).pipe(
      tap((data) => {
        if (data && data.length > 0) {
          this.doctorSchedules.set(data);
        }
      }),
      catchError(() => of(this.doctorSchedules()))
    );
  }

  getById(id: number): Observable<DoctorSchedule | null> {
    return this.http.get<DoctorSchedule>(`${this.api}/find_by_id/${id}`).pipe(
      tap((doctorSchedule) => {
        if (doctorSchedule) {
          this.doctorSchedules.update(list =>
            list.some(item => item.id === id)
              ? list.map(item => item.id === id ? doctorSchedule : item)
              : [...list, doctorSchedule]
          );
        }
      }),
      catchError(() => of(this.doctorSchedules().find(item => item.id === id) ?? null))
    );
  }

  create(doctorSchedule: Partial<DoctorSchedule>): Observable<DoctorSchedule> {
    const newDoctorSchedule: DoctorSchedule = {
      id: Date.now(),
      doctor_id: doctorSchedule.doctor_id ?? 0,
      day_of_week: doctorSchedule.day_of_week || '',
      start_time: doctorSchedule.start_time || '00:00',
      end_time: doctorSchedule.end_time || '00:00'
    };

    return this.http.post<DoctorSchedule>(`${this.api}/create`, doctorSchedule).pipe(
      tap((created) => {
        this.doctorSchedules.update(list => [...list, created]);
      }),
      catchError(() => {
        this.doctorSchedules.update(list => [...list, newDoctorSchedule]);
        return of(newDoctorSchedule);
      })
    );
  }

  update(id: number, doctorSchedule: Partial<DoctorSchedule>): Observable<DoctorSchedule> {
    return this.http.patch<DoctorSchedule>(`${this.api}/update_by_id/${id}`, doctorSchedule).pipe(
      tap((updated) => {
        this.doctorSchedules.update(list =>
          list.map(item => item.id === id ? updated : item)
        );
      })
    );
  }

  delete(id: number): Observable<void | null> {
    return this.http.delete<void>(`${this.api}/delete/${id}`).pipe(
      tap(() => {
        this.doctorSchedules.update(list => list.filter(item => item.id !== id));
      }),
      catchError(() => {
        this.doctorSchedules.update(list => list.filter(item => item.id !== id));
        return of(null);
      })
    );
  }
}
