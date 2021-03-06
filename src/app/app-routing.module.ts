import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './usuarios/login.component';
import { AlumnoComponent } from './pages/alumno/alumno.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'alumno/:id', component: AlumnoComponent},
  { path: 'home/page/:page', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: '**', pathMatch: 'full', redirectTo: 'home'}
];

@NgModule({
  imports: [
    RouterModule.forRoot( routes )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
