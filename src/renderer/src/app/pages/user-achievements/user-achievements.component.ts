import { Component, OnInit, signal, inject } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserAchievement } from '../../models/types';

@Component({
  selector: 'app-user-achievements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-achievements.component.html',
  styleUrl: './user-achievements.component.css'
})
export class UserAchievementsComponent implements OnInit {
  dbService = inject(DatabaseService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  achievements = signal<UserAchievement[]>([]);

  async ngOnInit() {
    // On récupère l'ID passé en paramètre de l'URL
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    if (userId) {
      const data = await this.dbService.getUserAchievements(userId);
      this.achievements.set(data);
    }
  }

  goBack() {
    // Si on vient de l'accueil, on y retourne, ou si on vient de la liste des users, on y retourne.
    // L'historique de la navigation Angular n'est pas simple sans Location, on va router vers users.
    this.router.navigate(['/users']);
  }
}
