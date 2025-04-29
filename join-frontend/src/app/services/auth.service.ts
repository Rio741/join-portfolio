import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  private apiUrl = 'http://127.0.0.1:8000/api/auth/';

  private loggedIn: boolean = false;

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  setLoggedIn(status: boolean): void {
    this.loggedIn = status;
    sessionStorage.setItem('loggedIn', JSON.stringify(status));
  }

  register(username: string, email: string, password: string, repeated_password: string): Observable<any> {
    const url = `${this.apiUrl}registration/`;
    return this.http.post<any>(url, { username, email, password, repeated_password });
  }

  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}login/`;
    const payload = { email, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(url, payload, { headers });
  }

  logout(): void {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('loggedIn');
    this.loggedIn = false;
    this.router.navigate(['/login']);
  }

  setToken(token: string): void {
    sessionStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return sessionStorage.getItem('access_token');
  }

  initializeLoggedInStatus(): void {
    const storedStatus = sessionStorage.getItem('loggedIn');
    const storedToken = sessionStorage.getItem('access_token');

    if (storedStatus === 'true' && storedToken) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
  }

  checkLoginStatus(): void {
    this.initializeLoggedInStatus();
  }

  guestLogin(): Observable<any> {
    const url = `${this.apiUrl}guest-login/`;
    return this.http.post<any>(url, {});
  }

  saveGuestUserData(token: string): void {
    const userData = {
      token: token,
      username: 'Guest',
      email: 'guest@example.com',
    };
    sessionStorage.setItem('user_data', JSON.stringify(userData));
    this.setLoggedIn(true);
    this.setToken(token);
  }
}
