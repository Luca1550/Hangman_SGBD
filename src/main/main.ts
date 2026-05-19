import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

// 1. On initialise Prisma dans notre backend avec l'adaptateur requis par Prisma 7
const adapter = new PrismaBetterSqlite3({
  url: path.join(__dirname, '../../dev.db')
});
export const prisma = new PrismaClient({ adapter });

import { registerUserHandlers } from './handlers/user.handler';
import { registerWordHandlers } from './handlers/word.handler';
import { registerCategoryHandlers } from './handlers/category.handler';
import { registerDifficultyHandlers } from './handlers/difficulty.handler';
import { registerGameHandlers } from './handlers/game.handler';
function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            // 2. On indique à Electron où se trouve Preload
            preload: path.join(__dirname, '../preload/preload.js'),
            contextIsolation: true, // Sécurité obligatoire
            nodeIntegration: false  // Sécurité obligatoire
        }
    });
    // 3. On charge l'URL de notre serveur de développement Angular
    mainWindow.loadURL('http://localhost:4200');
}

// Handlers moved to src/main/handlers/

app.whenReady().then(() => {
    registerUserHandlers();
    registerWordHandlers();
    registerCategoryHandlers();
    registerDifficultyHandlers();
    registerGameHandlers();
    
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});
app.on('window-all-closed', function () {
    app.quit();
});