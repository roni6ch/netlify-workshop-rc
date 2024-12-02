// src/components/Header.js
import React, { useState } from 'react';
import SearchBar from './SearchBar';

function Header() {
    const [activeLink, setActiveLink] = useState('Apps');
    const [isWide, setIsWide] = useState(false);

    const handleMenuClick = (link: React.SetStateAction<string>) => {
        setActiveLink(link);
    };

    const handleSearchFocus = () => {
        setIsWide(true);
    };

    const handleSearchBlur = () => {
        setIsWide(false);
    };

    return (
        <div className={`header ${isWide ? 'wide' : ''}`}>
            <div className="menu-circle"></div>
            <div className="header-menu">
                <a
                    className={`menu-link ${activeLink === 'Apps' ? 'is-active' : ''}`}
                    href="#"
                    onClick={() => handleMenuClick('Apps')}
                >
                    Home
                </a>
                <a
                    className={`menu-link notify ${activeLink === 'Your work' ? 'is-active' : ''}`}
                    href="#"
                    onClick={() => handleMenuClick('Your work')}
                >
                    Travel planner
                </a>
                <a
                    className={`menu-link ${activeLink === 'Discover' ? 'is-active' : ''}`}
                    href="#"
                    onClick={() => handleMenuClick('Discover')}
                >
                    Group travel
                </a>
                <a
                    className={`menu-link notify ${activeLink === 'Market' ? 'is-active' : ''}`}
                    href="#"
                    onClick={() => handleMenuClick('Market')}
                >
                    Rewards & promos
                </a>
            </div>
            <SearchBar onFocus={handleSearchFocus} onBlur={handleSearchBlur} />
            <div className="header-profile">
                <div className="notification">
                    <span className="notification-number">3</span>
                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bell">
                        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
                    </svg>
                </div>
                <svg viewBox="0 0 512 512" fill="currentColor">
                    <path d="M448.773 235.551A135.893 135.893 0 00451 211c0-74.443-60.557-135-135-135-47.52 0-91.567 25.313-115.766 65.537-32.666-10.59-66.182-6.049-93.794 12.979-27.612 19.013-44.092 49.116-45.425 82.031C24.716 253.788 0 290.497 0 331c0 7.031 1.703 13.887 3.006 20.537l.015.015C12.719 400.492 56.034 436 106 436h300c57.891 0 106-47.109 106-105 0-40.942-25.053-77.798-63.227-95.449z" />
                </svg>
                <img className="profile-img" src="https://avatars.githubusercontent.com/u/9461540?v=4" alt="" />
            </div>
        </div>
    );
}

export default Header;