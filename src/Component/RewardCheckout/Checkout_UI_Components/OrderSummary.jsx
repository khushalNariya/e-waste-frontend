import React from 'react';

const OrderSummary = ({ cart, totalPoints }) => {
    return (
        <div className="order-summary-sticky">
            <div className="order-summary-card">
                <div className="order-summary-header">
                    <h5 className="fw-bold text-white mb-0">
                        <i className="fa-solid fa-receipt me-2"></i>Order Summary
                    </h5>
                </div>
                <div className="order-summary-body">
                    {cart.map(item => (
                        <div key={item.id} className="summary-item">
                            <div className="summary-item-img">
                                <img src={item.image} alt={item.name} />
                            </div>
                            <div className="flex-grow-1">
                                <div className="fw-semibold text-dark small">{item.name}</div>
                                <div className="text-muted" style={{ fontSize: '12px' }}>Qty: {item.quantity}</div>
                            </div>
                            <div className="fw-bold text-dark small">{item.points * item.quantity} <span className="text-success" style={{ fontSize: '11px' }}>PTS</span></div>
                        </div>
                    ))}

                    <hr className="my-3" />

                    <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted small">Subtotal</span>
                        <span className="fw-semibold">{totalPoints} PTS</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted small">Shipping</span>
                        <span className="text-success fw-bold small">FREE</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted small">Processing Fee</span>
                        <span className="text-success fw-bold small">WAIVED</span>
                    </div>

                    <hr className="my-3" />

                    <div className="d-flex justify-content-between align-items-end">
                        <span className="fw-bold text-dark">Total Points</span>
                        <span className="fs-4 fw-black text-success">{totalPoints} <span className="fs-6 text-muted fw-bold">PTS</span></span>
                    </div>

                    <div className="secure-badge mt-3">
                        <i className="fa-solid fa-shield-halved me-2 text-success"></i>
                        <span>100% Secure & Encrypted</span>
                    </div>
                </div>
            </div>

            <div className="eco-note mt-3">
                <i className="fa-solid fa-leaf me-2 text-success"></i>
                <span>By redeeming points, you're supporting sustainable e-waste management.</span>
            </div>
        </div>
    );
};

export default OrderSummary;
