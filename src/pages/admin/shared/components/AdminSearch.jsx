import React from 'react';

export default function AdminSearch({ searchTerm, setSearchTerm }) {
  return (
    <input 
      type="text" 
      className="admin-search-input" 
      placeholder="Search questions..." 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}
