import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PokedexEntryComponent } from './components/pokedex-entry/pokedex-entry.component';
import { PokedexComponent } from './components/pokedex/pokedex.component';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';
import { EmptyLayoutComponent } from './layouts/empty-layout/empty-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: EmptyLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      }
    ]
  },
  {
    path: 'pokedex',
    component: DefaultLayoutComponent,
    children: [
      {
        path: '',
        component: PokedexComponent,
      },
      {
        path: ':id',
        component: PokedexEntryComponent,
      }
    ]
  },
];
