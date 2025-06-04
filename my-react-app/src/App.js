// App.js
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import local texture assets
import earthDayMap from './assets/textures/earth_atmos_2048.jpg';
import earthNightMap from './assets/textures/earth_lights_2048.png';
import earthCloudsMap from './assets/textures/earth_clouds_1024.png';
import earthSpecularMap from './assets/textures/earth_specular_2048.jpg';
import earthNormalMap from './assets/textures/earth_normal_2048.jpg';

// Import components and pages
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import EducationPage from './pages/EducationPage';
import ExperiencePage from './pages/ExperiencePage';
import AwardsPage from './pages/AwardsPage';
import GalleryPage from './pages/GalleryPage';
import {
  Mail, // Contact用
} from 'lucide-react';

// Nord Color Palette (Approximate Hex Color Codes)
const nordColors = {
  polarNight0: '#2E3440',
  polarNight1: '#3B4252',
  polarNight2: '#434C5E',
  polarNight3: '#4C566A',
  snowStorm0: '#D8DEE9',
  snowStorm1: '#E5E9F0',
  snowStorm2: '#ECEFF4',
  frost0: '#8FBCBB',
  frost1: '#88C0D0',
  frost2: '#81A1C1',
  frost3: '#5E81AC',
  auroraRed: '#BF616A',
  auroraOrange: '#D08770',
  auroraYellow: '#EBCB8B',
  auroraGreen: '#A3BE8C',
  auroraPurple: '#B48EAD',
};

// Helper component for section titles with icons
// この SectionTitle は HomePage や他のページコンポーネントに props として渡すか、
// 各コンポーネントが個別にインポート/定義する必要があります。
// ここでは App.js で定義し、HomePage に props で渡します。
function SectionTitle({ icon: IconComponent, title, iconColor, titleColor }) {
  return (
    <div className="flex items-center mb-4">
      <IconComponent className="w-7 h-7 md:w-8 md:h-8 mr-3 flex-shrink-0" style={{ color: iconColor }} />
      <h2 className="text-3xl font-semibold" style={{ color: titleColor }}>
        {title}
      </h2>
    </div>
  );
}

