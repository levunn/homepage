// src/components/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

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

const navItems = [
  { pageName: 'home', label: 'Home', path: '/' },
  { pageName: 'education', label: 'Education', path: '/education' },
  { pageName: 'experience', label: 'Experience', path: '/experience' },
  { pageName: 'awards', label: 'Awards & Grants', path: '/awards' },
  { pageName: 'gallery', label: 'Gallery', path: '/gallery' },
];

function Header({ userId, currentPage, setCurrentPage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full max-w-4xl text-center mb-8 mt-8">
      <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: nordColors.snowStorm2 }}>
        <span style={{ color: nordColors.frost1 }}>Ryota Yagi</span>'s Homepage
      </h1>
      <div className="text-lg md:text-xl font-bold text-snowStorm1" style={{ color: nordColors.snowStorm1 }}>
        <p>Ph.D. Student</p>
        <p>Computer Science & Remote Sensing</p>
      </div>

      <div className="mt-4 mb-8">
        <a
          href="https://drive.google.com/file/d/1PGCCAPlTPLro2SC5a31DtZATz6Inz6Se/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-frost2 text-polarNight0 px-6 py-3 rounded-lg text-lg font-bold transition-colors duration-200 hover:bg-frost3 hover:text-snowStorm2"
        >
          Download CV
        </a>
      </div>

      {/* モバイルメニュー切り替えボタン */}
      <div className="md:hidden mb-4 flex justify-end pr-4">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-snowStorm0">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* モバイルメニュー表示 */}
      {menuOpen && (
        <nav className="md:hidden bg-polarNight1 bg-opacity-80 rounded-xl shadow-lg p-4 mb-6">
          <ul className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.pageName}
                to={item.path}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pageName={item.pageName}
                closeMenu={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </ul>
        </nav>
      )}

      {/* 通常（PC）メニュー */}
      <nav className="hidden md:flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-6 mb-12 p-4 bg-polarNight1 bg-opacity-70 rounded-xl shadow-lg border border-polarNight3">
        {navItems.map((item) => (
          <NavLink
            key={item.pageName}
            to={item.path}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageName={item.pageName}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

const NavLink = ({ to, currentPage, setCurrentPage, pageName, closeMenu, children }) => {
  const isActive = currentPage === pageName;

  return (
    <Link
      to={to}
      onClick={() => {
        setCurrentPage(pageName);
        if (closeMenu) closeMenu();
      }}
      className={`flex-1 text-center py-2 rounded-lg font-bold transition-colors duration-200
        text-base sm:text-base md:text-lg
        ${isActive ? 'bg-frost2 text-polarNight0' : 'text-snowStorm0 hover:bg-polarNight2'}`}
      style={{
        color: isActive ? nordColors.polarNight0 : nordColors.snowStorm0,
        backgroundColor: isActive ? nordColors.frost2 : 'transparent',
      }}
    >
      {children}
    </Link>
  );
};

export default Header;
