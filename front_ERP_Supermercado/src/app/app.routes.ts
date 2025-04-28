import { Routes } from '@angular/router';
import { authGuard } from './business/Protection _outes/auth.guard';
import { InicioComponent } from './cliente/inicio/inicio.component';

export const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./business/login/login.component')
  },
  {
    path: 'ecommerce',
    component: InicioComponent
  },

  //parte de del dashboard
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/components/layout/layout.component'),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./business/dashboard/dashboard.component')
      },
      {
        path: 'inventory',
        loadComponent: () => import('./business/inventory/inventory.component')
      },
      {
        path: 'products',
        loadComponent: () => import('./business/products/products.component')
      },
      {
        path: 'profile',
        loadComponent: () => import('./business/profile/profile.component')
      },
      {
        path: 'user',
        loadComponent: () => import('./business/user/user.component')
      },
      {
        path: 'marcas',
        loadComponent: () => import('./business/marcas/marcas.component')
      },
      {
        path:'categorias',
        loadComponent:()=>import('./business/categoria/categoria.component')
      },
      {
        path:'bitacora',
        loadComponent:()=>import('./business/bitacora/bitacora.component')
      },
      {
        path:'roles',
        loadComponent:()=>import('./business/rol-y-permisos/rol-y-permisos.component')
      },
      {
        path:'turno',
        loadComponent:()=>import('./business/turno/turno.component')
      },
      {
        path:'almacen',
        loadComponent:()=>import('./business/almacen/almacen.component')
      },
      {
        path:'sector',
        loadComponent:()=>import('./business/sector/sector.component')
      },
      {
        path:'repisa',
        loadComponent:()=>import('./business/repisa/repisa.component')
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  //Redireccionar al Dashboard si direccionan a cualquier ruta
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
