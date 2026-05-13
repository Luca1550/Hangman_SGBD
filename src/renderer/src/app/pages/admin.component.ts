import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  template: `
    <div style="padding: 20px; text-align: center; max-width: 600px; margin: 0 auto;">
      <h2 style="color: darkred;">Tableau de bord Administrateur</h2>
      
      <div style="margin: 40px auto; display: flex; flex-direction: column; gap: 20px;">
        
        <button 
          (click)="goManageUsers()" 
          style="padding: 15px 30px; font-size: 18px; cursor: pointer; background-color: #f0f0f0; border: 1px solid #aaa; border-radius: 8px;">
          👥 Gérer les utilisateurs
        </button>

        <!-- Placeholders pour vos futures fonctionnalités -->
        <button disabled style="padding: 15px 30px; font-size: 18px; cursor: not-allowed; background-color: #eee; border: 1px dashed #ccc; color: gray; border-radius: 8px;">
          📚 Gérer les mots (À venir)
        </button>
        
        <button disabled style="padding: 15px 30px; font-size: 18px; cursor: not-allowed; background-color: #eee; border: 1px dashed #ccc; color: gray; border-radius: 8px;">
          🏆 Gérer les succès (À venir)
        </button>

      </div>

      <button (click)="goHome()" style="padding: 10px 20px; cursor: pointer; margin-top: 40px;">
        Retour à l'accueil
      </button>
    </div>
  `
})
export class AdminComponent {
  router = inject(Router);

  goManageUsers() {
    this.router.navigate(['/admin/users']);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
