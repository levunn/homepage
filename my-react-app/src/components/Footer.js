// src/components/Footer.js
import React from 'react';
// Import SiGooglescholar for the Google Scholar icon
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { SiGooglescholar } from 'react-icons/si'; // <--- CHANGED THIS LINE

const nordColors = {
  snowStorm0: '#D8DEE9',
  auroraRed: '#BF616A',
  frost2: '#81A1C1',
};

function Footer() {
  return (
    <footer className="w-full max-w-4xl text-center mt-12 py-6 text-sm" style={{ color: nordColors.snowStorm0 }}>
      <p>&copy; {new Date().getFullYear()} Ryota Yagi. All rights reserved.</p>
      <p>Designed with <span className="text-auroraRed">❤️</span> and Nord.js spirit.</p>
      <div className="flex justify-center space-x-6 mt-4">
        <a href="https://scholar.google.co.jp/citations?user=MygjhWsAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="text-snowStorm0 hover:text-frost2 transition-colors duration-200 text-3xl">
          <SiGooglescholar /> {/* <--- CHANGED THIS LINE */}
        </a>
        <a href="https://www.linkedin.com/in/ryota-yagi-5824a4242/" target="_blank" rel="noopener noreferrer" className="text-snowStorm0 hover:text-frost2 transition-colors duration-200 text-3xl">
          <FaLinkedin />
        </a>
        <a href="https://github.com/levunn" target="_blank" rel="noopener noreferrer" className="text-snowStorm0 hover:text-frost2 transition-colors duration-200 text-3xl">
          <FaGithub />
        </a>
      </div>
    </footer>
  );
}

export default Footer;