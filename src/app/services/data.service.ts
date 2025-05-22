import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    private apiUrl = environment.apiUrl;
    
    constructor(private http: HttpClient) {
        console.log("apiurl:", this.apiUrl);
    }

    // GET request
    get<T>(endpoint: string, params?: any): Observable<T> {
        console.log("endpoint:", endpoint);
        console.log("params:", params);
        
        // Remove any leading slashes from endpoint and trailing slashes from apiUrl
        const cleanEndpoint = endpoint.replace(/^\/+/, '');
        const cleanApiUrl = this.apiUrl.replace(/\/+$/, '');
        
        const httpParams = new HttpParams({ fromObject: params || {} });
        const fullUrl = `${cleanApiUrl}/${cleanEndpoint}`;
        
        console.log("Full URL before request:", fullUrl);
        console.log("HTTP Params:", httpParams.toString());
        
        return this.http.get<T>(fullUrl, {
            params: httpParams,
        });
    }

    // POST request
    post<T>(endpoint: string, data: any): Observable<T> {
        return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data);
    }

    // PUT request
    put<T>(endpoint: string, data: any): Observable<T> {
        return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data);
    }

    // DELETE request
    delete<T>(endpoint: string): Observable<T> {
        return this.http.delete<T>(`${this.apiUrl}/${endpoint}`);
    }

    // PATCH request
    patch<T>(endpoint: string, data: any): Observable<T> {
        return this.http.patch<T>(`${this.apiUrl}/${endpoint}`, data);
    }

    // Method to set custom headers
    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            // Add any other default headers here
        });
    }
}
