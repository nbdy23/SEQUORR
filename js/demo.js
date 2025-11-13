// Demo Page - Video Text Mask
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const maskDiv = document.getElementById('videoMask');
        
        if (!maskDiv) {
            console.error('Video mask element not found');
            return;
        }
        
        // Configuration
        const config = {
            text: 'SEQUORR',
            fontSize: 12, // vw units
            fontWeight: 900,
            fontFamily: 'system-ui, -apple-system, sans-serif'
        };
        
        function createSvgMask() {
            const svg = `
            <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
                <text x='50%' 
                      y='50%' 
                      font-size='${config.fontSize}vw' 
                      font-weight='${config.fontWeight}'
                      text-anchor='middle' 
                      dominant-baseline='middle' 
                      font-family='${config.fontFamily}'
                      letter-spacing='-0.05em'>
                    ${config.text}
                </text>
            </svg>
            `;
            
            const dataUrl = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
            
            maskDiv.style.maskImage = dataUrl;
            maskDiv.style.webkitMaskImage = dataUrl;
            maskDiv.style.maskSize = 'contain';
            maskDiv.style.webkitMaskSize = 'contain';
            maskDiv.style.maskRepeat = 'no-repeat';
            maskDiv.style.webkitMaskRepeat = 'no-repeat';
            maskDiv.style.maskPosition = 'center';
            maskDiv.style.webkitMaskPosition = 'center';
            
            console.log('SVG mask applied:', dataUrl);
        }
        
        // Create mask on load
        createSvgMask();
        
        // Update on window resize
        window.addEventListener('resize', createSvgMask);
        
        // Ensure video plays
        const video = maskDiv.querySelector('video');
        if (video) {
            video.play().catch(err => {
                console.log('Autoplay prevented:', err);
            });
        }
    });
})();