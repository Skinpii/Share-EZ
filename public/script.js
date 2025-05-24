// This script handles form submission and displays the download link
document.addEventListener('DOMContentLoaded', () => {    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileName');
    const linkContainer = document.getElementById('linkContainer');
    const downloadLink = document.getElementById('downloadLink');
    const copyBtn = document.getElementById('copyBtn');
    
    // Store the current file's shortId for cleanup
    let currentFileShortId = null;

    fileInput.addEventListener('change', () => {
        fileNameDisplay.textContent = fileInput.files[0] ? fileInput.files[0].name : 'No file selected';
    });    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(uploadForm);
        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                // Use only the numeric code returned by the server
                const code = data.code;
                currentFileShortId = code;
                downloadLink.value = code;
                linkContainer.style.display = 'block';
                downloadLink.select();
            } else {
                alert(`Upload failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during upload');
        }
    });

    copyBtn.addEventListener('click', () => {
        downloadLink.select();
        document.execCommand('copy');
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy Link';
        }, 1500);
    });    // Cleanup function to delete file and data when user leaves
    async function cleanupCurrentFile() {
        if (currentFileShortId) {
            try {
                await fetch(`/upload/cleanup/${currentFileShortId}`, {
                    method: 'DELETE',
                    keepalive: true // Ensures request completes even if page is closing
                });
                console.log('File cleaned up successfully');
                currentFileShortId = null; // Clear the ID after cleanup
            } catch (error) {
                console.error('Error cleaning up file:', error);
            }
        }
    }

    // Only cleanup on actual page unload (not tab switching)
    window.addEventListener('beforeunload', (e) => {
        if (currentFileShortId) {
            cleanupCurrentFile();
            // Show confirmation dialog
            e.preventDefault();
            e.returnValue = 'Are you sure you want to leave? Your uploaded file will be deleted.';
            return e.returnValue;
        }
    });    // Cleanup when page is actually being unloaded
    window.addEventListener('unload', () => {
        cleanupCurrentFile();
    });
});
