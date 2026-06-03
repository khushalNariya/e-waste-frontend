import React from 'react';

export default function AdminPagination() {
  return (
    <div className="admin-pagination">
      <button className="page-link" disabled>Prev</button>
      <button className="page-link active">1</button>
      <button className="page-link">2</button>
      <button className="page-link">Next</button>
    </div>
  );
}
