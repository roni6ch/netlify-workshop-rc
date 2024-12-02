// src/components/AdobeProductList.js
import React from 'react';
import AdobeProductItem from './AdobeProductItem';

interface AdobeProductListProps {
  onModalOpen: () => void;
}

function AdobeProductList({ onModalOpen }: AdobeProductListProps) {
  const products = [
    {
      id: 1,
      name: 'Photoshop',
      status: 'Updated',
      statusColor: 'green',
      buttonLabel: 'Open',
      svgBorderColor: '#3291b8',
      isUpdateAvailable: false,
    },
    {
      id: 2,
      name: 'Illustrator',
      status: 'Update Available',
      statusColor: '',
      buttonLabel: 'Update this app',
      svgBorderColor: '#b65a0b',
      isUpdateAvailable: true,
    },
    {
      id: 3,
      name: 'After Effects',
      status: 'Updated',
      statusColor: 'green',
      buttonLabel: 'Open',
      svgBorderColor: '#C75DEB',
      isUpdateAvailable: false,
    },
  ];

  return (
    <div className="content-section">
      <div className="content-section-title">Details</div>
      <ul>
        {products.map((product) => (
          <AdobeProductItem key={product.id} product={product} onModalOpen={onModalOpen} />
        ))}
      </ul>
    </div>
  );
}

export default AdobeProductList;