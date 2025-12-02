document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('csv-form');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const fileInput = document.getElementById('csv-select');
        if (!fileInput.files.length) {
            alert('Please select a CSV file.');
            return;
        }
        const formData = new FormData();
        formData.append('csv', fileInput.files[0]);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                alert('Upload successful!');
            } else {
                alert('Upload failed.');
            }
        } catch (error) {
            alert('An error occurred: ' + error.message);
        }
    });
});