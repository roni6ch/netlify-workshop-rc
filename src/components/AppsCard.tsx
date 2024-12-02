// src/components/AppsCard.js
import React from 'react';

function AppsCard() {
  const apps = [
    {
      id: 1,
      name: 'Travel',
      description: 'Book all LOBs',
      svgBorderColor: '#a059a9',
    },
    {
      id: 2,
      name: 'Travel & Expenses',
      description: 'Book all LOBs & get your expenses reimbursed imidiately', 
      svgBorderColor: '#c1316d',
    },
    {
      id: 3,
      name: 'Group travel',
      description: 'Book group travel for your team',
      svgBorderColor: '#C75DEB',
    },
  ];

  return (
    <div className="content-section">
      <div className="content-section-title">Company type</div>
      <div className="apps-card">
        {apps.map((app) => (
          <div className="app-card" key={app.id}>
            <span>
              {/* Include SVG icon here */}
              <svg viewBox="0 0 512 512" style={{ border: `1px solid ${app.svgBorderColor}` }}>
                {/* SVG content */}
              </svg>
              {app.name}
            </span>
            <div className="app-card__subtext">{app.description}</div>
            <div className="app-card-buttons">
              <button className="content-button status-button">
                Join
              </button>
              <div className="menu"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AppsCard;