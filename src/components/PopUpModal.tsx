// src/components/PopUpModal.js
import React from 'react';

interface PopUpModalProps {
  onClose: () => void;
}

function PopUpModal({ onClose }: PopUpModalProps) {
  return (
    <div className="overlay-app is-active">
      <div className="pop-up visible">
        <div className="pop-up__title">
          Update This App
          <svg
            className="close"
            onClick={onClose}
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M15 9l-6 6M9 9l6 6" />
          </svg>
        </div>
        <div className="pop-up__subtitle">
          Adjust your selections for advanced options as desired before continuing.{' '}
          <a href="#">Learn more</a>
        </div>
        <div className="checkbox-wrapper">
          <input type="checkbox" id="check1" className="checkbox" />
          <label htmlFor="check1">Import previous settings and preferences</label>
        </div>
        <div className="checkbox-wrapper">
          <input type="checkbox" id="check2" className="checkbox" />
          <label htmlFor="check2">Remove old versions</label>
        </div>
        <div className="content-button-wrapper">
          <button className="content-button status-button open close" onClick={onClose}>
            Cancel
          </button>
          <button className="content-button status-button">Continue</button>
        </div>
      </div>
    </div>
  );
}

export default PopUpModal;