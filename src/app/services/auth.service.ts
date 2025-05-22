import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    login(credentials: {
        username: string;
        password: string;
    }): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
            tap((response: any) => {
                if (response && response.token) {
                    this.setToken(response.token);
                }
            })
        );
    }

    logout(): void {
        localStorage.removeItem('access_token');
    }

    refreshToken(): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/refresh`, {}).pipe(
            tap((response: any) => {
                if (response && response.token) {
                    this.setToken(response.token);
                }
            })
        );
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    private setToken(token: string): void {
        localStorage.setItem('access_token', token);
    }
}
