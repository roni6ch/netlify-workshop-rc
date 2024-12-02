import React from 'react';

export function ThemeToggle() {

  const handleToggle = () => {
    document.body.classList.toggle('light-mode');
  };

  return (
    <div className="dark-light" onClick={handleToggle}>
    <svg
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  </div>
  );
}