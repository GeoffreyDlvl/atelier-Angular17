import {Component, Input} from '@angular/core';
import { Recipe } from '../models/recipe';
import { IdeasComponent } from '../ideas/ideas.component';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'app-recipe-list',
    templateUrl: './recipe-list.component.html',
    styleUrl: './recipe-list.component.css',
    standalone: true,
    imports: [NgFor, RouterLink, MatButton, NgIf, MatIcon, IdeasComponent]
})
export class RecipeListComponent {
  @Input() recipes?: Recipe[];

  displayIdeas = false;
}
