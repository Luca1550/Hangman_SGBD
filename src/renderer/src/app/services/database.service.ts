import { Injectable, signal } from '@angular/core';

// 1. On explique à TypeScript que notre Preload a ajouté "electronAPI" à l'objet window
declare global {
  interface Window {
    electronAPI: {
      getCategories: () => Promise<any[]>;
    }
  }
}

// 2. On crée le Service Angular
@Injectable({
  providedIn: 'root' // (Exigence validée : Singleton injecté à la racine)
})
export class DatabaseService {
  
  // 3. On utilise un Signal pour stocker nos catégories (Exigence validée !)
  categories = signal<any[]>([]);

  constructor() { }

  // 4. La fonction qui va appeler notre backend (Electron -> Prisma)
  async loadCategories() {
    try {
      // On passe par le pont sécurisé !
      const data = await window.electronAPI.getCategories();
      
      // On met à jour notre Signal avec les données reçues
      this.categories.set(data);
      console.log("Catégories chargées dans Angular :", data);
    } catch (error) {
      console.error("Erreur de communication avec Electron :", error);
    }
  }
}
