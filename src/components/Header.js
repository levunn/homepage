// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
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

function Header({ userId, currentPage, setCurrentPage }) {
  return (
    <header className="w-full max-w-4xl text-center mb-8 mt-8">
      <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: nordColors.snowStorm2 }}>
        <span style={{ color: nordColors.frost1 }}>Ryota Yagi</span>'s Homepage
      </h1>
      <p className="text-lg md:text-xl" style={{ color: nordColors.snowStorm1 }}>
        Ph.D. Student | Computer Science | Remote Sensing
      </p>
      {/* {userId && (
        <p className="text-sm mt-2" style={{ color: nordColors.snowStorm0 }}>
          User ID: {userId}
        </p>
      )} */}
      <div className="mt-4 mb-8">
        <a
          href="https://drive.google.com/file/d/1PGCCAPlTPLro2SC5a31DtZATz6Inz6Se/view?usp=sharing" // Placeholder: Update this with the actual path to your CV PDF
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-frost2 text-polarNight0 px-6 py-3 rounded-lg text-lg font-medium transition-colors duration-200 hover:bg-frost3 hover:text-snowStorm2"
        >
          Download CV
        </a>
      </div>

      <nav className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-6 mb-12 p-4 bg-polarNight1 bg-opacity-70 rounded-xl shadow-lg border border-polarNight3">
      <NavLink to="/" currentPage={currentPage} setCurrentPage={setCurrentPage} pageName="home">Home</NavLink>
      <NavLink to="/education" currentPage={currentPage} setCurrentPage={setCurrentPage} pageName="education">Education</NavLink>
      <NavLink to="/experience" currentPage={currentPage} setCurrentPage={setCurrentPage} pageName="experience">Experience</NavLink>
      <NavLink to="/awards" currentPage={currentPage} setCurrentPage={setCurrentPage} pageName="awards">Awards & Grants</NavLink>
      <NavLink to="/gallery" currentPage={currentPage} setCurrentPage={setCurrentPage} pageName="gallery">Gallery</NavLink>
    </nav>
    </header>
  );
}

// Helper component for navigation links
const NavLink = ({ to, currentPage, setCurrentPage, pageName, children }) => {
  const isActive = currentPage === pageName; // State for highlighting active page

  return (
    <Link
      to={to}
      onClick={() => setCurrentPage(pageName)} // Update state on click for visual highlight
      // Added flex-1 to make items take equal width, text-center for centering text,
      // and responsive font size (text-sm on small screens, text-lg on md and up)
      className={`
        flex-1 text-center py-2 rounded-lg font-medium transition-colors duration-200
        text-sm sm:text-base md:text-lg
        ${isActive ? 'bg-frost2 text-polarNight0' : 'text-snowStorm0 hover:bg-polarNight2'}
      `}
      style={{ color: isActive ? nordColors.polarNight0 : nordColors.snowStorm0, backgroundColor: isActive ? nordColors.frost2 : 'transparent' }}
    >
      {children}
    </Link>
  );
};

export default Header;