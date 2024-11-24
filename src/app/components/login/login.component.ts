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

  constructor( public userService: UserService, public authService: AuthService) {}

  // Modificar el formulario para usar 'username' en lugar de 'email'
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),  // Se elimina 'Validators.email' porque ya no es necesario
    password: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    this.token = this.authService.getToken();
    console.log('token', this.token);
    if (this.token) {
      this.loggedIn = true;
    }
  }

  login() {
    if (this.loginForm.value.username && this.loginForm.value.password) {
      console.log('username', this.loginForm.value.username);
      console.log('password', this.loginForm.value.password);

      // Llamamos al servicio con 'username' en lugar de 'email'
      this.userService.loginUser(this.loginForm.value.username, this.loginForm.value.password).subscribe((data) => {
        console.log('Respuesta completa:', data);  // Verifica la estructura completa de 'data'
        const token = data.token;  // Asegúrate de que 'data' tenga un campo 'token'
        console.log('Token:', token);  // Esto debería mostrar el JWT
        this.authService.setToken(token);  // Guarda solo el token
        this.authService.setUserId(data._id);
        this.authService.setUserName(data.name);
        this.loggedIn = true;
      });
    }
  }

  logout() {
    this.authService.logout();
    this.loggedIn = false;
  }
}
