// components/ProductList.js
import React from 'react';
import ProductItem from './ProductItem';

interface ProductListProps {
  onModalOpen: () => void;
}

function ProductList({ onModalOpen }: ProductListProps) {
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
      <div className="content-section-title">Installed</div>
      <ul>
        {products.map((product) => (
          <ProductItem key={product.id} product={product} onModalOpen={onModalOpen} />
        ))}
      </ul>
    </div>
  );
}

export default ProductList;