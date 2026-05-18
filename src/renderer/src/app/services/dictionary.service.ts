import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { Word } from '../models/word';
import { Difficulty } from '../models/difficulty';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  
  async getWords(): Promise<Word[]> {
    return await window.electronAPI.getWords();
  }

  async addWord(data: any): Promise<Word> {
    return await window.electronAPI.addWord(data);
  }

  async updateWord(data: any): Promise<Word> {
    return await window.electronAPI.updateWord(data);
  }

  async deleteWord(id: number): Promise<boolean> {
    return await window.electronAPI.deleteWord(id);
  }

  async getDifficulties(): Promise<Difficulty[]> {
    return await window.electronAPI.getDifficulties();
  }

  async getCategories(): Promise<Category[]> {
    try {
      return await window.electronAPI.getCategories();
    } catch (error) {
      console.error("Erreur catégories :", error);
      return [];
    }
  }

  async addCategory(name: string): Promise<Category | null> {
    try {
      return await window.electronAPI.addCategory(name);
    } catch (error) {
      console.error("Erreur création catégorie :", error);
      return null;
    }
  }

  async deleteCategory(id: number): Promise<{success: boolean, message?: string}> {
    return await window.electronAPI.deleteCategory(id);
  }
}
