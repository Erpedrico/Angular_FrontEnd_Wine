import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';  // Import FormsModule y NgForm para manejar el formulario
import { User } from '../../models/user.model'; // Importar el modelo User desde la subcarpeta services
import { ExperienciaService } from '../../services/experiencia.service';
import { Experiencia } from '../../models/experiencia.model';
import { UserService } from '../../services/user.service'; // Importar el servicio UserService desde la subcarpeta services
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { MaskEmailPipe } from '../../pipes/maskEmail.pipe';
import { pageInterface } from '../../models/paginacion.model';


@Component({
  selector: 'app-usuaris',
  templateUrl: './usuaris.component.html',
  styleUrls: ['./usuaris.component.css'],
  standalone: true,  // Esto convierte el componente en independiente
  imports: [CommonModule, FormsModule, TruncatePipe, MaskEmailPipe]  // Importar CommonModule y FormsModule

})
export class UsuarisComponent implements OnInit {
  experiencias: Experiencia[] = []; // Lista de experiencias
  usuarios: User[] = []; // Lista de usuarios con tipado User
  desplegado: boolean[] = []; // Controla si el desplegable de cada usuario está abierto o cerrado
  desplegarBiografia: boolean[] = [];
  mostrarPassword: boolean[] = []; // Array para controlar la visibilidad de la contraseña
  formularioVisible: boolean = false;
  isModalVisible: boolean = false;
  longituddepaginas: number = 10;
  numeroPP: number = 5;
  resuelto: boolean = false;
  newPage: pageInterface = {
    paginas: 0,
    numerodecaracterespp: 5
  };


  nuevoUsuario: User = {
    name: '',
    mail: '', // Añadir el campo email
    password: '',
    comment: '',
    habilitado: true
  };

  confirmarPassword: string = ''; // Campo para confirmar la contraseña
  usuarioEdicion: User | null = null; // Usuario en proceso de edición
  indiceEdicion: number | null = null; // Almacena el índice del usuario en edición
  formSubmitted: boolean = false; // Indica si se ha enviado el formulario

  constructor(private experienciaService: ExperienciaService, private userService: UserService) {}

  //Para las paginas
  pages: number[] = Array.from({ length: this.longituddepaginas }, (_, i) => i + 1);

  // Un array de arrays para almacenar los datos por página
  pageContents: string[][] = [
    [''],
    [''],
    [''],
    [''],
    [''],
    [''],
    [''],
    [''],
    [''],
    ['']
  ];

  // Índice de la página actualmente seleccionada
  currentPage: number = 1;

  ngOnInit(): void {
    // Cargar usuarios desde el UserService
    this.getUsers();
    this.getExperiencias();
    this.calculPage();
  }

  mostrarFormulario() {
    this.formularioVisible = true;
    this.indiceEdicion = null;
    this.nuevoUsuario = {
      name: '',
      mail: '', // Limpiar el campo email
      password: '',
      comment: '',
      habilitado: true
    };
    this.confirmarPassword = ''; // Reiniciar el campo de confirmar contraseña
    this.formSubmitted = false; // Restablecer el estado del formulario para no mostrar errores
  }

  // Método para cerrar el formulario
  cerrarFormulario() {
    this.formularioVisible = false;
  }

  
  // Función para cambiar la página cuando se hace clic en un número
  changePage(page: number): void {
    this.currentPage = page;
    this.newPage.paginas = page - 1;
    this.getUsers();
  }

  calculPage(): void {
    this.currentPage=1;
    this.userService.getUsers(this.newPage).subscribe(
      (data: User[]) => {
        if (data.length < this.newPage.numerodecaracterespp) {
          // Si recibimos menos de 5 usuarios, asumimos que es la última página
          this.resuelto = true;
          this.longituddepaginas = this.newPage.paginas + 1;
          this.pages = Array.from({ length: this.longituddepaginas }, (_, i) => i + 1);
        } else {
          // Incrementar la página y hacer la llamada recursivamente
          this.newPage.paginas = this.newPage.paginas + 1;
          console.log(this.newPage.paginas);
          // Llamada recursiva para obtener la siguiente página
          this.calculPage();
        }
      },
      (error) => {
        console.error('Error al obtener los usuarios:', error);
      }
    );
  }

  async changeNumUsers():Promise<void>{
    console.log('Número de usuarios ingresado:', this.newPage);
    this.newPage.numerodecaracterespp = this.numeroPP;
    this.newPage.paginas = 0;
    this.currentPage = 1;
    await console.log('Número de usuarios ingresado:', this.newPage);
    await this.getUsers();
    await this.calculPage();
  }

  getUsers(): void {
    this.userService.getUsers(this.newPage).subscribe(
      (data: User[]) => {
        this.usuarios = data;
        console.log('Usuarios recibidos:', data.length);
      },
      (error) => {
        console.error('Error al obtener los usuarios:', error);
      }
    );
  }

  // Obtener la lista de experiencias desde la API
  getExperiencias(): void {
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
  }

