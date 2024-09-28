const { ipcRenderer } = require('electron');

document.getElementById('close-btn').addEventListener('click', () => {
  ipcRenderer.send('close-window'); 
});

document.getElementById('profileButton').addEventListener('click', () => {
  ipcRenderer.send('open-profile-window'); 
});
