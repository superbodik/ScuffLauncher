document.addEventListener('DOMContentLoaded', () => {
  const openFileButton = document.getElementById('open-file');
  const fileInput = document.getElementById('file-input');
  const skinContainer = document.getElementById('skin-container');

  openFileButton.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.width = '100px';
        img.style.height = '100px'; 
        skinContainer.innerHTML = '';
        skinContainer.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  });
});
