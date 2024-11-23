import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private id: string | null = null;
  private name: string | null = null;

  constructor() {}

  setToken(token: string) {
    this.token = token;
    // Store token in localStorage for persistence
    localStorage.setItem('token', token);
  }

  setUserId(id: string) {
    this.id = id;
    // Store id in localStorage for persistence
    localStorage.setItem('id', id);
  }

  setUserName(name: string) {
    this.name = name;
    // Store name in localStorage for persistence
    localStorage.setItem('name', name);
  }

  getToken(): string | null {
    // Retrieve token from localStorage
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    // Retrieve id from localStorage
    return localStorage.getItem('id');
  }

  getUserName(): string | null {
    // Retrieve name from localStorage
    return localStorage.getItem('name');
  }

  isLoggedIn(): boolean {
    // Check if token exists
    return this.getToken() !== null;
  }

  logout() {
    // Clear token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('name');

    this.token = null;
    this.id = null;
    this.name = null;
  }
}
