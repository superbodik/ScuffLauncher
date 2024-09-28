import someModule from 'some-module';
window.ipcRenderer.send('some-event');

async function loadUserProfile() {
    try {
        const token = localStorage.getItem('token'); // Получение токена из localStorage
        if (!token) throw new Error('Token is missing');

        const response = await fetch(`${API_URL}/user/profile`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        document.getElementById('username').textContent = data.username;
        document.getElementById('profile-skin').src = data.skinUrl || '../img/default-skin.png';
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
});


async function installModpack(modpackId) {
    try {
        const response = await fetch(`${API_URL}/install/${modpackId}`, {
            method: 'POST', // или другой метод в зависимости от вашего API
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            // Добавьте body, если необходимо
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        console.log('Installation successful:', data);
    } catch (error) {
        console.error('Error during installation:', error);
    }
}
