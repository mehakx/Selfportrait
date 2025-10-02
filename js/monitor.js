document.addEventListener('DOMContentLoaded', function() {
    // Get canvas and context
    const canvas = document.getElementById('ecgCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    // Initial resize
    resizeCanvas();

    // Resize on window resize
    window.addEventListener('resize', resizeCanvas);

    // Get slider and related elements
    const chaosSlider = document.getElementById('chaosSlider');
    const chaosLevelText = document.getElementById('chaos-level');
    const statusText = document.getElementById('status-text');
    const backgroundVideo = document.getElementById('background-video');
    const noiseOverlay = document.getElementById('noise-overlay');

    // Animation variables
    let animationFrame;
    let xPos = 0;
    let currentPattern = [];
    let currentPatternIndex = 0;
    let patternPosition = 0;

    // Combine all patterns for continuous drawing
    function combinePatterns(chaosLevel) {
        // Start with drive patterns (heartbeat)
        let combinedPattern = [];

        // Add all heartbeat patterns
        heartbeatPatterns.forEach(pattern => {
            combinedPattern = combinedPattern.concat(pattern);
        });

        // If chaos level is high enough, add brainwave patterns
        if (chaosLevel >= 25) {
            const brainwaveIntensity = (chaosLevel - 25) / 75; // Scale from 0 to 1

            brainwavePatterns.forEach((pattern, index) => {
                // Only add patterns for months with data
                if (ecgData.gmail[index].count > 0) {
                    // Scale the pattern based on chaos level
                    const scaledPattern = pattern.map(value => {
                        const baseline = 150;
                        const deviation = value - baseline;
                        return baseline + (deviation * brainwaveIntensity);
                    });

                    // Add to the combined pattern
                    combinedPattern = combinedPattern.concat(scaledPattern);
                }
            });
        }

        // If chaos level is very high, add glitch patterns
        if (chaosLevel >= 50) {
            const glitchIntensity = (chaosLevel - 50) / 50; // Scale from 0 to 1

            glitchPatterns.forEach((pattern, index) => {
                // Only add patterns for months with data
                if (ecgData.search[index].count > 0) {
                    // Scale the pattern based on chaos level
                    const scaledPattern = pattern.map(value => {
                        const baseline = 150;
                        const deviation = value - baseline;
                        return baseline + (deviation * glitchIntensity);
                    });

                    // Add to the combined pattern
                    combinedPattern = combinedPattern.concat(scaledPattern);
                }
            });
        }

        return combinedPattern;
    }

    // Draw ECG line
    function drawECG() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Get current chaos level
        const chaosLevel = parseInt(chaosSlider.value);

        // Update current pattern if needed
        if (currentPattern.length === 0 || chaosLevel !== parseInt(chaosLevelText.textContent)) {
            currentPattern = combinePatterns(chaosLevel);
            patternPosition = 0;
        }

        // Set line style based on chaos level
        ctx.lineWidth = 4; // Thicker line for better visibility
        
        // Draw the ECG line
        ctx.beginPath();
        
        // Start from the left edge
        let x = 0;
        let y = currentPattern[patternPosition % currentPattern.length];
        ctx.moveTo(x, y);
        
        // Draw the line across the canvas
        const step = 2; // Horizontal distance between points
        
        while (x < canvas.width) {
            x += step;
            patternPosition = (patternPosition + 1) % currentPattern.length;
            y = currentPattern[patternPosition];
            
            // Ensure y is within canvas bounds
            y = Math.max(0, Math.min(y, canvas.height));
            
            ctx.lineTo(x, y);
        }
        
        // Set line color based on chaos level
        if (chaosLevel < 25) {
            ctx.strokeStyle = '#00FF41'; // Green for clarity
        } else if (chaosLevel < 50) {
            ctx.strokeStyle = '#FFFF00'; // Yellow for medium chaos
        } else if (chaosLevel < 75) {
            ctx.strokeStyle = '#FF7700'; // Orange for high chaos
        } else {
            ctx.strokeStyle = '#FF0000'; // Red for extreme chaos
        }
        
        ctx.stroke();
        
        // Update status text based on chaos level
        if (chaosLevel < 25) {
            statusText.textContent = "CLARITY MODE - Clean Drive Pulse";
            statusText.style.color = '#00FF41';
        } else if (chaosLevel < 50) {
            statusText.textContent = "NOISE MODE - Gmail Interference";
            statusText.style.color = '#FFFF00';
        } else if (chaosLevel < 75) {
            statusText.textContent = "CHAOS MODE - Search Glitches";
            statusText.style.color = '#FF7700';
        } else {
            statusText.textContent = "OVERLOAD MODE - All Data Visible";
            statusText.style.color = '#FF0000';
        }
        
        // Update background video opacity based on chaos level
        backgroundVideo.style.opacity = chaosLevel / 100;
        noiseOverlay.style.opacity = chaosLevel / 200;
        
        // Request next frame
        animationFrame = requestAnimationFrame(drawECG);
    }

    // Add event listener for slider changes
    chaosSlider.addEventListener('input', function() {
        chaosLevelText.textContent = this.value + '%';
        drawECG();
    });

    // Start animation
    drawECG();
    
    // Ensure background video plays
    const backgroundVideo = document.getElementById('background-video');
    
    // Force play the video
    backgroundVideo.play().catch(function(error) {
        console.log("Video play failed: " + error);
    });
    
    // Try to play again on user interaction
    document.body.addEventListener('click', function() {
        backgroundVideo.play().catch(function(error) {
            console.log("Video play failed: " + error);
        });
    }, { once: true });
});

