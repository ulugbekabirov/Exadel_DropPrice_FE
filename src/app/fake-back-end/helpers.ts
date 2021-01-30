import { HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

export function error(errors: any): any {
  return of(
    new HttpResponse({
      status: 200,
      body: {
        state: 'error',
        errors
      }
    })
  );
}

export function ok<T>(data?: T): any {
  return of(
    new HttpResponse({
      status: 200,
      body: data
    })
  );
}

export function sendJSON(data: any): any {
  return of(
    new HttpResponse({
      status: 200,
      body: JSON.stringify(data)
    })
  );
}

export function checkUrl(request: HttpRequest<any>, path: string): any {
  return request.url.endsWith(path);
}
