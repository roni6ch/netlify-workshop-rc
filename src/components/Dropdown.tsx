// components/Dropdown.js
import React, { useState, useEffect, useRef } from 'react';

import { ReactNode } from 'react';

interface DropdownProps {
  children: ReactNode;
}

function Dropdown({ children }: DropdownProps) {
  const [isActive, setIsActive] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropdownClick = (e: { stopPropagation: () => void; }) => {
    e.stopPropagation();
    setIsActive(!isActive);
  };

  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsActive(false);
      }
    };
    document.addEventListener('click', closeDropdown);
    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, []);

  return (
    <div
      className={`dropdown ${isActive ? 'is-active' : ''}`}
      ref={dropdownRef}
      onClick={handleDropdownClick}
    >
      {children}
    </div>
  );
}

export default Dropdown;