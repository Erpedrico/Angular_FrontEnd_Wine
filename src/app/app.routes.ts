import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UsuarisComponent } from './components/usuaris/usuaris.component';
import { ExperienciaComponent } from './components/experiencia/experiencia.component';
import { HomeComponent } from './components/home/home.component';
import { VinosComponent } from './components/vinos/vinos.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/auth.guard'; // Importa el guard

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirige a Home por defecto
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'usuaris', component: UsuarisComponent, canActivate: [AuthGuard] },
  { path: 'experiencia', component: ExperienciaComponent, canActivate: [AuthGuard] },
  { path: 'vinos', component: VinosComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' } // Redirige cualquier ruta desconocida al login
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })], // Activar el modo hash para evitar problemas con el enrutado
  exports: [RouterModule]
})
export class AppRoutingModule {}


