import React from 'react';

const ProductInfo = ({ product }) => {
    return (
        <>
            <h1 className="fw-bolder mb-3 text-dark lh-sm" style={{ letterSpacing: '-0.5px' }}>{product.name}</h1>
            <div className="d-flex align-items-center mb-4 gap-3">
                <div className="badge bg-light text-dark border px-2 py-1">
                    <i className="fa-solid fa-star text-warning me-1"></i> {product.rating || '0.0'}
                </div>
                <span className="text-primary small fw-semibold cursor-pointer text-decoration-underline">{product.total_redeemed || '0'} Recyclers redeemed this</span>
            </div>

            <div className="p-4 bg-success bg-opacity-10 rounded-4 border border-success border-opacity-25 mb-4 shadow-sm">
                <span className="text-success fw-bold small text-uppercase tracking-wider">Redemption Cost</span>
                <div className="d-flex align-items-baseline mt-1">
                    <span className="display-4 fw-black text-dark m-0 tracking-tight">{product.points ? product.points.toLocaleString() : '0'}</span>
                    <span className="ms-2 fw-bolder text-success">PTS</span>
                </div>
                <hr className="border-success opacity-25 my-3" />
                <p className="small text-muted m-0"><i className="fa-solid fa-circle-info me-1"></i> Earn points by scheduling an E-waste pickup.</p>
            </div>

            <h5 className="fw-bold mb-3 text-dark">Reward Overview</h5>
            <p className="text-secondary lh-lg mb-4" style={{ fontSize: '15px' }}>
                {product.description}
            </p>

            <div className="row g-3 mb-4">
                <div className="col-6">
                    <div className="p-3 bg-white rounded-3 shadow-sm border border-light text-center h-100">
                        <i className="fa-solid fa-truck-fast text-success fs-3 mb-2"></i>
                        <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '13px' }}>Delivery</h6>
                        <span className="small text-muted" style={{ fontSize: '11px' }}> Within {product.delivery_days || '5-7'} Days</span>
                    </div>
                </div>
                <div className="col-6">
                    <div className="p-3 bg-white rounded-3 shadow-sm border border-light text-center h-100">
                        <i className="fa-solid fa-seedling text-success fs-3 mb-2"></i>
                        <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '13px' }}>Eco-Verified</h6>
                        <span className="small text-muted" style={{ fontSize: '11px' }}>100% Genuine</span>
                    </div>
                </div>
            </div>

            <div className="accordion" id="termsAccordion">
                <div className="accordion-item border-0 bg-white rounded-3 shadow-sm overflow-hidden">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed fw-bold text-dark bg-white shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTerms">
                            <i className="fa-solid fa-file-contract me-2 text-primary"></i> Terms & Conditions
                        </button>
                    </h2>
                    <div id="collapseTerms" className="accordion-collapse collapse" data-bs-parent="#termsAccordion">
                        <div className="accordion-body text-muted small bg-light">
                            {product.terms}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductInfo;
