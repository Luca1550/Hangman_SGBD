import { Component, OnInit, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { Category, Word, Difficulty } from '../models/types';

@Component({
  selector: 'app-admin-words',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <button (click)="goBack()" style="position: absolute; top: 20px; left: 20px; padding: 10px 15px; font-weight: bold; cursor: pointer; background: #ddd; border: 1px solid #aaa; border-radius: 5px;">
      ⬅ Retour
    </button>

    <div style="padding: 20px; max-width: 800px; margin: 40px auto 0;">
      <h2 style="color: darkred; text-align: center;">Gestion des Mots (CRUD)</h2>
      
      <!-- Formulaire d'ajout / modification -->
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3>{{ isEditing() ? 'Modifier un mot' : 'Ajouter un nouveau mot' }}</h3>
        
        <form [formGroup]="wordForm" (ngSubmit)="onSubmit()" style="display: flex; flex-direction: column; gap: 10px;">
          
          <input type="text" formControlName="text" placeholder="Le mot (ex: BANANE)" style="padding: 8px; text-transform: uppercase;">
          <input type="text" formControlName="hint" placeholder="Indice (optionnel)" style="padding: 8px;">
          
          <div style="display: flex; gap: 10px; align-items: center;">
            @if (!isAddingCategory()) {
              <select formControlName="categoryId" style="padding: 8px; flex: 1;">
                <option value="" disabled selected>Choisir une catégorie</option>
                @for (cat of categories(); track cat.id) {
                  <option [value]="cat.id">{{ cat.name }}</option>
                }
              </select>
              
              <!-- Bouton Ajouter -->
              <button type="button" (click)="isAddingCategory.set(true)" style="padding: 8px; cursor: pointer; font-size: 16px;" title="Ajouter une nouvelle catégorie">➕</button>
              
              <!-- Bouton Supprimer -->
              @if (wordForm.get('categoryId')?.value) {
                <button type="button" (click)="deleteSelectedCategory()" style="padding: 8px; cursor: pointer; font-size: 16px; color: red;" title="Supprimer la catégorie sélectionnée">🗑️</button>
              }
            } @else {
              <input type="text" [formControl]="newCategoryCtrl" placeholder="Nouvelle catégorie" style="padding: 8px; flex: 1;">
              <button type="button" (click)="saveNewCategory()" [disabled]="newCategoryCtrl.invalid" style="padding: 8px; cursor: pointer; color: green; font-weight: bold;">✔️</button>
              <button type="button" (click)="isAddingCategory.set(false)" style="padding: 8px; cursor: pointer; color: red; font-weight: bold;">❌</button>
            }

            <select formControlName="difficultyId" style="padding: 8px; flex: 1;">
              <option value="" disabled selected>Choisir une difficulté</option>
              @for (diff of difficulties(); track diff.id) {
                <option [value]="diff.id">{{ diff.level_name }}</option>
              }
            </select>
          </div>

          <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button type="submit" [disabled]="wordForm.invalid" style="padding: 10px; cursor: pointer; flex: 1; background-color: #4CAF50; color: white; border: none; border-radius: 4px;">
              {{ isEditing() ? 'Mettre à jour' : 'Ajouter le mot' }}
            </button>
            @if (isEditing()) {
              <button type="button" (click)="cancelEdit()" style="padding: 10px; cursor: pointer; background-color: #f44336; color: white; border: none; border-radius: 4px;">
                Annuler
              </button>
            }
          </div>
        </form>
      </div>

      <!-- Liste des mots -->
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #ddd;">
            <th style="padding: 10px; border: 1px solid #ccc;">Mot</th>
            <th style="padding: 10px; border: 1px solid #ccc;">Indice</th>
            <th style="padding: 10px; border: 1px solid #ccc;">Catégorie</th>
            <th style="padding: 10px; border: 1px solid #ccc;">Difficulté</th>
            <th style="padding: 10px; border: 1px solid #ccc;">Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (word of words(); track word.id) {
            <tr>
              <td style="padding: 10px; border: 1px solid #ccc; font-weight: bold;">{{ word.text }}</td>
              <td style="padding: 10px; border: 1px solid #ccc;">{{ word.hint || '-' }}</td>
              <td style="padding: 10px; border: 1px solid #ccc;">{{ word.category.name }}</td>
              <td style="padding: 10px; border: 1px solid #ccc;">{{ word.difficulty.level_name }}</td>
              <td style="padding: 10px; border: 1px solid #ccc; text-align: center;">
                <button (click)="editWord(word)" style="cursor: pointer; margin-right: 5px;">✏️</button>
                <button (click)="deleteWord(word.id)" style="cursor: pointer; color: red;">🗑️</button>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="5" style="padding: 10px; text-align: center; border: 1px solid #ccc;">Aucun mot trouvé.</td>
            </tr>
          }
        </tbody>
      </table>

    </div>
  `
})
export class AdminWordsComponent implements OnInit {
  dbService = inject(DatabaseService);
  router = inject(Router);
  fb = inject(FormBuilder);
  
  words = signal<any[]>([]);
  categories = signal<any[]>([]);
  difficulties = signal<any[]>([]);
  
  isEditing = signal(false);
  editingWordId: number | null = null;

  isAddingCategory = signal(false);
  newCategoryCtrl = new FormControl('', [Validators.required, Validators.minLength(2)]);

  wordForm: FormGroup = this.fb.group({
    text: ['', [Validators.required, Validators.minLength(2)]],
    hint: [''],
    categoryId: ['', Validators.required],
    difficultyId: ['', Validators.required]
  });

  async ngOnInit() {
    this.refreshData();
  }

  async refreshData() {
    this.words.set(await this.dbService.getWords());
    this.categories.set(await window.electronAPI.getCategories()); // On peut appeler directement l'API aussi
    this.difficulties.set(await this.dbService.getDifficulties());
  }

  async saveNewCategory() {
    if (this.newCategoryCtrl.invalid) return;
    const name = this.newCategoryCtrl.value!; // On garde la casse d'origine
    
    const newCat = await this.dbService.addCategory(name);
    if (newCat) {
      await this.refreshData(); // Met à jour la liste des catégories
      this.wordForm.patchValue({ categoryId: newCat.id }); // Auto-sélectionne la nouvelle catégorie
      this.isAddingCategory.set(false);
      this.newCategoryCtrl.reset();
    }
  }

  async deleteSelectedCategory() {
    const categoryId = parseInt(this.wordForm.value.categoryId);
    if (!categoryId) return;

    const category = this.categories().find(c => c.id === categoryId);
    if (!category) return;

    if (confirm(`Voulez-vous vraiment supprimer la catégorie "${category.name}" ?`)) {
      const result = await this.dbService.deleteCategory(categoryId);
      
      if (result.success) {
        this.wordForm.patchValue({ categoryId: '' }); // Déselectionne la catégorie
        this.refreshData();
      } else {
        // Affiche l'erreur (ex: Contrainte de clé étrangère RESTRICT)
        alert(result.message);
      }
    }
  }

  async onSubmit() {
    if (this.wordForm.invalid) return;

    const formValue = this.wordForm.value;
    const data = {
      text: formValue.text.toUpperCase(),
      hint: formValue.hint,
      categoryId: parseInt(formValue.categoryId),
      difficultyId: parseInt(formValue.difficultyId)
    };

    if (this.isEditing()) {
      await this.dbService.updateWord({ id: this.editingWordId, ...data });
    } else {
      await this.dbService.addWord(data);
    }

    this.wordForm.reset();
    this.isEditing.set(false);
    this.editingWordId = null;
    this.refreshData();
  }

  editWord(word: any) {
    this.isEditing.set(true);
    this.editingWordId = word.id;
    this.wordForm.patchValue({
      text: word.text,
      hint: word.hint,
      categoryId: word.categoryId,
      difficultyId: word.difficultyId
    });
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.editingWordId = null;
    this.wordForm.reset();
  }

  async deleteWord(id: number) {
    if (confirm("Voulez-vous supprimer ce mot ?")) {
      await this.dbService.deleteWord(id);
      this.refreshData();
    }
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
}