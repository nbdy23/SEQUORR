// Animated Beam Effect - DEBUG VERSION
(function() {
    const beamCanvas = document.getElementById('beamCanvas');
    const beamContainer = document.getElementById('beamContainer');

    if (!beamCanvas || !beamContainer) {
        console.log('Beam elements not found');
        return;
    }

    const ctx = beamCanvas.getContext('2d');
    let isMobile = window.innerWidth < 768;
    let beams = [];
    let debugCenter = null; // Store center for debugging
    
    function resizeCanvas() {
        const prevMobile = isMobile;
        isMobile = window.innerWidth < 768;
        
        beamCanvas.width = beamContainer.offsetWidth;
        beamCanvas.height = beamContainer.offsetHeight;
        
        if (prevMobile !== isMobile) {
            initBeams();
        }
    }
    
    function getCirclePositions() {
        const sources = document.querySelectorAll('[data-beam="source"]');
        const center = document.querySelector('[data-beam="center"]');
        const target = document.querySelector('[data-beam="target"]');
        
        const containerRect = beamContainer.getBoundingClientRect();
        const positions = { sources: [], center: null, target: null };
        
        console.log('\n========== POSITION CALCULATION ==========');
        console.log('Container:', containerRect);
        console.log('isMobile:', isMobile);
        
        // Get visible source positions
        const visibleSources = [];
        sources.forEach((source, index) => {
            const isVisible = window.getComputedStyle(source).display !== 'none';
            
            if (!isVisible || (isMobile && index >= 3)) {
                return;
            }
            
            const rect = source.getBoundingClientRect();
            const pos = {
                x: rect.left + rect.width / 2 - containerRect.left,
                y: rect.top + rect.height / 2 - containerRect.top
            };
            
            visibleSources.push(pos);
            positions.sources.push(pos);
            console.log(`Source ${index}: x=${pos.x.toFixed(2)}, y=${pos.y.toFixed(2)}`);
        });
        
        if (visibleSources.length > 0) {
            // Calculate bounding box
            const xs = visibleSources.map(s => s.x);
            const ys = visibleSources.map(s => s.y);
            
            const minX = Math.min(...xs);
            const maxX = Math.max(...xs);
            const minY = Math.min(...ys);
            const maxY = Math.max(...ys);
            
            console.log('X range:', minX.toFixed(2), 'to', maxX.toFixed(2));
            console.log('Y range:', minY.toFixed(2), 'to', maxY.toFixed(2));
            
            // Calculate geometric center
            const geoCenterX = (minX + maxX) / 2;
            const geoCenterY = (minY + maxY) / 2;
            
            console.log('Geometric center:', geoCenterX.toFixed(2), geoCenterY.toFixed(2));
            
            // Get actual center element position
            if (center) {
                const rect = center.getBoundingClientRect();
                const actualX = rect.left + rect.width / 2 - containerRect.left;
                const actualY = rect.top + rect.height / 2 - containerRect.top;
                
                console.log('Actual center element:', actualX.toFixed(2), actualY.toFixed(2));
                
                // Desktop: use actual center
                // Mobile: use geometric center Y, actual X
                if (isMobile) {
                    positions.center = {
                        x: actualX,
                        y: geoCenterY // Use calculated Y
                    };
                    console.log('MOBILE: Using actual X, geometric Y');
                } else {
                    positions.center = {
                        x: actualX,
                        y: actualY
                    };
                    console.log('DESKTOP: Using actual center');
                }
            } else {
                // No center element, use pure geometric center
                positions.center = {
                    x: geoCenterX,
                    y: geoCenterY
                };
            }
            
            console.log('Final center:', positions.center.x.toFixed(2), positions.center.y.toFixed(2));
            
            // Store for debug visualization
            debugCenter = { ...positions.center };
        }
        
        // Get target
        if (target) {
            const rect = target.getBoundingClientRect();
            let targetX = rect.left + rect.width / 2 - containerRect.left;
            let targetY = rect.top + rect.height / 2 - containerRect.top;
            
            console.log('Target actual:', targetX.toFixed(2), targetY.toFixed(2));
            
            // Align target Y with center Y on mobile
            if (isMobile && positions.center) {
                targetY = positions.center.y;
                console.log('Target adjusted:', targetX.toFixed(2), targetY.toFixed(2));
            }
            
            positions.target = { x: targetX, y: targetY };
        }
        
        console.log('==========================================\n');
        
        return positions;
    }
    
    function initBeams() {
        setTimeout(() => {
            beams = [];
            const positions = getCirclePositions();
            
            if (!positions.center) {
                console.error('No center calculated!');
                return;
            }
            
            console.log('\n========== CREATING BEAMS ==========');
            
            // CORRECT DIRECTION: FROM SOURCES TO CENTER (left to right)
            positions.sources.forEach((source, i) => {
                beams.push({
                    from: { x: source.x, y: source.y },           // START at source
                    to: { x: positions.center.x, y: positions.center.y },  // END at center
                    progress: i * 0.15,
                    speed: 0.007,
                    delay: i * 0.15
                });
                
                console.log(`Beam ${i}: Source (${source.x.toFixed(1)}, ${source.y.toFixed(1)}) → CENTER (${positions.center.x.toFixed(1)}, ${positions.center.y.toFixed(1)})`);
            });
            
            // Beam from center to target (center to right)
            if (positions.target) {
                beams.push({
                    from: { x: positions.center.x, y: positions.center.y },
                    to: { x: positions.target.x, y: positions.target.y },
                    progress: 0,
                    speed: 0.007,
                    delay: 0.5
                });
                
                console.log(`Beam center→target: (${positions.center.x.toFixed(1)}, ${positions.center.y.toFixed(1)}) → (${positions.target.x.toFixed(1)}, ${positions.target.y.toFixed(1)})`);
            }
            
            console.log('Total beams:', beams.length);
            console.log('===================================\n');
            
        }, 300);
    }
    
    function drawBeam(from, to, progress) {
        if (!from || !to) return;
        
        const x = from.x + (to.x - from.x) * progress;
        const y = from.y + (to.y - from.y) * progress;
        
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        const beamColor = isDark ? 'rgba(42, 255, 0, 0.6)' : 'rgba(42, 255, 0, 0.8)';
        
        const gradient = ctx.createLinearGradient(from.x, from.y, x, y);
        gradient.addColorStop(0, beamColor);
        gradient.addColorStop(1, 'rgba(42, 255, 0, 0)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, 10);
        glowGradient.addColorStop(0, 'rgba(42, 255, 0, 1)');
        glowGradient.addColorStop(1, 'rgba(42, 255, 0, 0)');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
    }
    
    function animate() {
        ctx.clearRect(0, 0, beamCanvas.width, beamCanvas.height);
        
        // Draw beams
        beams.forEach(beam => {
            if (beam.progress >= beam.delay) {
                const adjustedProgress = Math.min((beam.progress - beam.delay) / (1 - beam.delay), 1);
                drawBeam(beam.from, beam.to, adjustedProgress);
            }
            
            beam.progress += beam.speed;
            if (beam.progress > 1 + beam.delay) {
                beam.progress = 0;
            }
        });
        
        requestAnimationFrame(animate);
    }
    
    resizeCanvas();
    initBeams();
    animate();
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resizeCanvas();
            initBeams();
        }, 300);
    });
})();