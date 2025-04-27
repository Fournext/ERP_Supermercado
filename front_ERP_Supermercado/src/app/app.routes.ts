import { Routes } from '@angular/router';
import { authGuard } from './business/Protection _outes/auth.guard';

export const routes: Routes = [
<<<<<<< HEAD
    {
        path: '', redirectTo: 'login',pathMatch:'full'},
    {
        path: 'login',component: LoginComponent},

    //parte de del dashboard    
    {
        path: '',
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
=======
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./business/login/login.component')
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
>>>>>>> 543aef5887f40762a7a1894f86a27d7eeace4327
];
