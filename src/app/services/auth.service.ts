import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private id: string | null = null;
  private name: string | null = null;
  private username: string | null = null;

  constructor() {}

  // Establece el token en localStorage
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token); // Almacena el token en localStorage
  }

  // Establece el ID de usuario en localStorage
  setUserId(id: string) {
    this.id = id;
    localStorage.setItem('id', id); // Almacena el id en localStorage
  }

  // Establece el nombre de usuario en localStorage
  setUserName(name: string) {
    this.name = name;
    localStorage.setItem('name', name); // Almacena el nombre en localStorage
  }

  // Establece el username en localStorage
  setUserUsername(username: string) {
    this.username = username;
    localStorage.setItem('username', username); // Almacena el username en localStorage
  }

  // Recupera el token del localStorage
  getToken(): string | null {
    return localStorage.getItem('token'); // Devuelve el token almacenado en localStorage
  }

  // Recupera el ID de usuario del localStorage
  getUserId(): string | null {
    return localStorage.getItem('id'); // Devuelve el id almacenado en localStorage
  }

  // Recupera el nombre de usuario del localStorage
  getUserName(): string | null {
    return localStorage.getItem('name'); // Devuelve el nombre almacenado en localStorage
  }

  // Recupera el username del localStorage
  getUserUsername(): string | null {
    return localStorage.getItem('username'); // Devuelve el username almacenado en localStorage
  }

  // Verifica si el usuario está autenticado
  isLoggedIn(): boolean {
    return this.getToken() !== null; // Si existe un token, el usuario está autenticado
  }

  // Cierra sesión y elimina los datos del localStorage
  logout() {
    // Elimina los datos del localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('name');
    localStorage.removeItem('username');

    // Limpia las propiedades internas
    this.token = null;
    this.id = null;
    this.name = null;
    this.username = null;
  }
}
