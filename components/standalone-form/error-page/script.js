function retry() {
    // Redirect back to the main admission form
    window.location.href = '../index.html';
}

// Optional: check for specific error messages in URL query params
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const errorMsg = params.get('msg');
    if (errorMsg) {
        // You could dynamically update the text here if needed
        console.log("Error details:", errorMsg);
    }
});
