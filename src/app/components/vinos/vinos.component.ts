// components/vinos/vinos.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';  // Importar HttpClientModule para standalone
import { CommonModule } from '@angular/common';
import { VinosService } from '../../services/vinos.service';  // Importar el servicio
import { Vinos } from '../../models/vinos.model';  // Importar el modelo

@Component({
  selector: 'app-vinos',
  templateUrl: './vinos.component.html',
  styleUrls: ['./vinos.component.css'],
  standalone: true,  // El componente es standalone
  imports: [CommonModule, HttpClientModule]  // Importar HttpClientModule
})
export class VinosComponent implements OnInit {
  vinos: Vinos[] = [];  // Array para almacenar la lista de vinos

  constructor(private vinosService: VinosService) {}

  ngOnInit(): void {
    // Llamar al servicio para obtener la lista de vinos
    this.vinosService.getVinos().subscribe((data: Vinos[]) => {
      this.vinos = data;
      console.log('Lista de vinos:', this.vinos);  // Verificar en la consola si los datos se obtienen correctamente
    });
  }

  toggleHabilitacion(index: number): void {
    const vino = this.vinos[index];
    
    // Alternar el valor de habilitado
    const nuevoEstado = !vino.habilitado;
  
    // Llamar al servicio para actualizar el estado en la base de datos
    this.vinosService.toggleHabilitacion(vino._id!, nuevoEstado).subscribe(
      (actualizado: Vinos) => {
        // Actualizar el usuario en el array del frontend
        this.vinos[index].habilitado = nuevoEstado;
        console.log(`Usuario ${actualizado.name} actualizado: habilitado=${actualizado.habilitado}`);
      },
      (error) => {
        console.error('Error al cambiar el estado de habilitación:', error);
      }
    );
  }
}

