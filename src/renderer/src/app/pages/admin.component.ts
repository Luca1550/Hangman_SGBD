import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  template: `
    <button (click)="goHome()" style="position: absolute; top: 20px; left: 20px; padding: 10px 15px; font-weight: bold; cursor: pointer; background: #ddd; border: 1px solid #aaa; border-radius: 5px;">
      ⬅ Retour
    </button>

    <div style="padding: 20px; text-align: center; max-width: 600px; margin: 40px auto 0;">
      <h2 style="color: darkred;">Tableau de bord Administrateur</h2>
      
      <div style="margin: 40px auto; display: flex; flex-direction: column; gap: 20px;">
        
        <button 
          (click)="goManageUsers()" 
          style="padding: 15px 30px; font-size: 18px; cursor: pointer; background-color: #f0f0f0; border: 1px solid #aaa; border-radius: 8px;">
          👥 Gérer les utilisateurs
        </button>

        <button 
          (click)="goManageWords()" 
          style="padding: 15px 30px; font-size: 18px; cursor: pointer; background-color: #f0f0f0; border: 1px solid #aaa; border-radius: 8px;">
          📚 Gérer les mots
        </button>

      </div>
    </div>
  `
})
export class AdminComponent {
  router = inject(Router);

  goManageUsers() {
    this.router.navigate(['/admin/users']);
  }

  goManageWords() {
    this.router.navigate(['/admin/words']);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
