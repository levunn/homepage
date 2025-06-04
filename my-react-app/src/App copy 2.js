import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import earthDayMap from './assets/textures/earth_atmos_2048.jpg';
import earthNightMap from './assets/textures/earth_lights_2048.png';
import earthCloudsMap from './assets/textures/earth_clouds_1024.png';
import earthSpecularMap from './assets/textures/earth_specular_2048.jpg';
import earthNormalMap from './assets/textures/earth_normal_2048.jpg';

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
  const [currentPage, setCurrentPage] = useState('home'); // State to manage current page

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

    // ★ ここが更新されたテクスチャURLです。Three.jsの公式サンプルで使われている信頼性の高いURLです。
    // const earthDayMapUrl = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_atmos_2048.jpg';
    // const earthNightMapUrl = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_lights_2048.png';
    // const earthCloudsMapUrl = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_clouds_1024.png';
    // // const earthBumpMapUrl = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_bump_2048.jpg'; // Bump map for terrain
    // const earthSpecularMapUrl = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_specular_2048.jpg'; // Specular map for water highlights
    // const earthNormalMapUrl = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_normal_2048.jpg'; // Normal map for detailed lighting
    const earthDayMapUrl = earthDayMap;
    const earthNightMapUrl = earthNightMap;
    const earthCloudsMapUrl = earthCloudsMap;
    // const earthBumpMapUrl = earthBumpMap; // もしBumpMapを使うなら
    const earthSpecularMapUrl = earthSpecularMap;
    const earthNormalMapUrl = earthNormalMap;


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
      const earthGeometry = new THREE.SphereGeometry(1.5, 64, 64);
      const earthMaterial = new THREE.MeshStandardMaterial({
        map: dayMap,
        emissiveMap: nightMap,
        emissiveIntensity: 0.8,
        emissive: new THREE.Color(0xffffff),
        roughness: 0.3, // 光沢感を増して、水面をより際立たせる (例: 0.8から0.3へ)
        metalness: 0.0,
        specularMap: specularMap,
        specular: new THREE.Color(nordColors.frost1), // 水面の光沢の色を水色にする
        normalMap: normalMap,
        normalScale: new THREE.Vector2(1, 1),
      });
      earth = new THREE.Mesh(earthGeometry, dayMap ? earthMaterial : new THREE.MeshPhongMaterial({ color: new THREE.Color(nordColors.frost3) }));
      scene.add(earth);

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
// Animation Loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (earth) {
        earth.rotation.y += 0.001; // 0.001 から 0.003 に増加 (もっと速くてもよい) [adjusted]
      }
      if (clouds) {
        clouds.rotation.y += 0.0015; // 地球より少し速く [adjusted]
      }
      if (particles) {
        particles.rotation.y += 0.0005; // パーティクルは遅め [adjusted]
      }

      if (controls && renderer && camera) {
        controls.update();
        renderer.render(scene, camera);
      }
    };

    // Load textures and then initialize the scene
    setLoading(true); // Ensure loading state is true before starting texture load
    Promise.all([
      textureLoader.loadAsync(earthDayMapUrl),
      textureLoader.loadAsync(earthNightMapUrl),
      textureLoader.loadAsync(earthCloudsMapUrl),
      // earthBumpMapUrl はここから削除
      textureLoader.loadAsync(earthSpecularMapUrl),
      textureLoader.loadAsync(earthNormalMapUrl)
    ]).then(([dayMap, nightMap, cloudsMap, specularMap, normalMap]) => { // bumpMapが削除された
      init(dayMap, nightMap, cloudsMap, null, specularMap, normalMap); // init関数への引数も変更（bumpMapの代わりにnullを渡す）
      animate();
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

  // Function to render content based on current page
  const renderPageContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            {/* About Me Section */}
            <section className="bg-polarNight1 bg-opacity-70 p-6 md:p-8 rounded-xl shadow-lg border border-polarNight3 transition-all duration-300 hover:shadow-2xl hover:border-frost0">
              <h2 className="text-3xl font-semibold mb-4" style={{ color: nordColors.frost2 }}>
                About Me
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: nordColors.snowStorm0 }}>
                I am a Ph.D. student in Computer Science and Engineering at The University of Nevada, Reno, with a GPA of 4.0/4.0. My research primarily focuses on wildfire monitoring and prediction using computer vision, and efficient AI with a focus on data points.
                I hold a Master's and Bachelor's degree in Aeronautics and Astronautics from The University of Tokyo, where I gained valuable experience in cross-view geo-localization and satellite image analysis.
                For more details on my academic journey, please visit the <span className="underline cursor-pointer" style={{ color: nordColors.auroraGreen }} onClick={() => setCurrentPage('education')}>Education</span> page, and for my professional experiences, check the <span className="underline cursor-pointer" style={{ color: nordColors.auroraGreen }} onClick={() => setCurrentPage('experience')}>Experience</span> page.
              </p>
            </section>

            {/* Research Section */}
            <section className="bg-polarNight1 bg-opacity-70 p-6 md:p-8 rounded-xl shadow-lg border border-polarNight3 transition-all duration-300 hover:shadow-2xl hover:border-frost0">
              <h2 className="text-3xl font-semibold mb-4" style={{ color: nordColors.frost2 }}>
                Research
              </h2>
              <ul className="list-disc list-inside text-lg space-y-3" style={{ color: nordColors.snowStorm0 }}>
                <li>
                  **Dataset Pruning for Object Detection:** Extended Dataset Pruning techniques beyond image classification to object detection, demonstrating applicability and strong correlations between pruned dataset's accuracy and factors like class distribution difference and the number of annotations.
                </li>
                <li>
                  **Dataset Distillation with Diffusion Model:** Explored Dataset Distillation using a generative approach with Stable Diffusion to approximate data distribution with optimized synthetic images. Successfully represented class-wise prototypes and enhanced intra-class diversity.
                </li>
                <li>
                  **Radiology Report Generation Model (JRadiEvo):** Proposed JRadiEvo, a Japanese radiology report generation model adapting non-medical VLMs to the medical domain with only 50 samples, achieving superior performance over CheXagent under few-shot settings. Designed a lightweight 800M-parameter model suitable for local deployment.
                </li>
                <li>
                  **UAV Anomaly Detection Project:** Implemented the parallelization of 10 temperature sensors as part of an engineering group.
                </li>
                <li>
                  **Hyperspectral HISUI Data Analysis Project:** Simulated CO2 properties using MODTRAN and surveyed methods for using hyperspectral data from HISUI for Canopy Nitrogen Contents (CNC).
                </li>
                <li>
                  **Simulation of Visual Navigation for UAVs:** Researched simulation of visual navigation for UAVs using reinforcement learning, proposing rewards for better accuracy.
                </li>
                <li>
                  **Satellite Image Analysis (R&D Engineer):** Implemented a random forest algorithm for land classification using Google Earth Engine, outperforming the standard method, Dynamic World.
                </li>
                <li>
                  **Two-streamed GAN for Aerial and Street Images:** Proposed a two-streamed GAN to bridge the gap between aerial and street images, achieving better accuracy than single-towered GANs.
                </li>
              </ul>
            </section>

            {/* Publications Section */}
            <section className="bg-polarNight1 bg-opacity-70 p-6 md:p-8 rounded-xl shadow-lg border border-polarNight3 transition-all duration-300 hover:shadow-2xl hover:border-frost0">
              <h2 className="text-3xl font-semibold mb-4" style={{ color: nordColors.frost2 }}>
                Publications
              </h2>
              <ul className="list-disc list-inside text-lg space-y-3" style={{ color: nordColors.snowStorm0 }}>
                <li>
                  Yagi R. (2025, May). *Extending Dataset Pruning to Object Detection: A Variance-based Approach*. arXiv preprint arXiv:2505.17245, under review at NeurIPS, May 2025.
                </li>
                <li>
                  Baba, K., Yagi R., Takahashi J., Kishikawa R., Kodera S. (2024, November). *JRadiEvo: A Japanese Radiology Report Generation Model Enhanced by Evolutionary Optimization of Model Merging*. NeurIPS 2024 Workshop on AIM-FM: Advancements In Medical Foundation Models: Explainability, Robustness, Security, and Beyond. Vancouver, Canada (Poster Presentation).
                </li>
                <li>
                  Yagi, R., Yairi, T., & Iwasaki, A. (2023, November). *Navigating the Metaverse: UAV-Based Cross-View Geo-Localization in Virtual Worlds*. In Proceedings of the 2023 ACM Multimedia Workshop on UAVs in Multimedia: Capturing the World from a New Perspective (pp. 13-17) Ottawa, Canada (Poster Presentation).
                </li>
                <li>
                  Yagi, R., & Iwasaki, A. (2023, July). *Lightweight CNN for Cross-View Geo-Localization Using Aerial Image*. In IGARSS 2023-2023 IEEE International Geoscience and Remote Sensing Symposium (pp. 6266-6269). IEEE Pasadena, USA. (Poster Presentation).
                </li>
                <li>
                  Yagi, R., & Iwasaki, A. (2022, May). *Fault Displacement Estimation from Satellite Imagery*. In ISRS International Symposium on Remote Sensing. Online. (Oral Presentation).
                </li>
              </ul>
            </section>

            {/* Projects Section */}
            <section className="bg-polarNight1 bg-opacity-70 p-6 md:p-8 rounded-xl shadow-lg border border-polarNight3 transition-all duration-300 hover:shadow-2xl hover:border-frost0">
              <h2 className="text-3xl font-semibold mb-4" style={{ color: nordColors.frost2 }}>
                Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-polarNight2 p-5 rounded-lg border border-polarNight3 hover:border-frost0 transition-all duration-200">
                  <h3 className="text-xl font-semibold mb-2" style={{ color: nordColors.snowStorm2 }}>
                    <a href="https://teamisshin.com/" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: nordColors.auroraYellow }}>
                      International Historic Car Rally Project
                    </a>
                  </h3>
                  <p className="text-base" style={{ color: nordColors.snowStorm1 }}>
                    Managed PR and Logistics, secured over $20,000 in sponsorship, and developed the project website with nearly 50 articles on project status. Created a system to manage over 1,000 parts.
                  </p>
                </div>
                <div className="bg-polarNight2 p-5 rounded-lg border border-polarNight3 hover:border-frost0 transition-all duration-200">
                  <h3 className="text-xl font-semibold mb-2" style={{ color: nordColors.snowStorm2 }}>
                    Matsushita Lab Technical Staff
                  </h3>
                  <p className="text-base" style={{ color: nordColors.snowStorm1 }}>
                    Worked on website updates and content editing, and developed software content for an online test for Japanese language acquisition.
                  </p>
                </div>
              </div>
              <p className="text-lg leading-relaxed mt-6" style={{ color: nordColors.snowStorm0 }}>
                You can find more of my work and contributions on my <a href="https://github.com/your-github-profile" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: nordColors.auroraGreen }}>GitHub profile</a>.
                {/* IMPORTANT: Please replace "https://github.com/your-github-profile" with your actual GitHub profile URL. */}
              </p>
            </section>

            {/* Skills Section */}
            <section className="bg-polarNight1 bg-opacity-70 p-6 md:p-8 rounded-xl shadow-lg border border-polarNight3 transition-all duration-300 hover:shadow-2xl hover:border-frost0">
              <h2 className="text-3xl font-semibold mb-4" style={{ color: nordColors.frost2 }}>
                Skills
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-lg" style={{ color: nordColors.snowStorm0 }}>
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: nordColors.frost1 }}>Programming</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Python</li>
                    <li>MATLAB</li>
                    <li>C/C++</li>
                    <li>JavaScript</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: nordColors.frost1 }}>Libraries & Services</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Pytorch</li>
                    <li>Pytorch Lightning</li>
                    <li>Tensorflow</li>
                    <li>Linux</li>
                    <li>Docker</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: nordColors.frost1 }}>Professional Software</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>QGIS</li>
                    <li>Google Earth Engine</li>
                    <li>3DCAD</li>
                  </ul>
                </div>
              </div>
            </section>
          </>
        );
      case 'education':
        return (
          <section className="bg-polarNight1 bg-opacity-70 p-6 md:p-8 rounded-xl shadow-lg border border-polarNight3">
            <h2 className="text-3xl font-semibold mb-4" style={{ color: nordColors.frost2 }}>
              Education
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold" style={{ color: nordColors.snowStorm2 }}>DEng, The University of Nevada, Reno</h3>
                <p className="text-lg" style={{ color: nordColors.snowStorm1 }}>Department of Computer Science and Engineering, Graduate School of Engineering</p>
                <p className="text-md" style={{ color: nordColors.snowStorm0 }}>Aug. 2024 - Present</p>
                <ul className="list-disc list-inside text-base mt-2 space-y-1" style={{ color: nordColors.snowStorm0 }}>
                  <li>Advisor: Prof. George Bebis, Co-Advisors: Prof. Hamed Ebrahimian, Prof. Dani Or</li>
                  <li>Focus: Wildfire monitoring, prediction using computer vision.</li>
                  <li>Advisor: Prof. Ping Liu (Aug. 2024 - Apr. 2025)</li>
                  <li>Focus: Efficient AI mainly focuses on efficient AI which is focused on datapoints.</li>
                  <li>GPA: $4.0/4.0$</li>
                  <li>Relevant Coursework: Advanced Computer Vision, Analysis of Algorithm, Operating System</li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-semibold" style={{ color: nordColors.snowStorm2 }}>MEng, The University of Tokyo</h3>
                <p className="text-lg" style={{ color: nordColors.snowStorm1 }}>Department of Aeronautics and Astronautics, Graduate School of Engineering</p>
                <p className="text-md" style={{ color: nordColors.snowStorm0 }}>Apr. 2022 - Mar. 2024</p>
                <ul className="list-disc list-inside text-base mt-2 space-y-1" style={{ color: nordColors.snowStorm0 }}>
                  <li>Advisors: Prof. Takehisa Yairi, Prof. Akira Iwasaki</li>
                  <li>GPA: 3.94/4.0</li>
                  <li>Thesis Title: "Ground Image Localization Using Aerial image"</li>
                  <li>Contributed to the development of a lightweight CNN architecture for cross-view geo-localization.</li>
                  <li>Created a dataset for UAV cross-view geo-localization using a virtual environment.</li>
                  <li>Relevant Coursework: Computer Vision, Deep Learning, Artificial Intelligence, Remote Sensing, Computational Linguistics, Image Media Technologies, Written and Spoken Language Information Processing, Picture Processing</li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-semibold" style={{ color: nordColors.snowStorm2 }}>BEng, The University of Tokyo</h3>
                <p className="text-lg" style={{ color: nordColors.snowStorm1 }}>Department of Aeronautics and Astronautics, School of Engineering</p>
                <p className="text-md" style={{ color: nordColors.snowStorm0 }}>Apr. 2018 - Mar. 2022</p>
                <ul className="list-disc list-inside text-base mt-2 space-y-1" style={{ color: nordColors.snowStorm0 }}>
                  <li>Advisor: Prof. Akira Iwasaki</li>
                  <li>GPA: $3.71/4.0$ (Major GPA)</li>
                  <li>Thesis Title: "Misalignment Estimation of Satellite Images by Statistical Similarity"</li>
                  <li>Employed mutual information to define similarity, resulting in reduced variation in displacement measurements.</li>
                  <li>Relevant Coursework: Mathematics (calculus, linear algebra, complex analysis, Fourier series etc.), Remote Sensing, Aerospace Information System, Numerical Computation, Design of Rocket Engine</li>
                </ul>
              </div>
            </div>
          </section>
        );
      case 'experience':
        return (
          <section className="bg-polarNight1 bg-opacity-70 p-6 md:p-8 rounded-xl shadow-lg border border-polarNight3">
            <h2 className="text-3xl font-semibold mb-4" style={{ color: nordColors.frost2 }}>
              Experience
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold" style={{ color: nordColors.snowStorm2 }}>HELIOS (Online)</h3>
                <p className="text-lg" style={{ color: nordColors.snowStorm1 }}>AI Advisor</p>
                <p className="text-md" style={{ color: nordColors.snowStorm0 }}>Oct. 2024 - Present</p>
                <ul className="list-disc list-inside text-base mt-2 space-y-1" style={{ color: nordColors.snowStorm0 }}>
                  <li>Offering AI and Remote Sensing expertise and skills to engineers on a voluntary basis.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-semibold" style={{ color: nordColors.snowStorm2 }}>Kodera Lab, The University of Tokyo (Tokyo, Japan)</h3>
                <p className="text-lg" style={{ color: nordColors.snowStorm1 }}>AI Engineer</p>
                <p className="text-md" style={{ color: nordColors.snowStorm0 }}>Feb. 2024 - Aug. 2024</p>
                <ul className="list-disc list-inside text-base mt-2 space-y-1" style={{ color: nordColors.snowStorm0 }}>
                  <li>Engaging in the development of a large language model (LLM) for medical applications.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-semibold" style={{ color: nordColors.snowStorm2 }}>Washington University in St. Louis (Missouri, USA)</h3>
                <p className="text-lg" style={{ color: nordColors.snowStorm1 }}>Full-Time Research Internship, under Prof. Nathan Jacobs</p>
                <p className="text-md" style={{ color: nordColors.snowStorm0 }}>Sep. 2023 - Oct. 2023</p>
                <ul className="list-disc list-inside text-base mt-2 space-y-1" style={{ color: nordColors.snowStorm0 }}>
                  <li>Researched on simulation of visual navigation for UAVs using reinforcement learning.</li>
                  <li>Proposed rewards which achieved better accuracy than baseline.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-semibold" style={{ color: nordColors.snowStorm2 }}>MITSUI & CO., LTD. (Tokyo, Japan)</h3>
                <p className="text-lg" style={{ color: nordColors.snowStorm1 }}>Part-time R&D engineer for satellite image analysis</p>
                <p className="text-md" style={{ color: nordColors.snowStorm0 }}>Jan. 2023 - Sep. 2023</p>
                <ul className="list-disc list-inside text-base mt-2 space-y-1" style={{ color: nordColors.snowStorm0 }}>
                  <li>Implemented a random forest algorithm for land classification using Google Earth Engine.</li>
                  <li>The algorithm exhibited superior performance in land cover / classification, outperforming the standard method, Dynamic World.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-semibold" style={{ color: nordColors.snowStorm2 }}>NEC Visual Intelligence Research Laboratories (Kanagawa, Japan)</h3>
                <p className="text-lg" style={{ color: nordColors.snowStorm1 }}>Full-Time Summer Research Internship, under Mr. Royston Rodrigues</p>
                <p className="text-md" style={{ color: nordColors.snowStorm0 }}>Aug. 2022 - Oct. 2022</p>
                <ul className="list-disc list-inside text-base mt-2 space-y-1" style={{ color: nordColors.snowStorm0 }}>
                  <li>Proposed a two-streamed GAN to bridge the gap between aerial and street images.</li>
                  <li>Achieved better accuracy than single-towered GAN (baseline).</li>
                  <li>Communicated and participated in research discussions, final presentations, and daily interactions fully in English.</li>
                </ul>
              </div>
            </div>
          </section>
        );
      case 'awards':
        return (
          <section className="bg-polarNight1 bg-opacity-70 p-6 md:p-8 rounded-xl shadow-lg border border-polarNight3">
            <h2 className="text-3xl font-semibold mb-4" style={{ color: nordColors.frost2 }}>
              Awards & Grants
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold" style={{ color: nordColors.snowStorm2 }}>GSA Travel Award, The University of Nevada, Reno</h3>
                <p className="text-md" style={{ color: nordColors.snowStorm0 }}>2025</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold" style={{ color: nordColors.snowStorm2 }}>Graduate Assistantship, University of Nevada, Reno</h3>
                <p className="text-md" style={{ color: nordColors.snowStorm0 }}>Aug. 2024 - Jul. 2025</p>
                <ul className="list-disc list-inside text-base mt-2 space-y-1" style={{ color: nordColors.snowStorm0 }}>
                  <li>Financial support of approximately $2,200 per month.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-semibold" style={{ color: nordColors.snowStorm2 }}>RA from Spring-GX, The University of Tokyo</h3>
                <p className="text-md" style={{ color: nordColors.snowStorm0 }}>Apr. 2024 - Jul. 2024</p>
                <ul className="list-disc list-inside text-base mt-2 space-y-1" style={{ color: nordColors.snowStorm0 }}>
                  <li>Financial support of approximately $1,500 per month.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-semibold" style={{ color: nordColors.snowStorm2 }}>The UTokyo Hands-on Activity Program Travel Grant, The University of Tokyo</h3>
                <p className="text-md" style={{ color: nordColors.snowStorm0 }}>2019</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold" style={{ color: nordColors.snowStorm2 }}>The UTokyo Hands-on Activity Program Travel Grant, The University of Tokyo</h3>
                <p className="text-md" style={{ color: nordColors.snowStorm0 }}>2018</p>
              </div>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen font-inter overflow-hidden" style={{ backgroundColor: nordColors.polarNight0 }}>
      {/* Three.js Canvas */}
      <div ref={mountRef} className="fixed inset-0 z-0" /> {/* ここを absolute から fixed に変更 */}


      {/* Loading Indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-polarNight0 bg-opacity-90 z-20">
          <div className="text-snowStorm0 text-xl animate-pulse">
            Loading Earth...
          </div>
        </div>
      )}

      {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center /* justify-center は不要 */ min-h-screen p-4 md:p-8 text-snowStorm0 overflow-y-auto"> {/* overflow-y-auto を追加して、このdiv内でスクロールを発生させる */}
        {/* Header */}
        <header className="w-full max-w-4xl text-center mb-8 mt-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: nordColors.snowStorm2 }}>
            <span style={{ color: nordColors.frost1 }}>Ryota Yagi</span>'s Homepage
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

        {/* Navigation */}
        <nav className="w-full max-w-4xl flex justify-center space-x-4 mb-12 p-4 bg-polarNight1 bg-opacity-70 rounded-xl shadow-lg border border-polarNight3">
          <button
            onClick={() => setCurrentPage('home')}
            className={`px-4 py-2 rounded-lg text-lg font-medium transition-colors duration-200 ${
              currentPage === 'home' ? 'bg-frost2 text-polarNight0' : 'text-snowStorm0 hover:bg-polarNight2'
            }`}
            style={{ color: currentPage === 'home' ? nordColors.polarNight0 : nordColors.snowStorm0, backgroundColor: currentPage === 'home' ? nordColors.frost2 : 'transparent' }}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentPage('education')}
            className={`px-4 py-2 rounded-lg text-lg font-medium transition-colors duration-200 ${
              currentPage === 'education' ? 'bg-frost2 text-polarNight0' : 'text-snowStorm0 hover:bg-polarNight2'
            }`}
            style={{ color: currentPage === 'education' ? nordColors.polarNight0 : nordColors.snowStorm0, backgroundColor: currentPage === 'education' ? nordColors.frost2 : 'transparent' }}
          >
            Education
          </button>
          <button
            onClick={() => setCurrentPage('experience')}
            className={`px-4 py-2 rounded-lg text-lg font-medium transition-colors duration-200 ${
              currentPage === 'experience' ? 'bg-frost2 text-polarNight0' : 'text-snowStorm0 hover:bg-polarNight2'
            }`}
            style={{ color: currentPage === 'experience' ? nordColors.polarNight0 : nordColors.snowStorm0, backgroundColor: currentPage === 'experience' ? nordColors.frost2 : 'transparent' }}
          >
            Experience
          </button>
          <button
            onClick={() => setCurrentPage('awards')}
            className={`px-4 py-2 rounded-lg text-lg font-medium transition-colors duration-200 ${
              currentPage === 'awards' ? 'bg-frost2 text-polarNight0' : 'text-snowStorm0 hover:bg-polarNight2'
            }`}
            style={{ color: currentPage === 'awards' ? nordColors.polarNight0 : nordColors.snowStorm0, backgroundColor: currentPage === 'awards' ? nordColors.frost2 : 'transparent' }}
          >
            Awards & Grants
          </button>
        </nav>

        {/* Main Content Sections */}
        <main className="w-full max-w-4xl space-y-12">
          {renderPageContent()}

          {/* Contact Section - Always visible */}
          <section className="bg-polarNight1 bg-opacity-70 p-6 md:p-8 rounded-xl shadow-lg border border-polarNight3 transition-all duration-300 hover:shadow-2xl hover:border-frost0">
            <h2 className="text-3xl font-semibold mb-4" style={{ color: nordColors.frost2 }}>
              Contact
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: nordColors.snowStorm0 }}>
              Please feel free to reach out if you have any questions or are interested in collaboration.
            </p>
            <p className="text-lg mt-4">
              Email: <a href="mailto:ryotayagi.ry.8877@gmail.com" className="underline" style={{ color: nordColors.auroraGreen }}>ryotayagi.ry.8877@gmail.com</a>
            </p>
          </section>
        </main>

        {/* Footer */}
        <footer className="w-full max-w-4xl text-center mt-12 py-6 text-sm" style={{ color: nordColors.snowStorm0 }}>
          <p>&copy; {new Date().getFullYear()} Ryota Yagi. All rights reserved.</p>
          <p>Designed with <span className="text-auroraRed">❤️</span> and Nord.js spirit.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
