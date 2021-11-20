import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlumnoModel } from '../models/alumno.model';
import { map, catchError, tap, delay, switchAll } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  constructor(private http: HttpClient, private router: Router,
  private authService: AuthService){}

  private agregarAutorizationHeader(){
    let token = this.authService.token;
    if(token != null){
      return this.httpHeaders.append('Authorization', 'Bearer '+token);
    }
    return this.httpHeaders;
  }

  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})
  
  private isNoAutorizado(e): boolean{
    if(e.status==401){
      this.router.navigate(['/login']);
      return true;
    }

    if(e.status==403){
      this.router.navigate(['/home']);
      Swal.fire('Acceso denegado', `Hola ${this.authService.usuario.nombres} no tienes acceso a este recurso`,'warning');
      return true;
    }

    return false;
  }

  crearAlumno(alumno: AlumnoModel) {
    return this.http.post(`${environment.url}/alumnos`, alumno, { headers : this.agregarAutorizationHeader()}).pipe(
      map((resp: any) => {
        alumno.id = resp.alumno.id;
        console.log(alumno);
        return resp.alumno;
      }),
      catchError(e =>{

        if(this.isNoAutorizado(e)){
          return throwError(e);
        }

        if(e.status == 400){
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error,'error');
        return throwError(e);
        

      })
    );

  }

  actualizarAlumno(alumno: AlumnoModel) {
    return this.http.put(`${environment.url}/alumnos/${alumno.id}`, alumno, { headers : this.agregarAutorizationHeader()}).pipe(
      map((resp: any) => {
        alumno.id = resp.alumno.id;
        console.log(alumno);
        return resp.alumno;
      }),
      catchError(e =>{
      if(this.isNoAutorizado(e)){
        return throwError(e);
      }
    }));
  }

  borrarAlumno(id: string) {
    return this.http.delete(`${environment.url}/alumnos/${id}`, { headers : this.agregarAutorizationHeader()}).pipe(
    catchError(e =>{
      if(this.isNoAutorizado(e)){
        return throwError(e);
      }
    }));
  }

  obtenerAlumno(id: string) {
    return this.http.get(`${environment.url}/alumnos/${id}`, { headers : this.agregarAutorizationHeader()});
  }

  listarAlumnos(page: number): Observable<any> {
    return this.http.get(`${environment.url}/alumnos/page/` + page, { headers : this.agregarAutorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      }),
      tap((response: any) => {
        (response.content as AlumnoModel[]);
      }));
  }
}
