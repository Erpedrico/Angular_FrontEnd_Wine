import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vinos } from '../models/vinos.model';

@Injectable({
  providedIn: 'root'
})
export class VinosService {

  private apiUrl = 'http://localhost:3000/api/wine';

  constructor(private http: HttpClient) {}

  //Obtener todos los vinos
  getVinos(): Observable<Vinos[]> {
    return this.http.get<Vinos[]>(this.apiUrl);
  }

  // Agregar un nuevo vino
   addVino(vino: Vinos): Observable<Vinos> {
    return this.http.post<Vinos>(this.apiUrl, vino);
  }

  // Eliminar un vino por su _id
  deleteVinoById(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  //Habilitar o deshabilitar un vino
  toggleHabilitacion(id: string, habilitado: boolean): Observable<Vinos> {
    return this.http.patch<Vinos>(`${this.apiUrl}/${id}/habilitacion`, { habilitado });
  }
}
