// src/app/api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api/calculate'; // kendi API adresin

  constructor(private http: HttpClient) {}

  calculate(expression: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer senin_tokenin_buraya' // eğer gerekiyorsa
    });

    return this.http.post<any>(this.apiUrl, { expression }, { headers });
  }
}
