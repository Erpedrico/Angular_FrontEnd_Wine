import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { pageInterface } from '../models/paginacion.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = "http://localhost:3000/api/user";  // Usar apiUrl desde environment

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios sin paginación
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/all`);  // Utiliza GET sin enviar paginación
  }
  
  // Obtener usuarios con paginación
  getUsers(paginacion: pageInterface): Observable<User[]> {
    return this.http.post<User[]>(`${this.apiUrl}/paginated`, paginacion);
  }


  // Agregar un nuevo usuario
  addUser(usuario: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, usuario);
  }

  // Actualizar un usuario existente
  updateUser(usuario: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${usuario._id}`, usuario);
  }

  // Eliminar un usuario por su _id
  deleteUserById(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  
}


