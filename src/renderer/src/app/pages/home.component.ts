import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <!-- Bouton Admin positionné en haut à droite -->
    <button 
      (click)="goAdmin()" 
      style="position: absolute; top: 20px; right: 20px; padding: 10px 15px; font-weight: bold; cursor: pointer; background: #ddd; border: 1px solid #aaa; border-radius: 5px;">
      Admin
    </button>

    <div style="text-align: center; margin-top: 80px;">
      <h2>Créer un profil ou se connecter</h2>
      
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <input 
          type="text" 
          formControlName="pseudo" 
          placeholder="Entrez votre pseudo"
          style="padding: 10px; font-size: 16px; margin-right: 10px;"
        >
        <button 
          type="submit" 
          [disabled]="loginForm.invalid"
          style="padding: 10px 20px; font-size: 16px; cursor: pointer;">
          Jouer !
        </button>
      </form>
      
      @if (loginForm.get('pseudo')?.invalid && loginForm.get('pseudo')?.touched) {
        <p style="color: red;">Le pseudo est obligatoire (min 3 lettres).</p>
      }

      <hr style="margin: 30px auto; max-width: 300px;">
      
      <button (click)="viewUsers()" style="padding: 10px 20px; font-size: 14px; cursor: pointer; background-color: #f0f0f0; border: 1px solid #ccc;">
        Voir la liste des utilisateurs
      </button>
    </div>
  `
})
export class HomeComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  dbService = inject(DatabaseService);

  loginForm = this.fb.group({
    pseudo: ['', [Validators.required, Validators.minLength(3)]]
  });

  async onSubmit() {
    if (this.loginForm.valid) {
      const pseudo = this.loginForm.value.pseudo!;
      const user = await this.dbService.login(pseudo);
      
      if (user) {
        this.router.navigate(['/game']);
      }
    }
  }

  viewUsers() {
    this.router.navigate(['/users']);
  }

  goAdmin() {
    this.router.navigate(['/admin']);
  }
}