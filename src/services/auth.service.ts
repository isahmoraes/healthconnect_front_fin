import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';

import { environment } from '../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserSession {
  id: number;
  email: string;
  name: string;
  is_active: boolean;
  is_superuser: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  login(credentials: LoginRequest): Observable<UserSession> {
    return this.http.post<UserSession>(`${environment.apiUrl}/users/login`, credentials).pipe(
      tap((user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return throwError(() => new Error('Senha incorreta'));
        }

        if (error.status === 404) {
          return throwError(() => new Error('E-mail não encontrado'));
        }

        const message = error.error?.detail || 'Erro ao tentar fazer login.';
        return throwError(() => new Error(message));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): UserSession | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) as UserSession : null;
  }
}
