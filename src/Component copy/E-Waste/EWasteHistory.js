import React, { useState } from 'react';
import './EWasteHistory.css';

const EWasteHistory = () => {
    // Statically mocked data for submission history with rich info
    // Base static mock data
    const baseData = [
        {
            id: "EWS-9024A",
            submitDate: "12 Mar, 2026",
            product: {
                category: "IT Assets",
                brand: "Apple",
                model: "MacBook Pro M1 (2020)",
                condition: "Minor Damage",
                image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=200&q=80"
            },
            logistics: {
                type: "Doorstep Pickup",
                facility: "Green Earth Eco Solutions",
                schedule: "14 Mar, 2026 | 10:00 AM",
            },
            status: "Completed",
            progressStep: 4, 
            points: 1500,
            carbonSaved: "12.5 kg CO₂",
            notes: "Display has a crack, but it functions smoothly."
        },
        {
            id: "EWS-1055B",
            submitDate: "05 Apr, 2026",
            product: {
                category: "Mobile Devices",
                brand: "Samsung",
                model: "Galaxy S21 Ultra",
                condition: "Not Working",
                image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=200&q=80"
            },
            logistics: {
                type: "Self Drop-off",
                facility: "Central E-Waste Recycling Hub",
                schedule: "08 Apr, 2026 | Flexible",
            },
            status: "In Evaluation",
            progressStep: 2,
            points: 0,
            carbonSaved: "Estimated 3.2 kg CO₂",
            notes: "Device is completely dead and won't charge."
        },
        {
            id: "EWS-3301C",
            submitDate: "08 Apr, 2026",
            product: {
                category: "Consumer Electronics",
                brand: "Sony",
                model: "Bravia 55-inch LED TV",
                condition: "Scrap",
                image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=200&q=80"
            },
            logistics: {
                type: "Doorstep Pickup",
                facility: "North Zone Collection Point",
                schedule: "10 Apr, 2026 | 02:00 PM",
            },
            status: "Scheduled",
            progressStep: 0,
            points: 0,
            carbonSaved: "Pending",
            notes: "Display panel is completely shattered, missing power cable."
        }
    ];

    // Simulate having 50 records by repeating the base data
    const [historyData] = useState(() => {
        return Array.from({ length: 50 }, (_, i) => ({
            ...baseData[i % 3], // Rotate between the 3 base designs
            id: `EWS-${1000 + i}`, // Unique ID
            submitDate: `${(i % 28) + 1} Apr, 2026`, // Randomize date a bit
            status: i === 0 ? "Completed" : i === 1 ? "In Evaluation" : i === 2 ? "Scheduled" : baseData[i % 3].status
        }));
    });

    const steps = ["Requested", "Picked Up/Dropped", "Evaluated", "Recycled", "Rewarded"];

    // --- PAGINATION LOGIC START ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Kitne item ek page par dikhane hai

    // Calculation for indices
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    
    // Sirf is page ke items extract  karo
    const currentItems = historyData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(historyData.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Page badalne ke baad automatically upar scroll ho jaye
        window.scrollTo({ top: 350, behavior: 'smooth' });
    };
    // --- PAGINATION LOGIC END ---


    return (
        <div className="history-wrapper">
            {/* Header Section */}
            <div className="history-header text-center">
                <div className="header-icon mx-auto mb-3">
                    <i className="fa-solid fa-clock-rotate-left"></i>
                </div>
                <h1 className="fw-bolder text-white mb-2">My Submission History</h1>
                <p className="text-white-50">Track your e-waste recycling journey, check evaluated conditions, and view your earned rewards dynamically.</p>
            </div>

            {/* Dashboard Stats */}
            <div className="container history-dashboard">
                <div className="row g-4 mb-5">
                    <div className="col-md-4">
                        <div className="stat-card">
                            <div className="stat-icon bg-success-subtle text-success">
                                <i className="fa-solid fa-leaf"></i>
                            </div>
                            <div className="stat-details">
                                <h3>3</h3>
                                <p>Total Submissions</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="stat-card">
                            <div className="stat-icon bg-warning-subtle text-warning">
                                <i className="fa-solid fa-trophy"></i>
                            </div>
                            <div className="stat-details">
                                <h3>1,500 <span style={{fontSize:'0.9rem', color:'#6c757d', fontWeight:400}}>Pts</span></h3>
                                <p>Rewards Earned</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="stat-card">
                            <div className="stat-icon bg-info-subtle text-info">
                                <i className="fa-solid fa-cloud"></i>
                            </div>
                            <div className="stat-details">
                                <h3>15.7 <span style={{fontSize:'0.9rem', color:'#6c757d', fontWeight:400}}>kg</span></h3>
                                <p>CO₂ Emis. Saved</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submissions List (Paginated) */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="section-title m-0">Recent Submissions</h3>
                    <div className="text-muted fw-bold">Page {currentPage} of {totalPages} (Total {historyData.length} Records)</div>
                </div>
                
                <div className="submission-list">
                    {currentItems.map((item, index) => (
                        <div className="submission-card" key={index}>
                            
                            {/* Card Header */}
                            <div className="sub-card-header">
                                <div className="sub-id-box">
                                    <span className="badge-id"><i className="fa-solid fa-hashtag me-1"></i>{item.id}</span>
                                    <span className="sub-date"><i className="fa-regular fa-calendar me-1"></i> Submitted: {item.submitDate}</span>
                                </div>
                                <div className={`status-badge stat-${item.status.replace(/\s+/g, '-').toLowerCase()}`}>
                                    {item.status}
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="sub-card-body">
                                <div className="row g-4 align-items-center">
                                    {/* Product Details */}
                                    <div className="col-lg-5 col-md-12">
                                        <div className="product-info-box">
                                            <div className="prod-img">
                                                <img src={item.product.image} alt={item.product.model} />
                                            </div>
                                            <div className="prod-details">
                                                <span className="prod-category">{item.product.category}</span>
                                                <h4 className="prod-title">{item.product.brand} {item.product.model}</h4>
                                                <div className="prod-condition">
                                                    <strong>Condition:</strong> <span className="highlight-text">{item.product.condition}</span>
                                                </div>
                                                <div className="prod-notes mt-2 text-muted" style={{fontSize: '0.85rem'}}>
                                                    <i className="fa-solid fa-note-sticky me-1"></i>"{item.notes}"
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Logistics Details */}
                                    <div className="col-lg-3 col-md-6 border-start border-end logistics-section">
                                        <div className="logistics-item mb-3">
                                            <div className="log-icon"><i className="fa-solid fa-truck-ramp-box"></i></div>
                                            <div>
                                                <small className="text-muted d-block">Transit Type</small>
                                                <strong>{item.logistics.type}</strong>
                                            </div>
                                        </div>
                                        <div className="logistics-item mb-3">
                                            <div className="log-icon"><i className="fa-solid fa-building-circle-check"></i></div>
                                            <div>
                                                <small className="text-muted d-block">Center</small>
                                                <strong>{item.logistics.facility}</strong>
                                            </div>
                                        </div>
                                        <div className="logistics-item">
                                            <div className="log-icon"><i className="fa-solid fa-clock"></i></div>
                                            <div>
                                                <small className="text-muted d-block">Schedule</small>
                                                <strong>{item.logistics.schedule}</strong>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reward & Impact Details */}
                                    <div className="col-lg-4 col-md-6 reward-impact-section">
                                        <div className="reward-box mb-3">
                                            <div className="r-icon mb-1"><i className="fa-solid fa-gift"></i> Rewards</div>
                                            {item.progressStep === 4 ? (
                                                <h3 className="text-success fw-bold m-0">+{item.points} <span style={{fontSize:'1rem'}}>Pts</span></h3>
                                            ) : (
                                                <p className="text-muted fst-italic m-0">Pending Evaluation</p>
                                            )}
                                        </div>

                                        <div className="impact-box">
                                            <div className="r-icon mb-1"><i className="fa-solid fa-earth-americas"></i> CO₂ Saved</div>
                                            <h5 className="fw-semibold text-success m-0">{item.carbonSaved}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Progression Tracker */}
                            <div className="sub-card-footer">
                                <div className="tracker-wrapper">
                                    <ul className="progress-tracker">
                                        {steps.map((step, stepIndex) => (
                                            <li key={stepIndex} className={`track-step ${stepIndex <= item.progressStep ? 'completed' : ''} ${stepIndex === item.progressStep ? 'active' : ''}`}>
                                                <div className="tracker-icon">
                                                    {stepIndex < item.progressStep ? (
                                                        <i className="fa-solid fa-check"></i>
                                                    ) : stepIndex === item.progressStep ? (
                                                        <i className="fa-solid fa-spinner fa-spin"></i>
                                                    ) : (
                                                        <i className="fa-regular fa-circle"></i>
                                                    )}
                                                </div>
                                                <div className="tracker-label">{step}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

                {/* Pagination UI */}
                {totalPages > 1 && (
                    <div className="ew-pagination-container mt-5">
                        <ul className="ew-pagination">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                    <i className="fa-solid fa-chevron-left me-1"></i> Prev
                                </button>
                            </li>
                            
                            {[...Array(totalPages)].map((_, i) => {
                                const pageNumber = i + 1;
                                // Simple logic to show limited page numbers (First, Last, Current, and neighbors)
                                const isVisible = pageNumber === 1 || pageNumber === totalPages || Math.abs(pageNumber - currentPage) <= 1;
                                
                                if (!isVisible) {
                                    if (pageNumber === 2 && currentPage > 3) return <li key={i} className="page-ellipsis">...</li>;
                                    if (pageNumber === totalPages - 1 && currentPage < totalPages - 2) return <li key={i} className="page-ellipsis">...</li>;
                                    return null;
                                }

                                return (
                                    <li key={i} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => handlePageChange(pageNumber)}>
                                            {pageNumber}
                                        </button>
                                    </li>
                                );
                            })}

                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                    Next <i className="fa-solid fa-chevron-right ms-1"></i>
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EWasteHistory;
