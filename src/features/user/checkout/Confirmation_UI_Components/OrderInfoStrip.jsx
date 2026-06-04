import React from 'react';

const OrderInfoStrip = ({ order, formatDate, statusMap }) => {
    return (
        <div className="info-strip">
            <div className="row g-4">
                <div className="col-sm-6 col-lg-3">
                    <div className="info-strip-item">
                        <div className="info-strip-icon" style={{ background: '#e8f9f2' }}>
                            <i className="fa-solid fa-calendar-check text-success fs-4"></i>
                        </div>
                        <div>
                            <div className="small text-muted fw-semibold">Order Date</div>
                            <div className="fw-bold text-dark small">{formatDate(order.date)}</div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-lg-3">
                    <div className="info-strip-item">
                        <div className="info-strip-icon" style={{ background: '#fff3e0' }}>
                            <i className="fa-solid fa-truck-fast text-warning fs-4"></i>
                        </div>
                        <div>
                            <div className="small text-muted fw-semibold">Est. Delivery</div>
                            <div className="fw-bold text-dark small">{formatDate(order.estimatedDelivery)}</div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-lg-3">
                    <div className="info-strip-item">
                        <div className="info-strip-icon" style={{ background: '#e8eaf6' }}>
                            <i className="fa-solid fa-coins text-primary fs-4"></i>
                        </div>
                        <div>
                            <div className="small text-muted fw-semibold">Points Redeemed</div>
                            <div className="fw-bold text-dark small">{order.totalPoints.toLocaleString()} PTS</div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-lg-3">
                    <div className="info-strip-item">
                        <div className="info-strip-icon" style={{ background: '#fce4ec' }}>
                            <i className="fa-solid fa-circle-check text-danger fs-4"></i>
                        </div>
                        <div>
                            <div className="small text-muted fw-semibold">Payment</div>
                            <div className="fw-bold text-dark small">{statusMap[order.paymentMethod]}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderInfoStrip;
