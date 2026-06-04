import React from 'react';

const EWasteHistoryList = ({
    currentItems,
    steps,
    currentPage,
    totalPages,
    totalRecords,
    handlePageChange,
    onViewImages
}) => {
    return (
        <>
            {/* Submissions List Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="section-title m-0">Recent Submissions</h3>
                <div className="text-muted fw-bold">Page {currentPage} of {totalPages} (Total {totalRecords} Records)</div>
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
                            <div className={`status-badge stat-${(item.status || '').toString().replace(/\s+/g, '-').toLowerCase()}`}>
                                {item.status}
                            </div>
                        </div>

                        {/* Card Body */}
                        <div className="sub-card-body">
                            <div className="row g-4 align-items-center">
                                {/* Product Details */}
                                <div className="col-lg-5 col-md-12">
                                    <div className="product-info-box">
                                        <div 
                                            className="prod-img clickable-img" 
                                            onClick={() => onViewImages(item.product.allImages)}
                                            title="Click to view all images"
                                        >
                                            <img src={item.product.image} alt={item.product.model} />
                                            {item.product.allImages.length > 1 && (
                                                <div className="img-count-badge">
                                                    <i className="fa-solid fa-images"></i> {item.product.allImages.length}
                                                </div>
                                            )}
                                        </div>
                                        <div className="prod-details">
                                            <span className="prod-category">{item.product.category}</span>
                                            <h4 className="prod-title">{item.product.brand} {item.product.model}</h4>
                                            
                                            <div className="prod-condition">
                                                <strong>Initial Condition:</strong> <span className="highlight-text">{item.product.initialCondition}</span>
                                            </div>
                                            {item.product.finalCondition && (
                                                <div className="prod-condition mt-1">
                                                    <strong>Final Condition:</strong> <span className="highlight-text text-success">{item.product.finalCondition}</span>
                                                </div>
                                            )}

                                            {item.notes && item.notes !== '-' && (
                                                <div className="modern-user-note">
                                                    <i className="fa-solid fa-comment-dots"></i>
                                                    <span>{item.notes}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Logistics Details */}
                                <div className="col-lg-3 col-md-6 border-start border-end logistics-section">
                                    <div className="logistics-item mb-3">
                                        <div className="log-icon"><i className="fa-solid fa-truck-ramp-box"></i></div>
                                        <div>
                                            <small className="text-muted d-block">Logistics</small>
                                            <strong>{item.logistics.type}</strong>
                                        </div>
                                    </div>
                                    <div className="logistics-item mb-2">
                                        <div className="log-icon"><i className="fa-solid fa-location-dot"></i></div>
                                        <div className="text-truncate" style={{ maxWidth: '100%' }}>
                                            <small className="text-muted d-block">Center & Address</small>
                                            <strong className="d-block">{item.logistics.facility}</strong>
                                            <small className="text-muted">{item.logistics.address}</small>
                                        </div>
                                    </div>
                                    <div className="logistics-item">
                                        <div className="log-icon"><i className="fa-solid fa-phone"></i></div>
                                        <div>
                                            <small className="text-muted d-block">Contact</small>
                                            <strong>{item.logistics.phone}</strong>
                                        </div>
                                    </div>
                                </div>

                                {/* Reward & Impact Details */}
                                <div className="col-lg-4 col-md-6 reward-impact-section">
                                    <div className="stat-tile reward-tile mb-3">
                                        <div className="stat-header">
                                            <i className="fa-solid fa-trophy"></i>
                                            <span>EARNED REWARDS</span>
                                        </div>
                                        <div className="stat-body">
                                            {item.progressStep === 4 ? (
                                                <h3 className="points-display">+{item.points} <small>Pts</small></h3>
                                            ) : (
                                                <span className="pending-status">Pending Evaluation</span>
                                            )}
                                        </div>
                                    </div>

                                    {item.product.weight && (
                                        <div className="row g-2">
                                            <div className="col-6">
                                                <div className="stat-tile mini-tile">
                                                    <div className="stat-header">
                                                        <i className="fa-solid fa-weight-scale"></i>
                                                        <span>WEIGHT</span>
                                                    </div>
                                                    <div className="stat-body">
                                                        <span className="mini-stat-value">{item.product.weight}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="stat-tile mini-tile carbon-tile">
                                                    <div className="stat-header">
                                                        <i className="fa-solid fa-leaf"></i>
                                                        <span>CO₂ SAVED</span>
                                                    </div>
                                                    <div className="stat-body">
                                                        <span className="mini-stat-value">{item.carbonSaved}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Real-life Project Style Status Remark Bar */}
                        {item.remarks && (
                            <div className={`eval-result-bar ${item.rawStatus === 'rejected' ? 'eval-rejected' : 'eval-verified'}`}>
                                <div className="eval-icon">
                                    <i className={item.rawStatus === 'rejected' ? "fa-solid fa-circle-xmark" : "fa-solid fa-circle-check"}></i>
                                </div>
                                <div className="eval-content">
                                    <span className="eval-label">
                                        {item.rawStatus === 'rejected' ? 'Rejection Reason' : 'Evaluator Remark'}
                                    </span>
                                    <span className="eval-message">{item.remarks}</span>
                                </div>
                            </div>
                        )}

                        {/* Progression Tracker */}
                        <div className="sub-card-footer">
                            <div className="tracker-wrapper">
                                <ul className="progress-tracker">
                                    {/* 🔥 Dynamic Progress Line Integrated Here */}
                                    <div 
                                        className="tracker-progress-line" 
                                        style={{ width: steps && steps.length > 0 ? `calc((${item.progressStep} / ${steps.length - 1}) * (100% - 80px))` : '0%' }}
                                    ></div>

                                    {steps.map((step, stepIndex) => (
                                        <li key={stepIndex} className={`track-step ${stepIndex <= item.progressStep ? 'completed' : ''} ${(stepIndex === item.progressStep && item.rawStatus !== 'rewarded') ? 'active' : ''}`}>
                                            <div className="tracker-icon">
                                                {(stepIndex < item.progressStep || (item.rawStatus === 'rewarded' && stepIndex === 4)) ? (
                                                    <i className="fa-solid fa-check"></i>
                                                ) : stepIndex === item.progressStep ? (
                                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                                ) : (
                                                    <i className="fa-regular fa-circle"></i>
                                                )}
                                            </div>
                                            <div className="tracker-label">{step}</div>
                                            {/* 🔥 Static Update Time (Timeline Style) */}
                                            <div className="tracker-time">
                                                {item.stepTimes && item.stepTimes[stepIndex] ? (
                                                    <>
                                                        <i className="fa-regular fa-clock me-1"></i>
                                                        {item.stepTimes[stepIndex]}
                                                    </>
                                                ) : (
                                                    <span>Pending</span>
                                                )}
                                            </div>
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
        </>
    );
};

export default EWasteHistoryList;
