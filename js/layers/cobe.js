

// Globe Animation
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const canvas = document.getElementById("cobe");
        
        if (!canvas) {
            console.error('Globe canvas not found');
            return;
        }

        import('https://cdn.skypack.dev/cobe')
            .then(module => {
                const createGlobe = module.default;
                
                let phi = 0;
                
                const globe = createGlobe(canvas, {
                    devicePixelRatio: 2,
                    width: 800,
                    height: 800,
                    phi: 0,
                    theta: 0.3,
                    dark: 1,
                    diffuse: 1.2,
                    mapSamples: 16000,
                    mapBrightness: 6,
                    baseColor: [0.3, 0.3, 0.3],
                    markerColor: [0.1, 0.8, 1],
                    glowColor: [0.16, 1, 0.5],
                    markers: [
                        { location: [37.7749, -122.4194], size: 0.05 }, // San Francisco
                        { location: [28.62696, 77.21540], size: 0.05 }, // New Delhi, India
                        { location: [40.7128, -74.0060], size: 0.05 }, // New York
                        { location: [51.5074, -0.1278], size: 0.05 }, // London
                        { location: [35.6895, 139.6917], size: 0.05 } // Tokyo
                    ],
                    onRender: (state) => {
                        phi += 0.002;
                        state.phi = phi;
                    }
                });
                
                console.log('Globe initialized successfully');
            })
            .catch(err => {
                console.error('Failed to load globe:', err);
            });
    });
})();