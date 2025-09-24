// authservice.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
   providedIn: 'root' 
})
export class AuthserviceService {
  private baseUrl = 'http://localhost:8080/api/auth';
  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());



  constructor(private http: HttpClient) {}

  getAuthStatus(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  getToken(): string | null {
  return localStorage.getItem('token');
}


  signup(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, userData);
  }

  signin(loginData: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/signin`, loginData).pipe(
    tap((response: any) => {
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role); // <-- ajouter ici
        this.authStatus.next(true);
      }
    })
  );
}

signupEncadrant(nom: string, prenom: string, email: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/signup-encadrant`, null, {
    params: { nom, prenom, email }
  });
}


getCurrentUser(): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any>(`${this.baseUrl}/me`, { headers });
}


getUserRole(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch (e) {
    console.error('Erreur de décodage du token', e);
    return null;
  }
}



  logout(): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<void>(`${this.baseUrl}/logout`, {}, { headers }).pipe(
      tap(() => {
        localStorage.removeItem('token');
        this.authStatus.next(false);
      })
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserInfo(): { nom: string; prenom: string; role: string } | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      nom: payload.nom || '',
      prenom: payload.prenom || '',
      role: payload.role || ''
    };
  } catch (e) {
    console.error('Erreur de décodage du token', e);
    return null;
  }
}

  
}