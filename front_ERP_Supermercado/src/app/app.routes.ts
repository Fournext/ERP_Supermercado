import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsuarioComponent } from './dashboard/usuario/usuario.component';
import { PagesComponent } from './pages/pages.component';
import { UsuarioListComponent } from './dashboard/usuario-list/usuario-list.component';
import path from 'path';
import { TableComponent } from './dashboard/usuario/roles/table/table.component';
import { CreateComponent } from './dashboard/usuario/roles/create/create.component';

export const routes: Routes = [
    {path: '', redirectTo: 'login',pathMatch:'full'},

    {path: 'login',component: LoginComponent},

    {path: 'usuario', component: UsuarioComponent},
    {path: 'dashboard', component:PagesComponent},
    {path: 'usuario-list', component: UsuarioListComponent},
    {path: 'roles/listar', component: TableComponent},
    {path: 'roles/crear', component: CreateComponent}

]