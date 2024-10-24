// components/vinos/vinos.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';  // Importar HttpClientModule para standalone
import { CommonModule } from '@angular/common';
import { VinosService } from '../../services/vinos.service';  // Importar el servicio
import { Vinos } from '../../models/vinos.model';  // Importar el modelo
import { FormsModule, NgForm } from '@angular/forms';  // Import FormsModule y NgForm para manejar el formulario

@Component({
  selector: 'app-vinos',
  templateUrl: './vinos.component.html',
  styleUrls: ['./vinos.component.css'],
  standalone: true,  // El componente es standalone
  imports: [CommonModule, HttpClientModule, FormsModule] // Importar HttpClientModule
})

export class VinosComponent implements OnInit {
  vinos: Vinos[] = [];  // Array para almacenar la lista de vinos
  isModalVisible: boolean = false;
  desplegado: boolean[] = []; // Controla si el desplegable de cada vino está abierto o cerrado
  formSubmitted: boolean = false; // Indica si se ha enviado el formulario
  formularioVisible: boolean = false;

  nuevoVino: Vinos = {
    owner: '',
    name: '',
    price: null,
    color: '',
    brand: '',
    grapetype: '',
    habilitado: true
  };

  constructor(private vinosService: VinosService) {}

  ngOnInit(): void {
    // Llamar al servicio para obtener la lista de vinos
    this.vinosService.getVinos().subscribe((data: Vinos[]) => {
      this.vinos = data;
      console.log('Lista de vinos:', this.vinos);  // Verificar en la consola si los datos se obtienen correctamente
    });
  }

  mostrarFormulario() {
    this.formularioVisible = true;
    this.nuevoVino = {
      owner: '',
      name: '',
      price: null,
      color: '',
      brand: '',
      grapetype: '',
      habilitado: true
    };
    this.formSubmitted = false; // Restablecer el estado del formulario para no mostrar errores
  }

  cerrarFormulario() {
    this.formularioVisible = false;
  }

  // Función para agregar o modificar un usuario
  agregarElemento(vinoForm: NgForm): void {
    console.log('va');
    this.formSubmitted = true;

    // Modo agregar nuevo vino
    const vinoJSON: Vinos = {
      owner: this.nuevoVino.owner,
      name: this.nuevoVino.name,
      price: this.nuevoVino.price,
      color: this.nuevoVino.color,
      brand: this.nuevoVino.brand,
      grapetype: this.nuevoVino.grapetype,
      habilitado: this.nuevoVino.habilitado
    };

    // Enviar el vino a la API a través del VinoService
    this.vinosService.addVino(vinoJSON).subscribe(response => {
      console.log('Vino agregado:', response);

      // Agregar el uvino con el _id generado por la API al array de usuarios en el frontend
      this.vinos.push({ ...vinoJSON, _id: response._id });
      this.desplegado.push(false); // Añadir un nuevo estado de desplegado
    });
  
    // Limpiar los campos del formulario y restablecer su estado

    this.resetForm(vinoForm);
    this.cerrarFormulario();
  }

  // Función para eliminar unvino usando el _id
  eliminarElemento(index: number): void {
    const vinoAEliminar = this.vinos[index];
  
    if (!vinoAEliminar._id) {
      console.error('El vino no tiene un _id válido. No se puede eliminar.');
      alert('El vino no se puede eliminar porque no está registrado en la base de datos.');
      return;
    }
      // Eliminar a través del UserService usando el _id como identificador
      this.vinosService.deleteVinoById(vinoAEliminar._id).subscribe(
        response => {
          console.log('Usuario eliminado:', response);
          this.vinos.splice(index, 1);
          this.desplegado.splice(index, 1);
        },
        error => {
          console.error('Error al eliminar el vino:', error);
          alert('Error al eliminar el vino. Por favor, inténtalo de nuevo.');
        }
      );
  }

  toggleHabilitacion(index: number): void {
    const vino = this.vinos[index];
    
    // Alternar el valor de habilitado
    const nuevoEstado = !vino.habilitado;
  
    // Llamar al servicio para actualizar el estado en la base de datos
    this.vinosService.toggleHabilitacion(vino._id!, nuevoEstado).subscribe(
      (actualizado: Vinos) => {
        // Actualizar el vino en el array del frontend
        this.vinos[index].habilitado = nuevoEstado;
        console.log(`Vino ${actualizado.name} actualizado: habilitado=${actualizado.habilitado}`);
      },
      (error) => {
        console.error('Error al cambiar el estado de habilitación:', error);
      }
    );
  }

  resetForm(vinoForm: NgForm): void { // Aceptar vinoForm como parámetro
    this.nuevoVino = {
      owner: '',
      name: '',
      price: null,
      color: '',
      brand: '',
      grapetype: '',
      habilitado: true
    };
    vinoForm.resetForm(); // Reiniciar el formulario en la vista
  }

  showModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

}