// Main App Component
function App() {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    setUserId(crypto.randomUUID());
  }, []);

  useEffect(() => {
    if (!mountRef.current) {
      console.log("mountRef.current is null on initial render, waiting for DOM.");
      return;
    }
    if (mountRef.current.querySelector('canvas')) {
      console.warn('Three.js canvas already exists. Skipping re-initialization.');
      setLoading(false);
      return;
    }

    let scene, camera, renderer, controls, earth, clouds, particles;
    let animationFrameId;

    const textureLoader = new THREE.TextureLoader();
    const earthDayMapUrl = earthDayMap;
    const earthNightMapUrl = earthNightMap;
    const earthCloudsMapUrl = earthCloudsMap;
    const earthSpecularMapUrl = earthSpecularMap;
    const earthNormalMapUrl = earthNormalMap;

    const onWindowResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    const init = (dayMap, nightMap, cloudsMap, bumpMap, specularMap, normalMap) => {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(nordColors.polarNight0);

      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 3;

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      if (!mountRef.current.querySelector('canvas')) {
        mountRef.current.appendChild(renderer.domElement);
      }

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.screenSpacePanning = false;
      controls.minDistance = 2;
      controls.maxDistance = 10;
      controls.maxPolarAngle = Math.PI / 2;

      const earthGeometry = new THREE.SphereGeometry(1.5, 64, 64);
      const earthMaterial = new THREE.MeshStandardMaterial({
        map: dayMap,
        emissiveMap: nightMap,
        emissiveIntensity: 0.8,
        emissive: new THREE.Color(0xffffff),
        roughness: 0.3,
        metalness: 0.0,
        specularMap: specularMap,
        specular: new THREE.Color(nordColors.frost1),
        normalMap: normalMap,
        normalScale: new THREE.Vector2(1, 1),
      });
      earth = new THREE.Mesh(earthGeometry, dayMap ? earthMaterial : new THREE.MeshPhongMaterial({ color: new THREE.Color(nordColors.frost3) }));
      scene.add(earth);

      const cloudsGeometry = new THREE.SphereGeometry(1.51, 64, 64);
      const cloudsMaterial = new THREE.MeshStandardMaterial({
        map: cloudsMap,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        alphaMap: cloudsMap,
      });
      clouds = new THREE.Mesh(cloudsGeometry, cloudsMap ? cloudsMaterial : new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }));
      scene.add(clouds);

      const ambientLight = new THREE.AmbientLight(nordColors.snowStorm0, 0.3);
      scene.add(ambientLight);

      const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
      sunLight.position.set(5, 0, 5).normalize();
      scene.add(sunLight);

      const particleCount = 1000;
      const particleGeometry = new THREE.BufferGeometry();
      const positions = [];
      const colors = [];
      const colorPalette = [
        new THREE.Color(nordColors.frost0),
        new THREE.Color(nordColors.frost1),
        new THREE.Color(nordColors.frost2),
        new THREE.Color(nordColors.auroraGreen),
        new THREE.Color(nordColors.auroraPurple),
      ];

      for (let i = 0; i < particleCount; i++) {
        const radius = 2.5 + Math.random() * 2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        positions.push(x, y, z);

        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors.push(color.r, color.g, color.b);
      }

      particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      const particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
      });
      particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

      setLoading(false);
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (earth) earth.rotation.y += 0.001;
      if (clouds) clouds.rotation.y += 0.0015;
      if (particles) particles.rotation.y += 0.0005;
      if (controls && renderer && camera) {
        controls.update();
        renderer.render(scene, camera);
      }
    };

    setLoading(true);
    Promise.all([
      textureLoader.loadAsync(earthDayMapUrl),
      textureLoader.loadAsync(earthNightMapUrl),
      textureLoader.loadAsync(earthCloudsMapUrl),
      textureLoader.loadAsync(earthSpecularMapUrl),
      textureLoader.loadAsync(earthNormalMapUrl)
    ]).then(([dayMap, nightMap, cloudsMap, specularMap, normalMap]) => {
      init(dayMap, nightMap, cloudsMap, null, specularMap, normalMap);
      animate();
    }).catch(error => {
      console.error("Failed to load Earth textures:", error);
      setLoading(false);
      init(null, null, null, null, null, null);
      animate();
    });

    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
      cancelAnimationFrame(animationFrameId);
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
        scene = null;
      }
      if (controls) {
        controls.dispose();
        controls = null;
      }
      if (renderer) {
        if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
          mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
        renderer = null;
      }
    };
  }, []);

  return (
    <Router>
      <div className="relative min-h-screen font-inter overflow-hidden" style={{ backgroundColor: nordColors.polarNight0 }}>
        <div ref={mountRef} className="fixed inset-0 z-0" />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-polarNight0 bg-opacity-90 z-20">
            <div className="text-snowStorm0 text-xl animate-pulse">
              Loading Earth...
            </div>
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center min-h-screen p-4 md:p-8 text-snowStorm0 overflow-y-auto">
          <Header userId={userId} currentPage={currentPage} setCurrentPage={setCurrentPage} />

          <main className="w-full max-w-4xl space-y-12">
            <Routes>
              {/* HomePage に SectionTitle と nordColors を props として渡す */}
              <Route 
                path="/" 
                element={<HomePage 
                            setCurrentPage={setCurrentPage} 
                            SectionTitle={SectionTitle} 
                            nordColors={nordColors} 
                         />} 
              />
              {/* 他のページコンポーネントも同様に SectionTitle や nordColors が必要であれば渡す */}
              <Route path="/education" element={<EducationPage SectionTitle={SectionTitle} nordColors={nordColors} />} />
              <Route path="/experience" element={<ExperiencePage SectionTitle={SectionTitle} nordColors={nordColors} />} />
              <Route path="/awards" element={<AwardsPage SectionTitle={SectionTitle} nordColors={nordColors} />} />
              <Route path="/gallery" element={<GalleryPage SectionTitle={SectionTitle} nordColors={nordColors} />} />
            </Routes>

            <section className="bg-polarNight1 bg-opacity-70 p-6 md:p-8 rounded-xl shadow-lg border border-polarNight3 transition-all duration-300 hover:shadow-2xl hover:border-frost0">
              <SectionTitle
                icon={Mail}
                title="Contact"
                iconColor={nordColors.frost1}
                titleColor={nordColors.frost2}
              />
              <p className="text-lg leading-relaxed" style={{ color: nordColors.snowStorm0 }}>
                Please feel free to reach out if you have any questions or are interested in collaboration.
              </p>
              <p className="text-lg mt-4">
                Email: <span className="underline" style={{ color: nordColors.auroraGreen }}>ryotayagi [dot] ry [dot] 8877 🌏 gmail.com</span>
              </p>
            </section>
          </main>

          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
