import React, { useState } from 'react';
import AdminLayout from '../../Layout/AdminLayout';

// Import Modular Components
import AdminSearch from '../../Components/AdminSearch';
import AdminEntriesDropdown from '../../Components/AdminEntriesDropdown';
import AdminPagination from '../../Components/AdminPagination';

export default function InterviewManagePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [entries, setEntries] = useState(10);

  // Static Data for the Table
  const staticData = [
    { id: 1, question: "What is React?", topic: "React.js", author: "Khushal", status: "Published" },
    { id: 2, question: "Explain Closures", topic: "JavaScript", author: "Khushal", status: "Published" },
    { id: 3, question: "What is Django ORM?", topic: "Django", author: "Khushal", status: "Draft" },
    { id: 4, question: "CSS Box Model", topic: "CSS3", author: "Khushal", status: "Published" },
    { id: 5, question: "Virtual DOM vs Real DOM", topic: "React.js", author: "Admin", status: "Published" },
  ];

  return (
    <AdminLayout>
      <div className="page-card">
        {/* Card Header with Search and Entries */}
        <div className="card-header">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Manage Interview Questions</h3>
          
          <div className="table-controls">
            {/* Modular Search Component */}
            <AdminSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            
            {/* Modular Entries Component */}
            <AdminEntriesDropdown entries={entries} setEntries={setEntries} />
          </div>
        </div>

        {/* The Data Table */}
        <div className="modern-table-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Question</th>
                <th>Topic</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staticData.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600 }}>#{item.id}</td>
                  <td style={{ maxWidth: '300px' }}>{item.question}</td>
                  <td><span className="q-topic-tag" style={{ background: '#f0f4f8', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}>{item.topic}</span></td>
                  <td>
                    <span style={{ 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem',
                      background: item.status === 'Published' ? '#dcfce7' : '#fef9c3',
                      color: item.status === 'Published' ? '#166534' : '#854d0e'
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-action btn-edit" title="Edit">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button className="btn-action btn-delete" title="Delete">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Modular Pagination Component */}
        <div className="table-footer">
          <div className="footer-info">
            Showing <strong>1</strong> to <strong>{staticData.length}</strong> of <strong>{staticData.length}</strong> entries
          </div>
          
          <AdminPagination />
        </div>
      </div>
    </AdminLayout>
  );
}
