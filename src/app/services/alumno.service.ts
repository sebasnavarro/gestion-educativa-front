import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlumnoModel } from '../models/alumno.model';
import { map, catchError, tap, delay, switchAll } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ControlService {

  constructor(private http: HttpClient, private router: Router) { }

  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})
  
  private isNoAutorizado(e): boolean{
    if(e.status==401 || e.status==403){
      this.router.navigate(['/login'])
      return true;
    }
    return false;
  }

  crearAlumno(alumno: AlumnoModel) {
    return this.http.post(`${environment.url}/alumnos`, alumno).pipe(
      map((resp: any) => {
        alumno.id = resp.alumno.id;
        console.log(alumno);
        return alumno;
      }),
      catchError(e =>{

        if(this.isNoAutorizado(e)){
          return throwError(e);
        }

        if(e.status == 400){
          return throwError(e);
        }
        console.error(e.error.mensaje);
        return throwError(e);
        

      })
    );

  }

  actualizarAlumno(alumno: AlumnoModel) {
    return this.http.put(`${environment.url}/alumnos/${alumno.id}`, alumno).pipe(
    catchError(e =>{
      if(this.isNoAutorizado(e)){
        return throwError(e);
      }
    }));
  }

  borrarAlumno(id: string) {
    return this.http.delete(`${environment.url}/alumnos/${id}`).pipe(
    catchError(e =>{
      if(this.isNoAutorizado(e)){
        return throwError(e);
      }
    }));
  }

  listarAlumnos(page: number): Observable<any> {
    return this.http.get(`${environment.url}/alumnos/page/` + page).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      }),
      tap((response: any) => {
        (response.content as AlumnoModel[]);
      }));
  }
}
