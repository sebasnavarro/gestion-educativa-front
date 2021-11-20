import { Component, OnInit, SimpleChanges, SystemJsNgModuleLoader } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlumnoModel } from 'src/app/models/alumno.model';
import { AlumnoService } from 'src/app/services/alumno.service';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Console } from 'console';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.component.html',
  styleUrls: ['./alumno.component.css']
})
export class AlumnoComponent implements OnInit {
  alumno = new AlumnoModel();
  id: string = this.route.snapshot.paramMap.get('id');
  errores: String[];
  response: AlumnoModel[];


  constructor(private alumnoService: AlumnoService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (this.id !== 'nuevo') {
      this.alumnoService.obtenerAlumno(this.id)
        .subscribe((resp: AlumnoModel) => {
          console.log("error al obtener cliente"+ resp);
          this.alumno = resp;
          this.alumno.id = this.id;
          this.alumno.nombres = resp.nombres;
          console.log(resp);
        })
    }
  }



  guardar(form: NgForm) {
    if (form.invalid) {
      console.log('Formulario no válido');
      return;
    }

    Swal.fire({
      icon: 'info',
      title: 'Espere',
      text: 'Guardando información',
      allowOutsideClick: false
    });
    Swal.showLoading();


    let peticion: Observable<any>;

    //Validación para ver si el usuario existe
    if (this.alumno.id) {
      peticion = this.alumnoService.actualizarAlumno(this.alumno);
    } else {
      peticion = this.alumnoService.crearAlumno(this.alumno);
    }

    peticion.subscribe( resp => {
      this.alumno = resp;
  
      Swal.fire({
        icon: 'success',
        title: 'Alumno Actualizado',
        text: 'Se actualizo correctamente',
      });
    } ,
      err => {
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    )
  }
}
