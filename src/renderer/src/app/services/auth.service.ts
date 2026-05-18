import { Injectable, signal } from '@angular/core';
import { User, UserHistory, UserAchievement } from '../models/types';

declare global {
  interface Window {
    electronAPI: any; // On garde any ici pour simplifier, car l'API est globale
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<User | null>(null);

  async login(pseudo: string) {
    try {
      const user = await window.electronAPI.loginUser(pseudo);
      this.currentUser.set(user);
      return user;
    } catch (error) {
      console.error("Erreur login :", error);
      return null;
    }
  }

  logout() {
    this.currentUser.set(null);
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await window.electronAPI.getUsers();
    } catch (error) {
      console.error("Erreur récupération utilisateurs :", error);
      return [];
    }
  }

  async getHistory(userId: number): Promise<UserHistory | null> {
    try {
      return await window.electronAPI.getPlayerHistory(userId);
    } catch (error) {
      console.error("Erreur historique :", error);
      return null;
    }
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    try {
      return await window.electronAPI.getUserAchievements(userId);
    } catch (error) {
      console.error("Erreur récupération succès :", error);
      return [];
    }
  }

  async deleteUser(userId: number): Promise<boolean> {
    try {
      return await window.electronAPI.deleteUser(userId);
    } catch (error) {
      console.error("Erreur suppression :", error);
      return false;
    }
  }
}
