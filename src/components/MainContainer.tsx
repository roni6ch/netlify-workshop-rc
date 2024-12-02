// src/components/MainContainer.js
import React, { useState } from 'react';
import ContentWrapper from './ContentWrapper';

function MainContainer() {
  const [activeHeaderLink, setActiveHeaderLink] = useState('Desktop');

  const handleHeaderLinkClick = (link: React.SetStateAction<string>) => {
    setActiveHeaderLink(link);
  };

  return (
    <div className="main-container">
      <div className="main-header">
        <a className="menu-link-main" href="#">
          All Apps
        </a>
        <div className="header-menu">
          <a
            className={`main-header-link ${activeHeaderLink === 'Desktop' ? 'is-active' : ''}`}
            href="#"
            onClick={() => handleHeaderLinkClick('Desktop')}
          >
            Desktop
          </a>
          <a
            className={`main-header-link ${activeHeaderLink === 'Mobile' ? 'is-active' : ''}`}
            href="#"
            onClick={() => handleHeaderLinkClick('Mobile')}
          >
            Mobile
          </a>
          <a
            className={`main-header-link ${activeHeaderLink === 'Web' ? 'is-active' : ''}`}
            href="#"
            onClick={() => handleHeaderLinkClick('Web')}
          >
            Web
          </a>
        </div>
      </div>
      <ContentWrapper />
    </div>
  );
}

export default MainContainer;