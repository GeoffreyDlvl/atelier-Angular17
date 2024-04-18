import {computed, Injectable, OnDestroy, Signal, signal} from '@angular/core';
import { Recipe } from '../models/recipe';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {
  private _recipesSelected = signal<Recipe[]>([]);
  private _shoppingList = computed(() => {
    let shoppingList: string[] = [];
    this._recipesSelected().forEach(recipe => {
        if (recipe.version === 'v2') {
          shoppingList = [
          ...recipe.ingredients.flatMap(
            (ingredient) =>
              ingredient.name + ' ' + ingredient.quantity + ' ' + ingredient.unit
          ),
        ];
      } else {
          shoppingList = [...recipe.ingredients];
      }
    })
    return shoppingList;
  })


  constructor() {
    const recipeSavedStr = sessionStorage.getItem('recipesSelected');
    if (!!recipeSavedStr) {
      const recipeListSaved: Recipe[] = JSON.parse(recipeSavedStr);
      recipeListSaved.forEach(recipe => {this.addSelectedRecipe(recipe)});
    }
  }

  get recipesSelected() {
    return this._recipesSelected.asReadonly();
  }

  get shoppingList(): string[] {
    return this._shoppingList();
  }

  addSelectedRecipe(recipe: Recipe): void {
    this._recipesSelected.update(recipes => [...recipes, recipe]);
    this.notify();
  }

  removeSelectedRecipe(recipe: Recipe): void {
    this._recipesSelected.update(recipes => recipes.filter(recipeSelected => recipeSelected.id !== recipe.id))
    this.notify();
  }

  clearAllRecipeSelected(): void {
    this._recipesSelected.set([]);
    this.notify();
  }

  private notify(): void {
    sessionStorage.setItem('recipesSelected', JSON.stringify(this._recipesSelected()));
  }

  // private calculateShoppingList() : void {
  //   this._shoppingList.set([]);
  //   this._recipesSelected.forEach(recipe => {
  //     if (recipe.version === 'v2') {
  //       this._shoppingList = [
  //         ...this._shoppingList,
  //         ...recipe.ingredients.flatMap(
  //           (ingredient) =>
  //             ingredient.name + ' ' + ingredient.quantity + ' ' + ingredient.unit
  //         ),
  //       ];
  //     } else {
  //       this._shoppingList = [...this._shoppingList, ...recipe.ingredients];
  //     }
  //   });
  // }
}
