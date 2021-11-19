import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/usuarios/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Route } from '@angular/compiler/src/core';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public authService : AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  logout():void{
    let user =this.authService.usuario.nombres;
    this.authService.logout();
    Swal.fire('Logout',`Hola ${user}, has cerrado sesión con éxito!`)
    this.router.navigate(['/login']);
  }

}
