import { Component, OnInit, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { Router } from '@angular/router';
import { Category, Word, Difficulty } from '../../models/types';

@Component({
  selector: 'app-admin-words',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-words.component.html',
  styleUrl: './admin-words.component.css'
})
export class AdminWordsComponent implements OnInit {
  dbService = inject(DatabaseService);
  router = inject(Router);
  fb = inject(FormBuilder);
  
  words = signal<Word[]>([]);
  categories = signal<Category[]>([]);
  difficulties = signal<Difficulty[]>([]);
  
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
    this.categories.set(await (window as any).electronAPI.getCategories()); // On peut appeler directement l'API aussi
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

  editWord(word: Word) {
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
