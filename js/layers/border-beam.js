// Border Beam Animation
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const cards = document.querySelectorAll('.feature-card');
        
        cards.forEach(card => {
            const canvas = document.createElement('canvas');
            canvas.className = 'border-beam-canvas';
            canvas.style.cssText = 'position: absolute; inset: 0; pointer-events: none; z-index: 1;';
            card.appendChild(canvas);
            
            const ctx = canvas.getContext('2d');
            const rect = card.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            
            let offset = 0;
            const speed = 0.1;
            const beamLength = 200;
            
            function drawBeam() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                const perimeter = (canvas.width + canvas.height) * 2;
                const position = (offset * perimeter) % perimeter;
                
                const gradient = ctx.createLinearGradient(0, 0, beamLength, 0);
                gradient.addColorStop(0, 'transparent');
                gradient.addColorStop(0.5, '#2aff00');
                gradient.addColorStop(1, 'transparent');
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.beginPath();
                
                // Draw along perimeter
                if (position < canvas.width) {
                    // Top edge
                    ctx.moveTo(position, 0);
                    ctx.lineTo(Math.min(position + beamLength, canvas.width), 0);
                } else if (position < canvas.width + canvas.height) {
                    // Right edge
                    const y = position - canvas.width;
                    ctx.moveTo(canvas.width, y);
                    ctx.lineTo(canvas.width, Math.min(y + beamLength, canvas.height));
                } else if (position < canvas.width * 2 + canvas.height) {
                    // Bottom edge
                    const x = canvas.width - (position - canvas.width - canvas.height);
                    ctx.moveTo(x, canvas.height);
                    ctx.lineTo(Math.max(x - beamLength, 0), canvas.height);
                } else {
                    // Left edge
                    const y = canvas.height - (position - canvas.width * 2 - canvas.height);
                    ctx.moveTo(0, y);
                    ctx.lineTo(0, Math.max(y - beamLength, 0));
                }
                
                ctx.stroke();
                
                offset += speed;
                requestAnimationFrame(drawBeam);
            }
            
            drawBeam();
        });
    });
})();