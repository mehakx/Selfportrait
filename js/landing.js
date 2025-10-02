document.addEventListener('DOMContentLoaded', function() {
    const mainTitle = document.getElementById('main-title');
    
    // Add click event to title as an alternative to the ENTER button
    mainTitle.addEventListener('click', function() {
        window.location.href = 'monitor.html';
    });
    
    // Add subtle animation to the title
    function animateTitle() {
        const glowIntensity = Math.abs(Math.sin(Date.now() * 0.001) * 0.5) + 0.5;
        const shadowBlur = 5 + (glowIntensity * 10);
        mainTitle.style.textShadow = `0 0 ${shadowBlur}px rgba(0, 255, 65, ${glowIntensity})`;
        
        requestAnimationFrame(animateTitle);
    }
    
    // Start the animation
    animateTitle();
});
