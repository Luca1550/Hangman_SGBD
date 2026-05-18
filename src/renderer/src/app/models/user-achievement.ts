import { Achievement } from './achievement';

export interface UserAchievement {
  userId: number;
  achievementId: number;
  earnedAt: Date | string;
  achievement: Achievement;
}