  // Función para agregar o modificar un usuario
  agregarElemento(userForm: NgForm): void {
    console.log('va');
    this.formSubmitted = true;
  
    // Verificar si las contraseñas coinciden
    if (this.nuevoUsuario.password !== this.confirmarPassword) {
      alert('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.');
      return;
    }
  
    if (this.indiceEdicion !== null) {
      // Estamos en modo edición, modificar el usuario existente
      this.usuarios[this.indiceEdicion] = { ...this.nuevoUsuario, _id: this.usuarios[this.indiceEdicion]._id };
  
      // Actualizar el usuario en la API
      this.userService.updateUser(this.usuarios[this.indiceEdicion]).subscribe(response => {
        console.log('Usuario actualizado:', response);
      });
  
      // Limpiar el estado de edición
      this.indiceEdicion = null;
    } else {
      // Modo agregar nuevo usuario
      const usuarioJSON: User = {
        name: this.nuevoUsuario.name,
        mail: this.nuevoUsuario.mail,
        password: this.nuevoUsuario.password,
        comment: this.nuevoUsuario.comment,
        habilitado: this.nuevoUsuario.habilitado
      };
  
      // Enviar el usuario a la API a través del UserService
      this.userService.addUser(usuarioJSON).subscribe(response => {
        console.log('Usuario agregado:', response);
        
        // Agregar el usuario con el _id generado por la API al array de usuarios en el frontend
        this.usuarios.push({ ...usuarioJSON, _id: response._id });
        this.desplegado.push(false); // Añadir un nuevo estado de desplegado
      });
    }
  
    // Limpiar los campos del formulario y restablecer su estado
    this.indiceEdicion = null;
    this.resetForm(userForm);
    this.cerrarFormulario();
  }
  

  // Función para limpiar el formulario
  resetForm(userForm: NgForm): void { // Aceptar userForm como parámetro
    this.nuevoUsuario = {
      name: '',
      mail: '', // Limpiar el campo email
      password: '',
      comment: '',
      habilitado: true
    };
    this.confirmarPassword = ''; // Reiniciar el campo de confirmar contraseña
    this.formSubmitted = false; // Restablecer el estado del formulario para no mostrar errores
    userForm.resetForm(); // Reiniciar el formulario en la vista
  }

  // Función para preparar la edición de un usuario
  prepararEdicion(usuario: User, index: number): void {
    console.log('Va1')
    this.formularioVisible = true;  
    this.usuarioEdicion = { ...usuario }; // Clonar el usuario para la edición
    console.log('Va2',this.usuarioEdicion);
    this.nuevoUsuario = { ...usuario }; // Cargar los datos del usuario en el formulario
    console.log('Va3',this.nuevoUsuario);
    this.indiceEdicion = index; // Almacenar el índice del usuario en edición
    console.log('Va4',this.indiceEdicion);
    this.desplegado[index] = true; // Abrir el desplegable del usuario que se está editando
  }

  // Función para eliminar un usuario usando el _id
  eliminarElemento(index: number): void {
    const usuarioAEliminar = this.usuarios[index];
  
    if (!usuarioAEliminar._id) {
      console.error('El usuario no tiene un _id válido. No se puede eliminar.');
      alert('El usuario no se puede eliminar porque no está registrado en la base de datos.');
      return;
    }
  
    
      // Eliminar a través del UserService usando el _id como identificador
      this.userService.deleteUserById(usuarioAEliminar._id).subscribe(
        response => {
          console.log('Usuario eliminado:', response);
          this.usuarios.splice(index, 1);
          this.desplegado.splice(index, 1);
        },
        error => {
          console.error('Error al eliminar el usuario:', error);
          alert('Error al eliminar el usuario. Por favor, inténtalo de nuevo.');
        }
      );
      this.isModalVisible = false;
  }
  

  // Función para alternar la visualización del desplegable
  toggleDesplegable(index: number): void {
    this.desplegado[index] = !this.desplegado[index];
  }

  // Método para alternar entre mostrar más o menos texto
  toggleBiografia(index: number) {
    // Cambia el estado entre desplegado y no desplegado
    this.desplegarBiografia[index] = !this.desplegarBiografia[index];
  }

  // Función para alternar la visibilidad de la contraseña
  togglePassword(index: number): void {
    this.mostrarPassword[index] = !this.mostrarPassword[index]; // Cambiamos entre true y false
  }

  getExpNameById(experienciesId: string): string|null {
    const experiencies = this.experiencias.find((u) => u._id === experienciesId);
    return experiencies ? experiencies.description : 'Desconocido';
  }
  
  toggleHabilitacion(index: number): void {
    const usuario = this.usuarios[index];
    
    // Alternar el valor de habilitado
    const nuevoEstado = !usuario.habilitado;
  
    // Llamar al servicio para actualizar el estado en la base de datos
    this.userService.toggleHabilitacion(usuario._id!, nuevoEstado).subscribe(
      (actualizado: User) => {
        // Actualizar el usuario en el array del frontend
        this.usuarios[index].habilitado = nuevoEstado;
        console.log(`Usuario ${actualizado.name} actualizado: habilitado=${actualizado.habilitado}`);
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


