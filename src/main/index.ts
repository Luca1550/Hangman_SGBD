import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

// 1. On initialise Prisma dans notre backend avec l'adaptateur requis par Prisma 7
const adapter = new PrismaBetterSqlite3({
  url: path.join(__dirname, '../../dev.db')
});
const prisma = new PrismaClient({ adapter });

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            // 2. On indique à Electron où se trouve Preload
            preload: path.join(__dirname, '../preload/index.js'),
            contextIsolation: true, // Sécurité obligatoire
            nodeIntegration: false  // Sécurité obligatoire
        }
    });
    // 3. On charge l'URL de notre serveur de développement Angular
    mainWindow.loadURL('http://localhost:4200');
}

// 4. On demande à Electron (ipcMain) d'écouter le canal 'db:get-categories'
ipcMain.handle('db:get-categories', async () => {
    try {
        const categories = await prisma.category.findMany()
        return categories // On renvoie le résultat au Preload, qui le renverra à Angular
    } catch (error) {
        console.error("erreur DB: ", error)
        return []
    }
})

// 5. On crée un canal pour demander un mot aléatoire
ipcMain.handle('db:get-random-word', async () => {
    try {
        // A. On compte combien de mots existent dans la base
        const count = await prisma.word.count();
        if (count === 0) return null;

        // B. On choisit un index au hasard
        const randomIndex = Math.floor(Math.random() * count);

        // C. On va chercher le mot qui correspond à cet index
        const randomWord = await prisma.word.findFirst({
            skip: randomIndex,
            include: { category: true } // On a besoin de la catégorie pour l'afficher
        });

        return randomWord;
    } catch (error) {
        console.error("Erreur récupération mot: ", error);
        return null;
    }
});

// 6. Canal pour gérer la connexion / création d'un joueur
ipcMain.handle('db:login-user', async (event, pseudo: string) => {
    try {
        // On utilise upsert : s'il existe on le met à jour, sinon on le crée
        const user = await prisma.user.upsert({
            where: { email: `${pseudo.toLowerCase()}@local.game` }, // email bidon technique
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

// 7. Canal pour sauvegarder une partie (Victoire ou Défaite)
ipcMain.handle('db:save-game', async (event, data: any) => {
    try {
        return await prisma.game.create({
            data: {
                userId: data.userId,
                wordId: data.wordId,
                difficultyId: data.difficultyId,
                errors_count: data.errors_count,
                status: data.status,
                score: data.score
            }
        });
    } catch (error) {
        console.error("Erreur sauvegarde partie: ", error);
        return null;
    }
});

// 8. Canal pour récupérer l'historique d'un joueur (Exigence: JOIN / include)
ipcMain.handle('db:get-player-history', async (event, userId: number) => {
    try {
        const history = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                games: {
                    include: {
                        word: true // On "JOIN" la table mot pour savoir quel mot a été joué
                    },
                    orderBy: {
                        playedAt: 'desc' // Les plus récentes en premier
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

// 9. Canal pour récupérer la liste de tous les utilisateurs
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

// 10. Canal pour supprimer un utilisateur (Exigence CRUD: Delete)
ipcMain.handle('db:delete-user', async (event, userId: number) => {
    try {
        // La suppression de l'utilisateur va automatiquement supprimer ses parties
        // car nous avons configuré "onDelete: Cascade" dans le schema.prisma !
        await prisma.user.delete({
            where: { id: userId }
        });
        return true;
    } catch (error) {
        console.error("Erreur suppression utilisateur: ", error);
        return false;
    }
});

// --- CRUD MOTS ---

ipcMain.handle('db:get-words', async () => {
    try {
        return await prisma.word.findMany({
            include: { category: true, difficulty: true },
            orderBy: { text: 'asc' }
        });
    } catch (e) {
        return [];
    }
});

ipcMain.handle('db:add-word', async (event, data) => {
    try {
        return await prisma.word.create({ data });
    } catch (e) {
        console.error(e);
        return null;
    }
});

ipcMain.handle('db:update-word', async (event, data) => {
    try {
        const { id, ...updateData } = data;
        return await prisma.word.update({
            where: { id },
            data: updateData
        });
    } catch (e) {
        console.error(e);
        return null;
    }
});

ipcMain.handle('db:delete-word', async (event, id: number) => {
    try {
        await prisma.word.delete({ where: { id } });
        return true;
    } catch (e) {
        return false;
    }
});

ipcMain.handle('db:get-difficulties', async () => {
    try {
        return await prisma.difficulty.findMany();
    } catch (e) {
        return [];
    }
});

// Canal pour ajouter une nouvelle catégorie
ipcMain.handle('db:add-category', async (event, name: string) => {
    try {
        return await prisma.category.create({ data: { name } });
    } catch (e) {
        console.error(e);
        return null;
    }
});

// Canal pour supprimer une catégorie
ipcMain.handle('db:delete-category', async (event, id: number) => {
    try {
        await prisma.category.delete({ where: { id } });
        return { success: true };
    } catch (error: any) {
        // P2003 = Foreign key constraint failed. Ça veut dire que des mots utilisent encore cette catégorie.
        if (error.code === 'P2003') {
            return { success: false, message: "Impossible de supprimer cette catégorie car elle contient encore des mots." };
        }
        return { success: false, message: "Erreur lors de la suppression de la catégorie." };
    }
});

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});
app.on('window-all-closed', function () {
    app.quit();
});