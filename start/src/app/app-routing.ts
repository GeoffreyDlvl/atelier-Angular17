import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'recipes', loadChildren: () => import('./recipe/recipe-routing')
  },
  {
    path: '', redirectTo: '/recipes', pathMatch: 'full'
  }
];
