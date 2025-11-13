// App Page - Beam Container Animation
(function() {
    const beamCanvas = document.getElementById('beamCanvas');
    const beamContainer = document.querySelector('.beam-container');
    
    if (!beamCanvas || !beamContainer) return;
    
    const ctx = beamCanvas.getContext('2d');
    
    function resizeCanvas() {
        beamCanvas.width = beamContainer.offsetWidth;
        beamCanvas.height = beamContainer.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    function getCirclePositions() {
        const positions = { sources: [], center: null, target: null };
        const containerRect = beamContainer.getBoundingClientRect();
        
        document.querySelectorAll('[data-beam="source"]').forEach(source => {
            const rect = source.getBoundingClientRect();
            positions.sources.push({
                x: rect.left + rect.width / 2 - containerRect.left,
                y: rect.top + rect.height / 2 - containerRect.top
            });
        });
        
        const center = document.querySelector('[data-beam="center"]');
        if (center) {
            const rect = center.getBoundingClientRect();
            positions.center = {
                x: rect.left + rect.width / 2 - containerRect.left,
                y: rect.top + rect.height / 2 - containerRect.top
            };
        }
        
        const target = document.querySelector('[data-beam="target"]');
        if (target) {
            const rect = target.getBoundingClientRect();
            positions.target = {
                x: rect.left + rect.width / 2 - containerRect.left,
                y: rect.top + rect.height / 2 - containerRect.top
            };
        }
        
        return positions;
    }
    
    let beams = [];
    const positions = getCirclePositions();
    
    positions.sources.forEach((source, i) => {
        beams.push({
            from: source,
            to: positions.center,
            progress: i * 0.2,
            speed: 0.008,
            delay: i * 0.2
        });
    });
    
    beams.push({
        from: positions.center,
        to: positions.target,
        progress: 0,
        speed: 0.008,
        delay: 1
    });
    
    function drawBeam(from, to, progress) {
        const x = from.x + (to.x - from.x) * progress;
        const y = from.y + (to.y - from.y) * progress;
        
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        const beamColor = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)';
        
        const gradient = ctx.createLinearGradient(from.x, from.y, x, y);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, beamColor);
        gradient.addColorStop(1, 'transparent');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, 4);
        glowGradient.addColorStop(0, beamColor);
        glowGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
    }
    
    function animate() {
        ctx.clearRect(0, 0, beamCanvas.width, beamCanvas.height);
        
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
    
    window.addEventListener('resize', () => {
        beamCanvas.width = beamContainer.offsetWidth;
        beamCanvas.height = beamContainer.offsetHeight;
        beams = [];
        const positions = getCirclePositions();
        
        positions.sources.forEach((source, i) => {
            beams.push({
                from: source,
                to: positions.center,
                progress: i * 0.2,
                speed: 0.008,
                delay: i * 0.2
            });
        });
        
        beams.push({
            from: positions.center,
            to: positions.target,
            progress: 0,
            speed: 0.008,
            delay: 1
        });
    });
    
    animate();
})();