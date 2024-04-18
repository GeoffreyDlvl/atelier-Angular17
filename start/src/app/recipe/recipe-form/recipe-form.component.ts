import {Component, DestroyRef, Input, OnInit, inject, signal} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
  ReactiveFormsModule,
  FormGroup, FormControl, FormArray
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {Ingredient, Recipe, RecipeType, RecipeV1, RecipeV2, UnitOfMeasurement} from '../models/recipe';
import { RecipeService } from '../services/recipe.service';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatStepper, MatStep, MatStepLabel, MatStepContent, MatStepperNext, MatStepperPrevious } from '@angular/material/stepper';


export function enumValidator(enumType: any): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value && !Object.values(enumType).includes(control.value)) {
      return { 'invalidEnumValue': { value: control.value } };
    }
    return null;
  };
}

type IngredientsForm = FormGroup<{
  quantity: FormControl<number>;
  unit: FormControl<UnitOfMeasurement>;
  name: FormControl<string>;
}>;

type InstructionForm = FormControl<string>;

@Component({
    selector: 'app-recipe-form',
    templateUrl: './recipe-form.component.html',
    styleUrl: './recipe-form.component.css',
    standalone: true,
    imports: [ReactiveFormsModule, MatStepper, MatStep, MatStepLabel, MatStepContent, MatFormField, MatLabel, MatInput, MatSelect, MatOption, MatButton, MatStepperNext, MatIcon, MatStepperPrevious, RouterLink]
})
export class RecipeFormComponent implements OnInit {
  @Input() recipe?: Recipe;

  private recipeService = inject(RecipeService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  public formGroup = new FormGroup({
    id: new FormControl<number | null>(null),
    name: new FormControl('', {
      validators: [Validators.required, Validators.min(3)],
      nonNullable: true
    }),
    photo: new FormControl('', { nonNullable: true }),
    type: new FormControl<RecipeType>(RecipeType.None, {
      validators: [Validators.required, enumValidator(RecipeType)],
      nonNullable: true
    }),
    ingredients: new FormArray<IngredientsForm>([]),
    instructions: new FormArray<InstructionForm>([]),
    version: new FormControl<'v2'>('v2', { nonNullable: true })
  });

  recipeTypes:Array<string> = Object.values(RecipeType);
  unitOfMeasure:Array<string> = Object.values(UnitOfMeasurement);

  ngOnInit(): void {
    if (!this.recipe || this.recipe.version !== 'v2') return;
    this.recipe.ingredients.forEach(() => this.addIngredient());
    this.formGroup.patchValue(this.recipe);
  }

  get ingredientsForm() {
    return this.formGroup.controls.ingredients
    // return this.formGroup.get('ingredients') as FormArray;
  }

  addIngredient(): void {
    this.ingredientsForm.push(new FormGroup({
      quantity: new FormControl(0, {nonNullable: true}),
      name: new FormControl('', {nonNullable: true}),
      unit: new FormControl<UnitOfMeasurement>(UnitOfMeasurement.None, {nonNullable: true})
    },));
  }

  removeIngredientAt(index: number) : void {
    this.ingredientsForm.removeAt(index);
  }

  get instructionsForm() {
    return this.formGroup.controls.instructions;
    // return this.formGroup.get('instructions') as UntypedFormArray;
  }

  addInstruction(): void {
    this.instructionsForm.push(new FormControl('', { nonNullable: true }));
  }

  removeInstructiontAt(index: number) : void {
    this.instructionsForm.removeAt(index);
  }

  saveRecipe() {
    if (this.formGroup.invalid) return;

    const recipe = this.formGroup.getRawValue();

    let obs;
    if (!recipe) return;
    if (!!recipe.id)
      obs = this.recipeService.update(recipe.id, recipe);
    else
      obs = this.recipeService.create(recipe);

      obs.pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => {
        this.router.navigateByUrl('/recipes');
      })
  }
}
