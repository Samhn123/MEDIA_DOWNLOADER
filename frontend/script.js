document.getElementById('downloadBtn').addEventListener('click', async () => {
    const url = document.getElementById('url').value.trim();
    const format = document.getElementById('format').value;
    const statusDiv = document.getElementById('status');

    if (!url) {
        statusDiv.textContent = 'Please enter a URL.';
        return;
    }

    statusDiv.textContent = 'Processing... Please wait.';
    statusDiv.style.color = '#007bff';

    try {
        const response = await fetch('http://localhost:5000/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, format })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Download failed');
        }

        // Get the file blob and trigger download
        const blob = await response.blob();
        const link = document.createElement('a');
        const downloadUrl = URL.createObjectURL(blob);
        link.href = downloadUrl;

        // Extract filename from Content-Disposition header if present, else use generic
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `download.${format}`;
        if (contentDisposition && contentDisposition.includes('filename=')) {
            filename = contentDisposition.split('filename=')[1].replace(/["']/g, '');
        }
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);

        statusDiv.textContent = 'Download completed!';
        statusDiv.style.color = 'green';
    } catch (error) {
        statusDiv.textContent = `Error: ${error.message}`;
        statusDiv.style.color = 'red';
    }
});