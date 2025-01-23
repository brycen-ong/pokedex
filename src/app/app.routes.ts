import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      }
    ]
  }
];
