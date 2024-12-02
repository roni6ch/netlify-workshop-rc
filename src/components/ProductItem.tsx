// components/ProductItem.js
import React, { useState } from 'react';

interface Product {
  isUpdateAvailable: boolean;
  svgBorderColor: string;
  name: string;
  statusColor: string;
  status: string;
  buttonLabel: string;
}

interface ProductItemProps {
  product: Product;
  onModalOpen: () => void;
}

function ProductItem({ product, onModalOpen }: ProductItemProps) {
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  const handleButtonAction = () => {
    if (product.isUpdateAvailable) {
      onModalOpen();
    } else {
      // Handle 'Open' action
    }
  };

  const toggleDropdown = () => {
    setIsDropdownActive(!isDropdownActive);
  };

  return (
    <li className="adobe-product">
      <div className="products">
        {/* SVG Icon */}
        <svg viewBox="0 0 52 52" style={{ border: `1px solid ${product.svgBorderColor}` }}>
          {/* SVG content here */}
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
          <div className={`dropdown ${isDropdownActive ? 'is-active' : ''}`} onClick={toggleDropdown}>
            {/* Dropdown content */}
            {isDropdownActive && (
              <ul>
                <li><a href="#">Go to Discover</a></li>
                <li><a href="#">Learn more</a></li>
                <li><a href="#">Uninstall</a></li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

export default ProductItem;