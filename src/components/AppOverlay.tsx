import React, { useState, useEffect } from 'react';

export function AppOverlay() {
  const [isOverlayActive, setIsOverlayActive] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleStatusButtonClick = () => {
    setIsOverlayActive(true);
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsOverlayActive(false);
    setIsPopupVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.dropdown')) {
        setIsOverlayActive(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className={`content-wrapper ${isOverlayActive ? 'overlay' : ''}`}>
      <button className="status-button" onClick={handleStatusButtonClick}>
        Open Popup
      </button>

      {isPopupVisible && (
        <div className="pop-up visible">
          <button className="close" onClick={handleClosePopup}>
            Close
          </button>
          <div className="pop-up-content">Popup Content</div>
        </div>
      )}
    </div>
  );
}