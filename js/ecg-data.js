// ECG Data from Excel file
const ecgData = {
    // Drive data - monthly counts
    drive: [
        { month: "Mar 2024", count: 18 },
        { month: "Apr 2024", count: 9 },
        { month: "May 2024", count: 0 },
        { month: "Jun 2024", count: 0 },
        { month: "Jul 2024", count: 0 },
        { month: "Aug 2024", count: 0 },
        { month: "Sep 2024", count: 0 },
        { month: "Oct 2024", count: 0 },
        { month: "Nov 2024", count: 1 },
        { month: "Dec 2024", count: 1 },
        { month: "Jan 2025", count: 0 },
        { month: "Feb 2025", count: 6 },
        { month: "Mar 2025", count: 0 },
        { month: "Apr 2025", count: 2 },
        { month: "May 2025", count: 0 },
        { month: "Jun 2025", count: 0 },
        { month: "Jul 2025", count: 0 },
        { month: "Aug 2025", count: 0 },
        { month: "Sep 2025", count: 0 }
    ],
    
    // Gmail data - monthly counts
    gmail: [
        { month: "Mar 2024", count: 0 },
        { month: "Apr 2024", count: 0 },
        { month: "May 2024", count: 0 },
        { month: "Jun 2024", count: 0 },
        { month: "Jul 2024", count: 0 },
        { month: "Aug 2024", count: 0 },
        { month: "Sep 2024", count: 0 },
        { month: "Oct 2024", count: 0 },
        { month: "Nov 2024", count: 0 },
        { month: "Dec 2024", count: 0 },
        { month: "Jan 2025", count: 0 },
        { month: "Feb 2025", count: 0 },
        { month: "Mar 2025", count: 0 },
        { month: "Apr 2025", count: 0 },
        { month: "May 2025", count: 16 },
        { month: "Jun 2025", count: 3 },
        { month: "Jul 2025", count: 6 },
        { month: "Aug 2025", count: 5 },
        { month: "Sep 2025", count: 13 }
    ],
    
    // Search data - monthly counts
    search: [
        { month: "Mar 2024", count: 0 },
        { month: "Apr 2024", count: 0 },
        { month: "May 2024", count: 0 },
        { month: "Jun 2024", count: 0 },
        { month: "Jul 2024", count: 0 },
        { month: "Aug 2024", count: 0 },
        { month: "Sep 2024", count: 0 },
        { month: "Oct 2024", count: 0 },
        { month: "Nov 2024", count: 0 },
        { month: "Dec 2024", count: 0 },
        { month: "Jan 2025", count: 0 },
        { month: "Feb 2025", count: 0 },
        { month: "Mar 2025", count: 0 },
        { month: "Apr 2025", count: 0 },
        { month: "May 2025", count: 1 },
        { month: "Jun 2025", count: 0 },
        { month: "Jul 2025", count: 0 },
        { month: "Aug 2025", count: 0 },
        { month: "Sep 2025", count: 0 }
    ]
};

// Generate ECG patterns for heartbeat visualization
function generateHeartbeatPattern(baseValue, amplitude) {
    // Create a standard ECG pattern (P-QRS-T waves)
    const pattern = [];
    
    // P wave (small upward deflection)
    for (let i = 0; i < 10; i++) {
        pattern.push(baseValue + (amplitude * 0.2 * Math.sin(i * Math.PI / 10)));
    }
    
    // PR segment (brief flat line)
    for (let i = 0; i < 5; i++) {
        pattern.push(baseValue);
    }
    
    // QRS complex (sharp downward then upward spike)
    pattern.push(baseValue - (amplitude * 0.3)); // Q wave
    pattern.push(baseValue + amplitude);         // R wave (peak)
    pattern.push(baseValue - (amplitude * 0.2)); // S wave
    
    // ST segment (brief flat line)
    for (let i = 0; i < 5; i++) {
        pattern.push(baseValue);
    }
    
    // T wave (rounded upward deflection)
    for (let i = 0; i < 15; i++) {
        pattern.push(baseValue + (amplitude * 0.4 * Math.sin(i * Math.PI / 15)));
    }
    
    // TP segment (return to baseline)
    for (let i = 0; i < 15; i++) {
        pattern.push(baseValue);
    }
    
    return pattern;
}

// Generate brain wave patterns for Gmail visualization
function generateBrainwavePattern(baseValue, amplitude, complexity) {
    const pattern = [];
    const length = 60; // Length of the pattern
    
    for (let i = 0; i < length; i++) {
        // Combine multiple sine waves with different frequencies
        let value = baseValue;
        value += amplitude * 0.7 * Math.sin(i * 0.2);
        value += amplitude * 0.2 * Math.sin(i * 0.5);
        
        // Add more complexity based on the complexity parameter
        if (complexity > 0.3) {
            value += amplitude * 0.3 * Math.sin(i * 0.8);
        }
        if (complexity > 0.6) {
            value += amplitude * 0.15 * Math.sin(i * 1.2);
            value += amplitude * 0.1 * Math.random(); // Add some noise
        }
        if (complexity > 0.9) {
            value += amplitude * 0.2 * Math.sin(i * 2);
            value += amplitude * 0.2 * Math.random(); // Add more noise
        }
        
        pattern.push(value);
    }
    
    return pattern;
}

// Generate glitch patterns for Search visualization
function generateGlitchPattern(baseValue, intensity) {
    const pattern = [];
    const length = 30; // Length of the pattern
    
    for (let i = 0; i < length; i++) {
        if (Math.random() < 0.1 * intensity) {
            // Create a vertical spike (glitch)
            pattern.push(baseValue + (Math.random() * 50 * intensity));
        } else {
            // Normal baseline with small variations
            pattern.push(baseValue + (Math.random() * 2 - 1));
        }
    }
    
    return pattern;
}

// Create ECG patterns for each data point
const heartbeatPatterns = ecgData.drive.map(point => {
    // Scale the amplitude based on the count value
    const amplitude = point.count * 1.5;
    const baseValue = 150; // Baseline position on canvas
    return generateHeartbeatPattern(baseValue, amplitude);
});

const brainwavePatterns = ecgData.gmail.map(point => {
    // Scale the amplitude based on the count value
    const amplitude = point.count * 1.2;
    const baseValue = 150; // Baseline position on canvas
    const complexity = point.count / 20; // Normalize complexity
    return generateBrainwavePattern(baseValue, amplitude, complexity);
});

const glitchPatterns = ecgData.search.map(point => {
    // Scale the intensity based on the count value
    const intensity = point.count > 0 ? 1 : 0;
    const baseValue = 150; // Baseline position on canvas
    return generateGlitchPattern(baseValue, intensity);
});
