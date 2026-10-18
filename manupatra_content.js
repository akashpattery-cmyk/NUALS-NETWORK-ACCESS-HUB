const clickIpLogin = () => {
    // Target the specific image element you identified
    const ipImage = document.querySelector('img[src*="IPUser.png"]');
    
    if (ipImage) {
        // Click the image directly
        ipImage.click();
        
        // As a fallback: if the image is wrapped in a clickable link (<a> tag), 
        // clicking the image usually works, but triggering the parent link guarantees it.
        const parentLink = ipImage.closest('a');
        if (parentLink) {
            parentLink.click();
        }
    }
};

// Execute a slight 800ms delay to ensure Manupatra's internal scripts are fully loaded and listening
setTimeout(clickIpLogin, 800);