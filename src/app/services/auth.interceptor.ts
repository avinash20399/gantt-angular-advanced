import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor() {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // Get the token from localStorage
        //const token = localStorage.getItem('access_token');
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Y2NlYTBmYjZkMDFiMDU5OWUwZjFkNDciLCJmdWxsTmFtZSI6IktUZXJuIEFkbWluIDEiLCJlbWFpbCI6Imt0ZXJuaW5kaWFAZ21haWwuY29tIiwib3JnSUQiOiI1YzU0OTVhMTFjOWQ0NDAwMDA4YTFjZTIiLCJzdWJzY3JpcHRpb24iOnsiQ29kZUdlbmllIjpbIjY1MjNhNjY0MDNhYzRlODExYzE4ZDhhYiIsIjY2MzAwY2VlMjMwMDY2NTZhNjE3ZjM2NiIsIjY3MTczZDMxMTdlZWUzNDE5NDg3NTA4MyJdfSwiaWF0IjoxNzQ3OTM1MjI0LCJleHAiOjE3NDc5NjQwMjR9.k0zKAp06LQQUYvRJAEY_RTEdL3L4IybCLPhAADfV5CY";

        // Clone the request and add the authorization header if token exists
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }

        // Handle the response
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // Handle unauthorized error (token expired or invalid)
                    // You might want to redirect to login or refresh token
                    console.error('Unauthorized access:', error);
                    // Clear the token if it's invalid
                    localStorage.removeItem('access_token');
                    // You can add your redirect logic here
                }
                return throwError(() => error);
            })
        );
    }
}
