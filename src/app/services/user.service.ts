import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { pageInterface } from '../models/paginacion.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = "http://localhost:3000/api/user";  // Usar apiUrl desde environment
  token: string | null = null;
  newURL: string = '';
  constructor(private http: HttpClient, private authService:AuthService) {}

  getToken(){
    return this.authService.getToken();
  }

  getHeaders(){
    this.token = this.getToken();
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', this.token || '');
    return headers;
  }

  getUsers(paginacion: pageInterface): Observable<User[]> {
    // Obtener los headers con el token
    const headers = this.getHeaders();
  
    // Hacer la solicitud POST con el token en los headers
    return this.http.post<User[]>(`${this.apiUrl}/all`, paginacion, { headers });
  }
  

  // Agregar un nuevo usuario
  addUser(usuario: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, usuario);
  }

  // Actualizar un usuario existente
  updateUser(usuario: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${usuario._id}`, usuario, { headers: this.getHeaders() });
  }

  // Eliminar un usuario por su _id
  deleteUserById(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  //Habilitar o deshabilitar un usuario
  toggleHabilitacion(id: string, habilitado: boolean): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/habilitacion`, { habilitado }, { headers: this.getHeaders() });
  }

  
  loginUser(mail:string, password:string) {// we need to complete the function
    return this.http.post<any>(this.apiUrl+'/logIn',{mail, password});
  }
}


