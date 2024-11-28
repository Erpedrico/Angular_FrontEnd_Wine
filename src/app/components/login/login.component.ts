import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']  // Corrige 'styleUrl' a 'styleUrls'
})
export class LoginComponent {
  token: string | null = null;
  loggedIn: boolean = false;
    loginError: string | null = null; // Para manejar errores de login


  constructor( public userService: UserService, public authService: AuthService) {}

  // Modificar el formulario para usar 'username' en lugar de 'email'
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),  // Se elimina 'Validators.email' porque ya no es necesario
    password: new FormControl('', [Validators.required])
  });

  // Al iniciar el componente, verifica si el usuario ya está logueado
  ngOnInit(): void {
    this.token = this.authService.getToken();  // Verifica si hay un token guardado
    console.log('token', this.token);
    if (this.token) {
      this.loggedIn = true;  // Si existe token, el usuario está logueado
    }
  }

  login() {
    if (this.loginForm.value.username && this.loginForm.value.password) {
      console.log('username', this.loginForm.value.username);
      console.log('password', this.loginForm.value.password);
  
      // Llamamos al servicio para hacer el login
      this.userService.loginUser(this.loginForm.value.username, this.loginForm.value.password).subscribe((data) => {
        // Verifica la estructura completa de 'data' (debe contener 'user' y 'token')
        console.log('Respuesta completa del backend:', data);
  
        // Verifica que 'data' tiene un objeto 'user'
        if (data && data.user) {
          console.log('user:', data.user);
          console.log('user._id:', data.user._id); // Verifica que '_id' no sea undefined
          console.log('user.name:', data.user.name); // Verifica que 'name' no sea undefined
          console.log('user.username:', data.user.username); // Verifica que 'username' no sea undefined
  
          // Verifica si los campos del usuario son válidos (no son undefined)
          if (data.user._id !== undefined && data.user.name !== undefined && data.user.username !== undefined) {
            this.authService.setUserId(data.user._id);
            this.authService.setUserName(data.user.name);
            this.authService.setUserUsername(data.user.username);
          } else {
            console.error('Algunos campos del usuario están undefined.');
          }
        } else {
          console.error('El campo "user" está vacío o no existe en la respuesta.');
        }
  
        const token = data.token;  // Asegúrate de que 'data' tenga un campo 'token'
        console.log('Token:', token);
        this.authService.setToken(token);  // Guarda el token en el AuthService
  
        this.loggedIn = true;
      }, (error) => {
        console.error('Error en la solicitud de login:', error);
      });
    }
  }
  
  

  // Método para cerrar sesión
  logout() {
    this.authService.logout();  // Elimina los datos del usuario y token
    this.loggedIn = false;  // Marca que el usuario ha cerrado sesión
    this.loginForm.reset();  // Resetea el formulario
  }
}
