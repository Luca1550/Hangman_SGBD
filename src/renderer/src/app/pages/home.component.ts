import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule], // Exigence PDF : ReactiveFormsModule
  template: `
    <div style="text-align: center; margin-top: 50px;">
      <h2>Créer un profil ou se connecter</h2>
      
      <!-- Exigence PDF : Formulaire Réactif -->
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
    </div>
  `
})
export class HomeComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  dbService = inject(DatabaseService);

  // Création du formulaire avec validation
  loginForm = this.fb.group({
    pseudo: ['', [Validators.required, Validators.minLength(3)]]
  });

  async onSubmit() {
    if (this.loginForm.valid) {
      const pseudo = this.loginForm.value.pseudo!;
      // On sauvegarde dans la DB locale via notre service
      const user = await this.dbService.login(pseudo);
      
      if (user) {
        // Exigence PDF : Routage (Navigation vers la page de jeu)
        this.router.navigate(['/game']);
      }
    }
  }
}
