import { Component, OnInit } from '@angular/core';
import { AlumnoModel } from 'src/app/models/alumno.model';
import { AlumnoService } from 'src/app/services/alumno.service';

import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/usuarios/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  alumno: AlumnoModel[];
  paginador: any;
  cargando = false;

  constructor(private alumnoService: AlumnoService, private activatedRoute: ActivatedRoute, public authService: AuthService) { }

  ngOnInit(): void {
    this.cargando = true;
    this.activatedRoute.paramMap.subscribe(params => {
    let page: number = +params.get('page');

    if (!page) {
      page = 0;
    }

    this.alumnoService.listarAlumnos(page)
      .pipe(
        tap(response => {
          (response.content as AlumnoModel[]);
        })
      ).subscribe(response => {
        this.alumno = response.content as AlumnoModel[];
        this.paginador = response;
        this.cargando = false;
      });
  });
  }

  borrarAlumno(alumno: AlumnoModel){
    Swal.fire({
      icon: 'question',
      title: '¿Está seguro?',
      text: 'Desea eliminar al alumno: '+alumno.nombres+' '+alumno.apellidos,
      showConfirmButton: true,
      showCancelButton: true
    }).then( result => {
      if(result.value){
        this.alumnoService.borrarAlumno(alumno.id).subscribe(
          () =>{
            this.alumno = this.alumno.filter(con => con !== alumno)
            Swal.fire(
              'El alumno: ',
               alumno.nombres+' '+alumno.apellidos + `ha sido eliminado con éxito.`,
              'success'
            )
          }
        );
      }
    });
  }


}
