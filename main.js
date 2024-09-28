import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import os from 'os';
import isDev from 'electron-is-dev';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Перемещаем инициализацию DevTools после создания mainWindow
let mainWindow;

const modpackFolder = path.join(os.homedir(), 'ScuffLauncher', 'modpacks');

// Создание папки для модпаков
function createModpackFolder() {
  if (!fs.existsSync(modpackFolder)) {
    try {
      fs.mkdirSync(modpackFolder, { recursive: true });
      console.log(`Папка для модпаков создана: ${modpackFolder}`);
    } catch (error) {
      console.error('Ошибка создания папки для модпаков:', error);
    }
  } else {
    console.log(`Папка для модпаков уже существует: ${modpackFolder}`);
  }
}

// Создание главного окна
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    },
  });

  // Открытие DevTools в режиме разработки
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Убираем стандартное меню
  Menu.setApplicationMenu(null);

  // Загружаем главный HTML файл
  mainWindow.loadFile(path.join(__dirname, 'screen', 'index.html'));

  // Проверка аутентификации пользователя
  const authData = getAuthData();
  if (authData && authData.isAuthenticated) {
    mainWindow.webContents.once('did-finish-load', () => {
      mainWindow.webContents.send('user-authenticated', authData);
    });
  }

  // Создаем папку для модпаков
  createModpackFolder();
}

// Получение данных аутентификации
function getAuthData() {
  const authPath = path.join(os.homedir(), 'authData.json');
  if (fs.existsSync(authPath)) {
    try {
      const data = fs.readFileSync(authPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading auth data:', error);
      return null;
    }
  }
  return null;
}

// Сохранение данных аутентификации
function saveAuthData(data) {
  try {
    fs.writeFileSync(path.join(os.homedir(), 'authData.json'), JSON.stringify(data), 'utf8');
  } catch (error) {
    console.error('Error saving auth data:', error);
  }
}

// IPC-сообщения для управления окнами и аутентификацией
ipcMain.on('open-profile-window', () => {
  createProfileWindow();
});

ipcMain.on('close-window', () => {
  app.quit();
});

ipcMain.on('login', (event, authData) => {
  saveAuthData(authData);
  mainWindow.webContents.send('user-authenticated', authData);
});

ipcMain.on('logout', () => {
  try {
    fs.unlinkSync(path.join(os.homedir(), 'authData.json'));
    mainWindow.webContents.send('user-logged-out');
  } catch (error) {
    console.error('Error during logout:', error);
  }
});

// Создание главного окна при готовности приложения
app.whenReady().then(createMainWindow);

// Закрытие приложения при закрытии всех окон
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Восстановление окна при активации
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
