// src/components/ContentWrapper.js
import React from 'react';
import AppsCard from './AppsCard';
import AdobeProductList from './AdobeProductList';
import Banner from './Banner';

interface ContentWrapperProps {
  onModalOpen: () => void;
}

function ContentWrapper({ onModalOpen }: ContentWrapperProps) {
  return (
    <div className="content-wrapper">
      <Banner />
      <AdobeProductList onModalOpen={onModalOpen} />
      <AppsCard />
    </div>
  );
}

export default ContentWrapper;