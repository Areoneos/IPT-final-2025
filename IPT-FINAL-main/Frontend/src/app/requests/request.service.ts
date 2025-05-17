import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../_models/user';

interface Employee {
  id: string;
  employeeId: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class RequestService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<any[]>(`${environment.apiUrl}/requests`);
  }

  getById(id: string) {
    return this.http.get<any>(`${environment.apiUrl}/requests/${id}`);
  }

  create(request: any) {
    return this.http.post(`${environment.apiUrl}/requests`, request);
  }

  update(id: string, request: any) {
    return this.http.put(`${environment.apiUrl}/requests/${id}`, request);
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/requests/${id}`);
  }

  getEmployees() {
    return this.http.get<Employee[]>(`${environment.apiUrl}/employees`);
  }
} 