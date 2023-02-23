import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class InvigilatorInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // Clone the request to add the new header
        const token = sessionStorage.getItem('Token');
        const clonedRequest = req.clone({ headers: req.headers.set('authToken', token == null?'':token) });

        // Pass the cloned request instead of the original request to the next handle
        return next.handle(clonedRequest);
    }
}