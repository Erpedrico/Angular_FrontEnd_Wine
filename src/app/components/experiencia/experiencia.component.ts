import { Component, OnInit } from '@angular/core';
import { ExperienciaService } from '../../services/experiencia.service';
import { Experiencia } from '../../models/experiencia.model';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { pageInterface } from '../../models/paginacion.model';

@Component({
  selector: 'app-experiencia',
  templateUrl: './experiencia.component.html',
  standalone: true,
  styleUrls: ['./experiencia.component.css'],
  imports: [FormsModule, CommonModule, HttpClientModule, TruncatePipe]
})
export class ExperienciaComponent implements OnInit {
  experiencias: Experiencia[] = []; // Lista de experiencias
  users: User[] = []; // Lista de usuarios para los desplegables
  selectedParticipants: string[] = []; // Participantes seleccionados como ObjectId
  successMessage: string = '';
  errorMessage: string = '';// Variable para mostrar mensajes de error
  username: string = '';
  usernamesofparticipants: string[] = [];
  ownerFilter: undefined | string = '';
  isModalVisible: boolean = false;

  nuevapaginacion: pageInterface = {
    paginas: 1,
    numerodecaracterespp: 5
  };

  // Estructura inicial para una nueva experiencia
  newExperience: Experiencia = {
    owner: '',
    participants: [''],
    description: '',
    habilitado: true
  };

  newExperience2: Experiencia = {
    owner: '',
    participants: [''],
    description: '',
    habilitado: true
  };

  constructor(private experienciaService: ExperienciaService, private userService: UserService) { }

  filterExperiencias = '';

  ngOnInit(): void {
    this.getExperiencias(); // Obtener la lista de experiencias
    this.getUsers(); // Obtener la lista de usuarios

  }

  // Obtener la lista de experiencias desde la API
  getExperiencias(): void {
    this.experienciaService.getExperiencias().subscribe(
      (data: Experiencia[]) => {
        // Filtrar experiencias que tengan _id definido
        this.experiencias = data.filter(exp => exp._id !== undefined);
      },
      (error) => {
        console.error('Error al obtener las experiencias:', error);
      }
    );
  }

  getExperienciasFiltradas(ownerF: string | undefined): void {
    if (ownerF == '') {
      this.experienciaService.getExperiencias().subscribe(
        (data: Experiencia[]) => {
          // Filtrar experiencias que tengan _id definido
          this.experiencias = data.filter(exp => exp._id !== undefined);
          console.log('Experiencias recibidas:', data);
        },
        (error) => {
          console.error('Error al obtener las experiencias:', error);
        }
      );
    } else {
      this.experienciaService.getExperiencias().subscribe(
        (data: Experiencia[]) => {
          // Filtrar experiencias que tengan _id definido
          this.experiencias = data.filter(exp => exp._id !== undefined && exp.owner == ownerF);
          console.log('Experiencias recibidas:', data);
        },
        (error) => {
          console.error('Error al obtener las experiencias:', error);
        }
      );
    }
  }

  // Obtener la lista de usuarios desde la API
  getUsers(): void {
    this.userService.getUsers(this.nuevapaginacion).subscribe(
      (data: User[]) => {
        this.users = data;
        console.log('Usuarios recibidos:', data);
      },
      (error) => {
        console.error('Error al obtener los usuarios:', error);
      }
    );
  }

  onFilter(): void {
    this.ownerFilter = this.newExperience2.owner;
    console.log('filtrao', this.newExperience2.owner);
    this.getExperienciasFiltradas(this.ownerFilter);
    this.newExperience = {
      owner: '',
      participants: [''],
      description: '',
      habilitado: true
    };
  }

  elFilter(): void {
    this.ownerFilter = '';
    this.getExperienciasFiltradas(this.ownerFilter);
  }

  // Obtener el nombre de un usuario dado su ObjectId
  getUserNameById(participantes: User): string | null {
    const user = participantes.name;
    return user ? user : 'Desconocido';
  }

  getNameByOwner(participantes: User): string | null {
    const user = participantes.name;
    return user ? user : 'Desconocido';
  }

  // Manejar el envío del formulario con validación de campos
  onSubmit(): void {

    this.errorMessage = ''; // Limpiar mensajes de error
    this.successMessage = '';
    // Verificar si los campos están vacíos
    if (!this.newExperience.owner || !this.newExperience.description) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    // Buscar usuario por nombre y crear experiencia si existe
    this.userService.getUserByName(this.newExperience.owner).subscribe(
      (userId: string | null) => { // Cambiado a string | null
        if (userId) {  // Verificar si userId no es nulo
          this.experienciaService.addExperiencia(this.newExperience).subscribe(
            (response) => {
              this.successMessage = 'Experiencia creada correctamente.';
              this.getExperiencias(); // Actualizar la lista de experiencias después de crear una nueva
              this.resetForm(); // Limpiar el formulario
            },
            (error) => {
              this.errorMessage = 'Error al crear la experiencia.';
            }
          );
        } else {
          console.log(userId);
          this.errorMessage = 'No existe ningún usuario con ese nombre.';
        }
      },
      (error) => {
        this.errorMessage = 'Error al buscar el usuario.';
      }
    );

  }

  // Método para eliminar una experiencia por su ID
  deleteExperience(experienceId: string): void {
    this.experienciaService.deleteExperiencia(experienceId).subscribe(
      () => {
        console.log(`Experiencia con ID ${experienceId} eliminada`);
        this.getExperiencias(); // Actualizar la lista de experiencias después de la eliminación
      },
      (error) => {
        console.error('Error al eliminar la experiencia:', error);
      }
    );
    this.isModalVisible = false;
  }

  // Resetear el formulario después de crear una experiencia
  resetForm(): void {
    this.newExperience = {
      owner: '',
      participants: [''],
      description: '',
      habilitado: true
    };
    this.errorMessage = ''; // Limpiar el mensaje de error
  }

  toggleHabilitacion(index: number): void {
    const experiencia = this.experiencias[index];

    // Alternar el valor de habilitado
    const nuevoEstado = !experiencia.habilitado;

    // Llamar al servicio para actualizar el estado en la base de datos
    this.experienciaService.toggleHabilitacion(experiencia._id!, nuevoEstado).subscribe(
      (actualizado: Experiencia) => {
        // Actualizar el usuario en el array del frontend
        this.experiencias[index].habilitado = nuevoEstado;
      },
      (error) => {
        console.error('Error al cambiar el estado de habilitación:', error);
      }
    );
  }

  showModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }
}
