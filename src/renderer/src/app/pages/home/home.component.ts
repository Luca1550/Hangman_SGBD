import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
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
