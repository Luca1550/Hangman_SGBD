import { Component, OnInit, signal, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Requis pour le pipe 'date'
import { UserHistory } from '../../models/user-history';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  
  playerData = signal<UserHistory | null>(null);

  async ngOnInit() {
    const user = this.authService.currentUser();
    if (!user) {
      this.router.navigate(['/']); // Sécurité : si aucun utilisateur n'est connecté
      return;
    }

    const history = await this.authService.getHistory(user.id);
    this.playerData.set(history);
  }

  goBack() {
    this.router.navigate(['/game']);
  }
}
