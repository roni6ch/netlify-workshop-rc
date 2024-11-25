// SearchBar.js
import React from 'react';

interface SearchBarProps {
  onFocus: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
}

function SearchBar({ onFocus, onBlur }: SearchBarProps) {
  return (
    <div className="search-bar">
      <input type="text" placeholder="Search" onFocus={onFocus} onBlur={onBlur} />
    </div>
  );
}

export default SearchBar;