export interface User {
  id: number;
  pseudo: string;
  email: string;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
}

export interface Difficulty {
  id: number;
  level_name: string;
}

export interface Word {
  id: number;
  text: string;
  hint: string | null;
  categoryId: number;
  difficultyId: number;
  // Relations (utilisées avec 'include' dans Prisma)
  category?: Category;
  difficulty?: Difficulty;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon_name: string | null;
}

export interface UserAchievement {
  userId: number;
  achievementId: number;
  earnedAt: Date | string;
  achievement: Achievement; // Utilisé dans le JOIN
}

export interface Game {
  id: number;
  errors_count: number;
  status: string;
  score: number;
  playedAt: Date | string;
  word: Word; // Utilisé dans l'historique
}

export interface UserHistory extends User {
  games: Game[];
}
