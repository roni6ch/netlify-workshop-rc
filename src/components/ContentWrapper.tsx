// src/components/ContentWrapper.js
import React from 'react';
import AppsCard from './AppsCard';
import Banner from './Banner';
import Form from './Form';

function ContentWrapper() {
  return (
    <div className="content-wrapper">
      <Banner />
      <AppsCard />
      <Form />
      <button className="content-button status-button main-cta">
        Sign me up!
      </button>
    </div>
  );
}

export default ContentWrapper;