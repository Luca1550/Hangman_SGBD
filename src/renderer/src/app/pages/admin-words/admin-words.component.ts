import { Component, OnInit, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { DictionaryService } from '../../services/dictionary.service';
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
  dictionaryService = inject(DictionaryService);
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
    this.words.set(await this.dictionaryService.getWords());
    this.categories.set(await this.dictionaryService.getCategories()); 
    this.difficulties.set(await this.dictionaryService.getDifficulties());
  }

  async saveNewCategory() {
    if (this.newCategoryCtrl.invalid) return;
    const name = this.newCategoryCtrl.value!; 
    
    const newCat = await this.dictionaryService.addCategory(name);
    if (newCat) {
      await this.refreshData(); 
      this.wordForm.patchValue({ categoryId: newCat.id }); 
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
      const result = await this.dictionaryService.deleteCategory(categoryId);
      
      if (result.success) {
        this.wordForm.patchValue({ categoryId: '' }); 
        this.refreshData();
      } else {
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
      await this.dictionaryService.updateWord({ id: this.editingWordId, ...data });
    } else {
      await this.dictionaryService.addWord(data);
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
      await this.dictionaryService.deleteWord(id);
      this.refreshData();
    }
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
}
