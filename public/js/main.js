document.addEventListener('DOMContentLoaded', () => {
    const uploadBtn = document.getElementById('upload-btn');
    const contentPanel = document.getElementById('content-panel');

    uploadBtn.addEventListener('click', () => {
        // Загружаем компонент формы с абсолютным путем
        fetch('/components/upload.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                // Вставляем содержимое компонента в content-panel
                contentPanel.innerHTML = data;
            })
            .catch(error => {
                console.error('Error loading component:', error);
            });
    });
});
