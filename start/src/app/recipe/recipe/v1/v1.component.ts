import { Component, Input } from '@angular/core';
import { RecipeV1 } from '../../models/recipe';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-v1',
    templateUrl: './v1.component.html',
    styleUrl: './v1.component.css',
    standalone: true,
    imports: [NgFor]
})
export class V1Component {
  @Input({required: true}) recipe!: RecipeV1;
}
