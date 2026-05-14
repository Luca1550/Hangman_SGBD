import { Component, OnInit, signal, inject } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserAchievement } from '../models/types';

@Component({
  selector: 'app-user-achievements',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="goBack()" style="position: absolute; top: 20px; left: 20px; padding: 10px 15px; font-weight: bold; cursor: pointer; background: #ddd; border: 1px solid #aaa; border-radius: 5px;">
      ⬅ Retour
    </button>

    <div style="padding: 20px; max-width: 600px; margin: 40px auto 0; text-align: center;">
      <h2 style="color: darkgoldenrod;">🏆 Succès du Joueur</h2>

      <div style="margin-top: 30px; display: grid; gap: 15px;">
        @for (ua of achievements(); track ua.achievementId) {
          <div style="display: flex; align-items: center; padding: 15px; background: #fdfbf7; border: 1px solid #e0d4b5; border-radius: 8px;">
            <div style="font-size: 40px; margin-right: 20px;">
              {{ ua.achievement.icon_name }}
            </div>
            <div style="text-align: left;">
              <h3 style="margin: 0 0 5px 0;">{{ ua.achievement.name }}</h3>
              <p style="margin: 0; color: #666;">{{ ua.achievement.description }}</p>
              <small style="color: #999;">Obtenu le : {{ ua.earnedAt | date:'short' }}</small>
            </div>
          </div>
        } @empty {
          <p style="padding: 20px; background: #eee; border-radius: 8px;">Ce joueur n'a débloqué aucun succès pour le moment.</p>
        }
      </div>
    </div>
  `
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
