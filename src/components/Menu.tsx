import React, { useState } from 'react';

export function Menu() {
  const [activeMenuLink, setActiveMenuLink] = useState<string | null>(null);

  const handleMenuClick = (link: string | null) => {
    setActiveMenuLink(link);
  };

  return (
    <div className="menu">
      <a
        href="#"
        className={`menu-link ${activeMenuLink === 'home' ? 'is-active' : ''}`}
        onClick={() => handleMenuClick('home')}
      >
        Home
      </a>
      <a
        href="#"
        className={`menu-link ${activeMenuLink === 'about' ? 'is-active' : ''}`}
        onClick={() => handleMenuClick('about')}
      >
        About
      </a>
      {/* Add more menu links as needed */}
    </div>
  );
}

export function MainHeader() {
  const [activeHeaderLink, setActiveHeaderLink] = useState<string | null>(null);

  const handleHeaderClick = (link: string | null) => {
    setActiveHeaderLink(link);
  };

  return (
    <div className="main-header">
      <a
        href="#"
        className={`main-header-link ${activeHeaderLink === 'profile' ? 'is-active' : ''}`}
        onClick={() => handleHeaderClick('profile')}
      >
        Profile
      </a>
      <a
        href="#"
        className={`main-header-link ${activeHeaderLink === 'settings' ? 'is-active' : ''}`}
        onClick={() => handleHeaderClick('settings')}
      >
        Settings
      </a>
      {/* Add more header links as needed */}
    </div>
  );
}