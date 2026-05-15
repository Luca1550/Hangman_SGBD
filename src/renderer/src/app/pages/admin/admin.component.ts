import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
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
