import { Component, inject } from '@angular/core';
import { ShoppingService } from '../recipe/services/shopping.service';
import {MatToolbar} from "@angular/material/toolbar";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MatBadge} from "@angular/material/badge";
import {AsyncPipe} from "@angular/common";
import {MatButton} from "@angular/material/button";
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true,
  imports: [
    MatToolbar,
    RouterLinkActive,
    MatBadge,
    AsyncPipe,
    MatButton,
    RouterLink
  ]
})
export class HeaderComponent {
  protected recipeSelected = inject(ShoppingService).recipesSelected;
}
