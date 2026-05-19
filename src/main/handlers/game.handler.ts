import { ipcMain } from 'electron';
import { prisma } from '../main';

export function registerGameHandlers() {
    ipcMain.handle('db:save-game', async (event, data: any) => {
        try {
            const game = await prisma.game.create({
                data: {
                    userId: data.userId,
                    wordId: data.wordId,
                    difficultyId: data.difficultyId,
                    errors_count: data.errors_count,
                    status: data.status,
                    score: data.score
                }
            });
    
            // --- GESTION DES SUCCÈS ---
            const user = await prisma.user.findUnique({
                where: { id: data.userId },
                include: { 
                    games: true, 
                    achievements: { include: { achievement: true } } 
                }
            });
    
            const newUnlockedAchievements = [];
    
            if (user) {
                const allAchievements = await prisma.achievement.findMany();
                const earnedAchievementNames = user.achievements.map((ua: any) => ua.achievement.name);
                const newUnlocks: any[] = [];
    
                // Helper function to check and grant
                const checkAndGrant = (name: string, condition: boolean) => {
                    if (condition && !earnedAchievementNames.includes(name)) {
                        const ach = allAchievements.find((a: any) => a.name === name);
                        if (ach) newUnlocks.push(ach);
                    }
                };
    
                // Règle 1: Première partie
                checkAndGrant('Première partie', user.games.length >= 1);
    
                // Règle 2: 5 victoires
                const wins = user.games.filter((g: any) => g.status === 'GAGNE').length;
                checkAndGrant('5 victoires', wins >= 5);
    
                // Règle 3: Zéro pointé
                checkAndGrant('Zéro pointé', data.status === 'PERDU' && data.errors_count === data.total_guesses);
    
                // Règle 4: Partie parfaite
                checkAndGrant('Partie parfaite', data.status === 'GAGNE' && data.errors_count === 0);
    
                // Règle 5: Complétionniste (S'ils ont obtenu les 4 autres)
                const totalEarnedAndNew = earnedAchievementNames.length + newUnlocks.length;
                if (totalEarnedAndNew === allAchievements.length - 1 && !earnedAchievementNames.includes('Complétionniste')) {
                    const ach = allAchievements.find((a: any) => a.name === 'Complétionniste');
                    if (ach) newUnlocks.push(ach);
                }
    
                // On insère les nouveaux succès
                for (const ach of newUnlocks) {
                    await prisma.userAchievement.create({
                        data: {
                            userId: user.id,
                            achievementId: ach.id
                        }
                    });
                    newUnlockedAchievements.push(ach);
                }
            }
    
            return { game, newAchievements: newUnlockedAchievements };
        } catch (error) {
            console.error("Erreur sauvegarde partie: ", error);
            return null;
        }
    });
}
