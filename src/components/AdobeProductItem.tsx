// src/components/AdobeProductItem.js
import React, { useState, useRef, useEffect } from 'react';

interface Product {
  isUpdateAvailable: boolean;
  svgBorderColor: string;
  name: string;
  statusColor: string;
  status: string;
  buttonLabel: string;
}

interface AdobeProductItemProps {
  product: Product;
  onModalOpen: () => void;
}

function AdobeProductItem({ product, onModalOpen }: AdobeProductItemProps) {
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleButtonAction = () => {
    if (product.isUpdateAvailable) {
      onModalOpen();
    } else {
      // Handle 'Open' action
    }
  };

  const toggleDropdown = (e: { stopPropagation: () => void; }) => {
    e.stopPropagation();
    setIsDropdownActive(!isDropdownActive);
  };

  useEffect(() => {
    const closeDropdown = (e: { target: unknown; }) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownActive(false);
      }
    };
    document.addEventListener('click', closeDropdown);
    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, []);

  return (
    <li className="adobe-product">
      <div className="products">
        {/* Include the SVG icon for the product here */}
        <svg viewBox="0 0 52 52" style={{ border: `1px solid ${product.svgBorderColor}` }}>
          {/* SVG content */}
        </svg>
        {product.name}
      </div>
      <span className="status">
        <span className={`status-circle ${product.statusColor}`}></span>
        {product.status}
      </span>
      <div className="button-wrapper">
        <button
          className={`content-button status-button ${product.isUpdateAvailable ? '' : 'open'}`}
          onClick={handleButtonAction}
        >
          {product.buttonLabel}
        </button>
        <div className="menu">
          <div
            className={`dropdown ${isDropdownActive ? 'is-active' : ''}`}
            ref={dropdownRef}
            onClick={toggleDropdown}
          >
            {/* Dropdown content */}
            {isDropdownActive && (
              <ul>
                <li>
                  <a href="#">Go to Discover</a>
                </li>
                <li>
                  <a href="#">Learn more</a>
                </li>
                <li>
                  <a href="#">Uninstall</a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

export default AdobeProductItem;