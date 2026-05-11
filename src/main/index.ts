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

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});
app.on('window-all-closed', function () {
    app.quit();
});