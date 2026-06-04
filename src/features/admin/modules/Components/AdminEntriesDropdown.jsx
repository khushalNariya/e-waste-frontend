import React from 'react';

export default function AdminEntriesDropdown({ entries, setEntries }) {
  return (
    <select 
      className="admin-select"
      value={entries}
      onChange={(e) => setEntries(e.target.value)}
    >
      <option value="5">5 per page</option>
      <option value="10">10 per page</option>
      <option value="20">20 per page</option>
      <option value="50">50 per page</option>
    </select>
  );
}
