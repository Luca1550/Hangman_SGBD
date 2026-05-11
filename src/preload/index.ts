import {contextBridge, ipcRenderer} from 'electron'

// On expose une API globale appelée "electronAPI" à notre fenêtre web (Angular)
contextBridge.exposeInMainWorld('electronAPI',{
    // On crée une fonction que Angular pourra appeler : getCategories()
    // Elle envoie un message nommé 'db:get-categories' au processus principal (Main)
    getCategories: () => ipcRenderer.invoke('db:get-categories')
})