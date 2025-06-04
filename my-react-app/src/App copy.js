import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Nord Color Palette (Approximate Hex Color Codes)
const nordColors = {
  polarNight0: '#2E3440', // Darkest background
  polarNight1: '#3B4252', // Darker background
  polarNight2: '#434C5E', // Medium dark background
  polarNight3: '#4C566A', // Slightly lighter dark background
  snowStorm0: '#D8DEE9', // Light text
  snowStorm1: '#E5E9F0', // Lighter text
  snowStorm2: '#ECEFF4', // Lightest text
  frost0: '#8FBCBB',   // Accent blue-green
  frost1: '#88C0D0',   // Accent light blue
  frost2: '#81A1C1',   // Accent blue
  frost3: '#5E81AC',   // Accent dark blue
  auroraRed: '#BF616A',    // Red accent
  auroraOrange: '#D08770', // Orange accent
  auroraYellow: '#EBCB8B', // Yellow accent
  auroraGreen: '#A3BE8C',  // Green accent
  auroraPurple: '#B48EAD', // Purple accent
};

// Main App Component
function App() {
  const mountRef = useRef(null); // Reference for mounting the Three.js canvas
  const [loading, setLoading] = useState(true); // Loading state
  const [userId, setUserId] = useState(null); // User ID

  // Since Firebase-related code is removed, userId is generated randomly on mount
  useEffect(() => {
    setUserId(crypto.randomUUID()); // Generate a unique ID
  }, []);

  // Three.js Scene Setup
  useEffect(() => {
    // Early exit if mountRef is not yet available, or if already initialized to prevent duplicates
    if (!mountRef.current) {
      console.log("mountRef.current is null on initial render, waiting for DOM.");
      return;
    }
    // Check if a canvas element already exists within the mountRef.current
    if (mountRef.current.querySelector('canvas')) {
      console.warn('Three.js canvas already exists. Skipping re-initialization.');
      setLoading(false); // Ensure loading state is false if skipping
      return;
    }

    let scene, camera, renderer, controls, earth, clouds, particles;
    let animationFrameId; // Animation frame ID

    const textureLoader = new THREE.TextureLoader();

    // IMPORTANT: Replace these placeholder URLs with actual Earth textures.
    // You can find high-quality, free textures from sources like NASA, ESA, or Solar System Scope.
    const earthDayMapUrl = 'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg';
    const earthNightMapUrl = 'https://www.solarsystemscope.com/textures/download/2k_earth_nightmap.jpg';
    const earthCloudsMapUrl = 'https://www.solarsystemscope.com/textures/download/2k_earth_clouds.png';
    const earthBumpMapUrl = 'https://www.solarsystemscope.com/textures/download/2k_earth_elevation.jpg'; // Bump map for terrain
    const earthSpecularMapUrl = 'https://www.solarsystemscope.com/textures/download/2k_earth_specular.jpg'; // Specular map for water highlights
    const earthNormalMapUrl = 'https://www.solarsystemscope.com/textures/download/2k_earth_normal.jpg'; // Normal map for detailed lighting

    // Define onWindowResize here, before it's used
    const onWindowResize = () => {
      if (camera && renderer) { // Add checks to ensure camera and renderer are defined
        camera.aspect = window.innerWidth / window.innerHeight; // Update aspect ratio
        camera.updateProjectionMatrix(); // Update projection matrix
        renderer.setSize(window.innerWidth, window.innerHeight); // Update renderer size
      }
    };

    // Function to initialize the Three.js scene
    const init = (dayMap, nightMap, cloudsMap, bumpMap, specularMap, normalMap) => {
      // Create Scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(nordColors.polarNight0); // Dark background color

      // Camera
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 3; // Position camera closer to see details

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true }); // Enable antialiasing
      renderer.setPixelRatio(window.devicePixelRatio); // Set rendering pixel ratio
      renderer.setSize(window.innerWidth, window.innerHeight); // Set renderer size

      // Only append if not already appended
      if (!mountRef.current.querySelector('canvas')) {
        mountRef.current.appendChild(renderer.domElement); // Add canvas to DOM
      }

      // Controls (to allow mouse interaction with camera)
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true; // Enable damping (inertia) which requires an animation loop
      controls.dampingFactor = 0.05;
      controls.screenSpacePanning = false; // Disable screen-space panning
      controls.minDistance = 2; // Minimum camera distance
      controls.maxDistance = 10; // Maximum camera distance
      controls.maxPolarAngle = Math.PI / 2; // Restrict camera from going below "ground"

      // Earth Mesh (using MeshStandardMaterial for realistic lighting)
      const earthGeometry = new THREE.SphereGeometry(1.5, 64, 64); // Sphere geometry
      const earthMaterial = new THREE.MeshStandardMaterial({
        map: dayMap, // Day map texture
        emissiveMap: nightMap, // Night map for city lights
        emissiveIntensity: 0.8, // Intensity of city lights
        emissive: new THREE.Color(0xffffff), // Emissive color
        roughness: 0.6, // Surface roughness (adjust for desired effect)
        metalness: 0.1, // Metallic properties
        bumpMap: bumpMap, // Bump map for terrain
        bumpScale: 0.1, // Adjust bump scale for desired effect
        specularMap: specularMap, // Specular map for water highlights
        specular: new THREE.Color(0x333333), // Color of specular highlights
        normalMap: normalMap, // Normal map for detailed lighting
      });
      earth = new THREE.Mesh(earthGeometry, dayMap ? earthMaterial : new THREE.MeshPhongMaterial({ color: new THREE.Color(nordColors.frost3) }));
      scene.add(earth); // Add Earth to scene

      // Cloud Mesh (slightly larger and transparent)
      const cloudsGeometry = new THREE.SphereGeometry(1.51, 64, 64); // Slightly larger than Earth
      const cloudsMaterial = new THREE.MeshStandardMaterial({
        map: cloudsMap, // Cloud texture
        transparent: true, // Enable transparency
        opacity: 0.6, // Adjust cloud opacity
        blending: THREE.AdditiveBlending, // Additive blending for clouds
        alphaMap: cloudsMap, // Use clouds map for alpha channel (transparency)
      });
      clouds = new THREE.Mesh(cloudsGeometry, cloudsMap ? cloudsMaterial : new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })); // Fallback if no cloud map
      scene.add(clouds);

      // Lights
      const ambientLight = new THREE.AmbientLight(nordColors.snowStorm0, 0.3); // Soft ambient light
      scene.add(ambientLight);

      const sunLight = new THREE.DirectionalLight(0xffffff, 1.5); // Strong directional light for "sun"
      sunLight.position.set(5, 0, 5).normalize(); // Position of the sun
      scene.add(sunLight);

      // Particle System (representing "data" or "atmosphere" in remote sensing)
      const particleCount = 1000; // Number of particles
      const particleGeometry = new THREE.BufferGeometry();
      const positions = []; // Position data
      const colors = []; // Color data
      const colorPalette = [ // Particle color palette
        new THREE.Color(nordColors.frost0),
        new THREE.Color(nordColors.frost1),
        new THREE.Color(nordColors.frost2),
        new THREE.Color(nordColors.auroraGreen),
        new THREE.Color(nordColors.auroraPurple),
      ];

      for (let i = 0; i < particleCount; i++) {
        // Generate random positions around the Earth, further out than clouds
        const radius = 2.5 + Math.random() * 2; // Outer radius
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        positions.push(x, y, z);

        // Select a random color from the palette
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors.push(color.r, color.g, color.b);
      }

      particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); // Set position attribute
      particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3)); // Set color attribute

      const particleMaterial = new THREE.PointsMaterial({
        size: 0.05, // Particle size
        vertexColors: true, // Use vertex colors
        transparent: true, // Enable transparency
        opacity: 0.7, // Opacity
        blending: THREE.AdditiveBlending, // Additive blending
      });
      particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles); // Add particles to scene

      setLoading(false); // Loading complete
    };

    // Animation Loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate); // Request next frame

      if (earth) {
        earth.rotation.y += 0.001; // Slower, continuous Earth rotation
      }
      if (clouds) {
        clouds.rotation.y += 0.0012; // Clouds rotate slightly faster than Earth
      }
      if (particles) {
        particles.rotation.y += 0.0005; // Slower rotation of particles
      }

      if (controls && renderer && camera) { // Add checks before update and render
        controls.update(); // Update controls (required when damping is enabled)
        renderer.render(scene, camera); // Render the scene
      }
    };

    // Load textures and then initialize the scene
    setLoading(true); // Ensure loading state is true before starting texture load
    Promise.all([
      textureLoader.loadAsync(earthDayMapUrl),
      textureLoader.loadAsync(earthNightMapUrl),
      textureLoader.loadAsync(earthCloudsMapUrl),
      textureLoader.loadAsync(earthBumpMapUrl), // Load bump map
      textureLoader.loadAsync(earthSpecularMapUrl), // Load specular map
      textureLoader.loadAsync(earthNormalMapUrl) // Load normal map
    ]).then(([dayMap, nightMap, cloudsMap, bumpMap, specularMap, normalMap]) => {
      init(dayMap, nightMap, cloudsMap, bumpMap, specularMap, normalMap); // Initialize scene with loaded textures
      animate(); // ★ IMPORTANT: Start animation here after init completes
    }).catch(error => {
      console.error("Failed to load Earth textures:", error);
      setLoading(false); // Ensure loading state is false if textures fail
      // Fallback: Initialize with basic sphere if textures fail, and start animation
      init(null, null, null, null, null, null);
      animate(); // ★ IMPORTANT: Start animation even if textures fail, for basic sphere
    });

    window.addEventListener('resize', onWindowResize); // Add resize event listener

    // Cleanup (on component unmount or before re-running effect)
    return () => {
      window.removeEventListener('resize', onWindowResize); // Remove event listener
      cancelAnimationFrame(animationFrameId); // Cancel animation

      // Properly dispose of Three.js resources
      if (scene) {
        scene.traverse(object => {
          if (object.isMesh) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else if (object.material) {
              object.material.dispose();
            }
          }
        });
        // Clear scene if needed, though disposing individual objects is key
        scene = null;
      }
      if (controls) {
        controls.dispose();
        controls = null;
      }
      if (renderer) {
        // Remove the canvas element from the DOM
        if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
          mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
        renderer = null;
      }
    };
  }, []); // Run only once on component mount with empty dependency array

  return (
    <div className="relative min-h-screen font-inter overflow-hidden" style={{ backgroundColor: nordColors.polarNight0 }}>
      {/* Three.js Canvas */}
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-polarNight0 bg-opacity-90 z-20">
          <div className="text-snowStorm0 text-xl animate-pulse">
            Loading Earth...
          </div>
        </div>
      )}

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 md:p-8 text-snowStorm0">
        {/* Header */}
        <header className="w-full max-w-4xl text-center mb-12 mt-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: nordColors.snowStorm2 }}>
            <span style={{ color: nordColors.frost1 }}>[Your Name]</span>'s Homepage
          </h1>
          <p className="text-lg md:text-xl" style={{ color: nordColors.snowStorm1 }}>
            Ph.D. Student | Computer Science | Remote Sensing
          </p>
          {userId && ( // Display userId only if it exists
            <p className="text-sm mt-2" style={{ color: nordColors.snowStorm0 }}>
              User ID: {userId}
            </p>
          )}
        </header>

        {/* Main Content Sections */}
        <main className="w-full max-w-4xl space-y-12">
          {/* About Me Section */}
          <section className="bg-polarNight1 bg-opacity-70 p-6 md:p-8 rounded-xl shadow-lg border border-polarNight3 transition-all duration-300 hover:shadow-2xl hover:border-frost0">
            <h2 className="text-3xl font-semibold mb-4" style={{ color: nordColors.frost2 }}>
              About Me
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: nordColors.snowStorm0 }}>
              I am a Ph.D. student in Computer Science, focusing on developing advanced data analysis and machine learning algorithms for remote sensing data. My goal is to interpret the vast amount of information from Earth observation satellites using innovative methods to contribute to our understanding of the global environment.
            </p>
          </section>

          {/* Research Section */}
          <section className="bg-polarNight1 bg-opacity-70 p-6 md:p-8 rounded-xl shadow-lg border border-polarNight3 transition-all duration-300 hover:shadow-2xl hover:border-frost0">
            <h2 className="text-3xl font-semibold mb-4" style={{ color: nordColors.frost2 }}>
              Research
            </h2>
            <p className="text-lg leading-relaxed mb-4" style={{ color: nordColors.snowStorm0 }}>
              My research primarily spans the following areas:
            </p>
            <ul className="list-disc list-inside text-lg space-y-2" style={{ color: nordColors.snowStorm0 }}>
              <li>Deep learning for satellite image classification and segmentation</li>
              <li>Change detection from time-series remote sensing data</li>
              <li>Large-scale data processing using cloud computing and distributed systems</li>
              <li>Integration of Geographic Information Science (GIS) and Computer Vision</li>
            </ul>
            <p className="text-lg leading-relaxed mt-4" style={{ color: nordColors.snowStorm0 }}>
              For more detailed research topics and publications, please visit my <a href="#" className="underline" style={{ color: nordColors.auroraGreen }}>[Research Page Link]</a>.
            </p>
          </section>

          {/* Projects Section */}
          <section className="bg-polarNight1 bg-opacity-70 p-6 md:p-8 rounded-xl shadow-lg border border-polarNight3 transition-all duration-300 hover:shadow-2xl hover:border-frost0">
            <h2 className="text-3xl font-semibold mb-4" style={{ color: nordColors.frost2 }}>
              Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-polarNight2 p-5 rounded-lg border border-polarNight3 hover:border-frost0 transition-all duration-200">
                <h3 className="text-xl font-semibold mb-2" style={{ color: nordColors.snowStorm2 }}>
                  <a href="https://github.com/your-github/project-one" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: nordColors.auroraYellow }}>
                    [Project One Name]
                  </a>
                </h3>
                <p className="text-base" style={{ color: nordColors.snowStorm1 }}>
                  A Python tool for detecting forest cover changes from satellite imagery, utilizing TensorFlow and GDAL.
                </p>
              </div>
              <div className="bg-polarNight2 p-5 rounded-lg border border-polarNight3 hover:border-frost0 transition-all duration-200">
                <h3 className="text-xl font-semibold mb-2" style={{ color: nordColors.snowStorm2 }}>
                  <a href="https://github.com/your-github/project-two" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: nordColors.auroraYellow }}>
                    [Project Two Name]
                  </a>
                </h3>
                <p className="text-base" style={{ color: nordColors.snowStorm1 }}>
                  A web-based interactive platform for Earth observation data visualization, built with React and D3.js.
                </p>
              </div>
            </div>
            <p className="text-lg leading-relaxed mt-6" style={{ color: nordColors.snowStorm0 }}>
              You can find more of my projects on my <a href="https://github.com/your-github" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: nordColors.auroraGreen }}>GitHub profile</a>.
            </p>
          </section>

          {/* Contact Section */}
          <section className="bg-polarNight1 bg-opacity-70 p-6 md:p-8 rounded-xl shadow-lg border border-polarNight3 transition-all duration-300 hover:shadow-2xl hover:border-frost0">
            <h2 className="text-3xl font-semibold mb-4" style={{ color: nordColors.frost2 }}>
              Contact
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: nordColors.snowStorm0 }}>
              Please feel free to reach out if you have any questions or are interested in collaboration.
            </p>
            <p className="text-lg mt-4">
              Email: <a href="mailto:your.email@example.com" className="underline" style={{ color: nordColors.auroraGreen }}>your.email@example.com</a>
            </p>
          </section>
        </main>

        {/* Footer */}
        <footer className="w-full max-w-4xl text-center mt-12 py-6 text-sm" style={{ color: nordColors.snowStorm0 }}>
          <p>&copy; {new Date().getFullYear()} [Your Name]. All rights reserved.</p>
          <p>Designed with <span className="text-auroraRed">❤️</span> and Nord.js spirit.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;