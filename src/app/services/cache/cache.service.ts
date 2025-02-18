import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, any>();

  constructor(
    private http: HttpClient
  ) { }

  get(url: string): Observable<any> {
    if (this.cache.has(url)) {
      return of(this.cache.get(url));
    }

    return this.http.get(url).pipe(
      tap((data) => this.cache.set(url, data))
    );
  }
}
