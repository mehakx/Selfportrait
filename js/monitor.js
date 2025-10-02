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
        
        // Set line style based on chaos level - INCREASED LINE WIDTH FROM 2 TO 4
        ctx.lineWidth = 4;
        
        // Draw the ECG line
        ctx.beginPath();
        
        // Start from the left edge
        let x = 0;
        let y = currentPattern[patternPosition % currentPattern.length];
        ctx.moveTo(x, y);
        
        // Draw the line across the canvas
        const step = 2; // Horizontal distance between points
        const pointsToDraw = Math.ceil(canvas.width / step);
        
        for (let i = 1; i < pointsToDraw; i++) {
            x += step;
            patternPosition = (patternPosition + 1) % currentPattern.length;
            y = currentPattern[patternPosition];
            
            // Add chaos to the line based on chaos level
            if (chaosLevel > 25) {
                const chaosAmount = (chaosLevel - 25) / 75 * 5; // Scale from 0 to 5
                y += (Math.random() * chaosAmount * 2) - chaosAmount;
            }
            
            // Draw the main ECG line (green)
            ctx.lineTo(x, y);
        }
        
        ctx.strokeStyle = '#00FF41';
        ctx.stroke();
        
        // If chaos level is high enough, add a second line (red for Gmail)
        if (chaosLevel >= 25) {
            ctx.beginPath();
            x = 0;
            y = currentPattern[(patternPosition + 30) % currentPattern.length];
            ctx.moveTo(x, y);
            
            // INCREASED LINE WIDTH FOR RED LINE FROM DEFAULT TO 4
            ctx.lineWidth = 4;
            
            for (let i = 1; i < pointsToDraw; i++) {
                x += step;
                const pos = (patternPosition + 30 + i) % currentPattern.length;
                y = currentPattern[pos];
                
                // Add more chaos to this line
                const chaosAmount = (chaosLevel - 25) / 75 * 10;
                y += (Math.random() * chaosAmount * 2) - chaosAmount;
                
                ctx.lineTo(x, y);
            }
            
            ctx.strokeStyle = '#FF6B6B';
            ctx.globalAlpha = (chaosLevel - 25) / 75;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
        }
        
        // If chaos level is very high, add yellow glitches
        if (chaosLevel >= 50) {
            // Add random vertical glitches
            const glitchCount = Math.floor((chaosLevel - 50) / 10);
            ctx.strokeStyle = '#FFD700';
            ctx.globalAlpha = (chaosLevel - 50) / 50;
            
            // INCREASED LINE WIDTH FOR GLITCHES FROM DEFAULT TO 5
            ctx.lineWidth = 5;
            
            for (let i = 0; i < glitchCount; i++) {
                const glitchX = Math.random() * canvas.width;
                const glitchHeight = Math.random() * 50 + 20;
                
                ctx.beginPath();
                ctx.moveTo(glitchX, canvas.height / 2 - glitchHeight);
                ctx.lineTo(glitchX, canvas.height / 2 + glitchHeight);
                ctx.stroke();
            }
            
            ctx.globalAlpha = 1.0;
        }
        
        // Move pattern position for next frame
        patternPosition = (patternPosition + 1) % currentPattern.length;
        
        // Request next frame
        animationFrame = requestAnimationFrame(drawECG);
    }
    
    // Start the animation
    drawECG();
    
    // Update chaos level display and status when slider changes
    chaosSlider.addEventListener('input', function() {
        const chaosLevel = parseInt(this.value);
        chaosLevelText.textContent = chaosLevel + '%';
        
        // Update status text
        if (chaosLevel < 25) {
            statusText.textContent = 'CLARITY MODE - Clean Drive Pulse';
            statusText.style.backgroundColor = '#00FF41';
        } else if (chaosLevel < 50) {
            statusText.textContent = 'MILD NOISE - Gmail Layer Active';
            statusText.style.backgroundColor = '#FFFF00';
            statusText.style.color = '#000';
        } else if (chaosLevel < 75) {
            statusText.textContent = 'MODERATE CHAOS - Search Glitches Detected';
            statusText.style.backgroundColor = '#FFA500';
            statusText.style.color = '#000';
        } else {
            statusText.textContent = 'FULL CHAOS - All Data Layers Active';
            statusText.style.backgroundColor = '#FF6B6B';
            statusText.style.color = '#000';
        }
        
        // Update background video and noise overlay
        if (chaosLevel > 0) {
            backgroundVideo.play();
            backgroundVideo.style.opacity = chaosLevel / 100;
            noiseOverlay.style.opacity = chaosLevel / 200;
        } else {
            backgroundVideo.pause();
            backgroundVideo.style.opacity = 0;
            noiseOverlay.style.opacity = 0;
        }
        
        // Switch noise overlay image based on chaos level
        if (chaosLevel > 50) {
            noiseOverlay.style.backgroundImage = "url('../images/noise1.jpg')";
        } else {
            noiseOverlay.style.backgroundImage = "url('../images/noise2.jpg')";
        }
    });
});
