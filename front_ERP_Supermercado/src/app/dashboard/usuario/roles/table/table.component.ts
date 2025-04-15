import { Component } from '@angular/core';
import { Rol } from '../../../../models/rol.model';
import { ServiceService } from '../service/rol.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-table',
  imports: [RouterLink],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {

  rolesList: Rol[] = [];

  constructor(public rolService:ServiceService) { }
  ngOnInit(): void {
    this.obtenerRoles();
  }

  obtenerRoles(){
    this.rolService.listarRoles().subscribe({
      next: (data) => {
        this.rolesList = data;
      },
      error: (e) => {
        console.log(e);
      }
    })
  }
}
