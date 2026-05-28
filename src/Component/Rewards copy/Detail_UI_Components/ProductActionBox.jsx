import React from 'react';

const ProductActionBox = ({ product, quantity, setQuantity, onAddToCart, onFastRedeem }) => {
    return (
        <div className="eco-summary-card shadow-lg sticky-top" style={{ top: '100px', zIndex: 10 }}>
            <div className="eco-summary-header text-center pb-5">
                <i className="fa-solid fa-box-open fs-1 mb-2 text-white opacity-75"></i>
                <h4 className="fw-bolder m-0 text-white">Action Box</h4>
            </div>
            <div className="eco-summary-body p-4 bg-white relative">
                <div className="d-flex justify-content-between mb-3 align-items-center">
                    <span className="text-secondary fw-semibold">Availability</span>
                    {product.stock > 0 ? (
                        <span className="badge bg-success text-white px-3 py-2 rounded-pill">In Stock ({product.stock})</span>
                    ) : (
                        <span className="badge bg-danger text-white px-3 py-2 rounded-pill">Out of Stock</span>
                    )}
                </div>
                <div className="d-flex justify-content-between mb-4 align-items-center">
                    <span className="text-secondary fw-semibold">Dispatched via</span>
                    <span className="text-dark fw-bold small"><i className="fa-solid fa-leaf text-success me-1"></i>GreenHub</span>
                </div>

                <div className="quantity-selector mb-4">
                    <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">Select Quantity</label>
                    <select
                        className="form-select border-2 shadow-none fw-bold"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        disabled={product.stock === 0}
                        style={{ height: '50px', borderRadius: '12px' }}
                    >
                        {[...Array(Math.min(product.stock, 5))].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                    </select>
                </div>

                <button
                    className="btn btn-eco-redeem w-100 fw-bold py-3 mb-3 d-flex align-items-center justify-content-center gap-2"
                    onClick={onAddToCart}
                    disabled={product.stock === 0}
                >
                    <i className="fa-solid fa-plus"></i> Add to Collection
                </button>

                <button
                    className="btn w-100 fw-bold py-3 text-success d-flex align-items-center justify-content-center gap-2 border border-success border-2 rounded-4 hover-bg-light"
                    onClick={onFastRedeem}
                    disabled={product.stock === 0}
                    style={{ transition: 'all 0.3s' }}
                >
                    <i className="fa-solid fa-bolt"></i> Fast Redeem
                </button>

                <div className="text-center mt-4">
                    <span className="small text-muted opacity-75"><i className="fa-solid fa-shield-check me-1"></i>Platform Guaranteed</span>
                </div>
            </div>
        </div>
    );
};

export default ProductActionBox;
