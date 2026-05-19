import { ipcMain } from 'electron';
import { prisma } from '../main';

export function registerUserHandlers() {
    ipcMain.handle('db:login-user', async (event, pseudo: string) => {
        try {
            const user = await prisma.user.upsert({
                where: { email: `${pseudo.toLowerCase()}@local.game` },
                update: {}, 
                create: { 
                    pseudo: pseudo, 
                    email: `${pseudo.toLowerCase()}@local.game` 
                },
            });
            return user;
        } catch (error) {
            console.error("Erreur login joueur: ", error);
            return null;
        }
    });

    ipcMain.handle('db:get-player-history', async (event, userId: number) => {
        try {
            const history = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    games: {
                        include: {
                            word: true
                        },
                        orderBy: {
                            playedAt: 'desc'
                        }
                    }
                }
            });
            return history;
        } catch (error) {
            console.error("Erreur récupération historique: ", error);
            return null;
        }
    });

    ipcMain.handle('db:get-users', async () => {
        try {
            const users = await prisma.user.findMany({
                orderBy: { createdAt: 'desc' }
            });
            return users;
        } catch (error) {
            console.error("Erreur récupération utilisateurs: ", error);
            return [];
        }
    });

    ipcMain.handle('db:get-user-achievements', async (event, userId: number) => {
        try {
            const userWithAch = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    achievements: {
                        include: { achievement: true },
                        orderBy: { earnedAt: 'desc' }
                    }
                }
            });
            return userWithAch ? userWithAch.achievements : [];
        } catch (error) {
            console.error("Erreur récupération succès: ", error);
            return [];
        }
    });

    ipcMain.handle('db:delete-user', async (event, userId: number) => {
        try {
            await prisma.user.delete({
                where: { id: userId }
            });
            return true;
        } catch (error) {
            console.error("Erreur suppression utilisateur: ", error);
            return false;
        }
    });
}
