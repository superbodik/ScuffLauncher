document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(this);

    try {
        const response = await fetch('/api/modpacks', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Modpack uploaded successfully!');
            window.location.href = '/'; 
        } else {
            const result = await response.json();
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error uploading modpack:', error);
        alert('Failed to upload modpack');
    }
});