import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Checkout.css';

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [confetti, setConfetti] = useState(true);

    useEffect(() => {
        // Get order from navigation state or from localStorage (last order)
        if (location.state?.order) {
            setOrder(location.state.order);
        } else {
            const orders = JSON.parse(localStorage.getItem('rewardOrders') || '[]');
            if (orders.length > 0) setOrder(orders[0]);
            else navigate('/reward-store');
        }

        const timer = setTimeout(() => setConfetti(false), 4000);
        return () => clearTimeout(timer);
    }, []);

    if (!order) {
        return (
            <div className="confirmation-page d-flex align-items-center justify-content-center">
                <div className="spinner-border text-success" role="status"></div>
            </div>
        );
    }

    const formatDate = (iso) => {
        return new Date(iso).toLocaleDateString('en-IN', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    const statusMap = {
        points: '🪙 Eco Points',
        upi: '📱 UPI Payment',
        card: '💳 Debit/Credit Card',
        cod: '💵 Cash on Delivery'
    };

    const timeline = [
        { label: 'Order Placed', desc: 'Your redemption request was received.', date: formatDate(order.date), done: true },
        { label: 'Verification', desc: 'Our team is verifying your point balance.', date: 'Within 2 Hours', done: true },
        { label: 'Processing', desc: 'Your reward item is being prepared for dispatch.', date: '1-2 Business Days', done: false },
        { label: 'Shipped', desc: 'Your package is on the way to you.', date: '3-5 Business Days', done: false },
        { label: 'Delivered', desc: 'Estimated delivery at your address.', date: formatDate(order.estimatedDelivery), done: false },
    ];

    return (
        <div className="confirmation-page">
            {/* Confetti Animation */}
            {confetti && (
                <div className="position-fixed top-0 start-0 w-100 h-100 pointer-events-none" style={{ zIndex: 9999, overflow: 'hidden' }}>
                    {[...Array(20)].map((_, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            left: `${Math.random() * 100}%`,
                            top: '-20px',
                            width: `${8 + Math.random() * 8}px`,
                            height: `${8 + Math.random() * 8}px`,
                            background: ['#1cc88a', '#f6c23e', '#4e73df', '#e74a3b', '#36b9cc'][Math.floor(Math.random() * 5)],
                            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                            animation: `confettiFall ${2 + Math.random() * 3}s linear ${Math.random() * 2}s forwards`,
                            opacity: 0.8
                        }} />
                    ))}
                </div>
            )}

            <style>{`
                @keyframes confettiFall {
                    0%   { transform: translateY(0) rotate(0deg); opacity: 0.8; }
                    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
                }
            `}</style>

            <div className="container">
                {/* Hero Success Card */}
                <div className="confirmation-hero-card">
                    <div className="success-icon-ring">🎉</div>
                    <h1 className="confirmation-title">Order Confirmed!</h1>
                    <p className="confirmation-subtitle">Your eco-reward has been successfully redeemed. Thank you for recycling!</p>
                    <div className="order-id-badge">
                        <i className="fa-solid fa-hashtag me-1"></i> {order.orderId}
                    </div>
                </div>

                {/* Info Strip */}
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

                <div className="row g-4">
                    {/* Left: Order Items + Address */}
                    <div className="col-lg-7">
                        {/* Items */}
                        <div className="conf-order-card mb-4">
                            <div className="conf-order-header d-flex align-items-center gap-3">
                                <div style={{ width: 40, height: 40, background: '#e8f9f2', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fa-solid fa-bag-shopping text-success"></i>
                                </div>
                                <div>
                                    <h6 className="fw-bold text-dark mb-0">Your Rewards ({order.items.length})</h6>
                                    <span className="small text-muted">Items included in this order</span>
                                </div>
                            </div>
                            {order.items.map(item => (
                                <div key={item.id} className="conf-item">
                                    <div className="conf-item-img">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="fw-semibold text-dark">{item.name}</div>
                                        <div className="small text-muted">{item.category} • Qty: {item.quantity}</div>
                                    </div>
                                    <div className="text-end">
                                        <div className="fw-bold text-success">{item.points * item.quantity}</div>
                                        <div style={{ fontSize: '11px', color: '#9e9e9e' }}>PTS</div>
                                    </div>
                                </div>
                            ))}
                            <div className="d-flex justify-content-between align-items-center px-4 py-3 bg-light">
                                <span className="fw-bold text-dark">Total Redeemed</span>
                                <span className="fs-5 fw-black text-success">{order.totalPoints.toLocaleString()} <span className="fs-6 text-muted">PTS</span></span>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="conf-order-card">
                            <div className="conf-order-header d-flex align-items-center gap-3">
                                <div style={{ width: 40, height: 40, background: '#e8eaf6', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fa-solid fa-location-dot text-primary"></i>
                                </div>
                                <div>
                                    <h6 className="fw-bold text-dark mb-0">Delivery Address</h6>
                                    <span className="small text-muted">Your reward will be delivered here</span>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="fw-bold text-dark fs-6 mb-1">{order.address.fullName}</div>
                                <div className="text-muted small mb-1">
                                    <i className="fa-solid fa-phone me-2 text-success"></i>{order.address.phone}
                                </div>
                                <div className="text-muted small">
                                    <i className="fa-solid fa-map-pin me-2 text-success"></i>
                                    {order.address.address}, {order.address.landmark && `${order.address.landmark}, `}
                                    {order.address.city}, {order.address.state} — {order.address.pincode}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Delivery Timeline + Actions */}
                    <div className="col-lg-5">
                        {/* Timeline */}
                        <div className="conf-order-card mb-4">
                            <div className="conf-order-header d-flex align-items-center gap-3">
                                <div style={{ width: 40, height: 40, background: '#e8f9f2', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fa-solid fa-route text-success"></i>
                                </div>
                                <div>
                                    <h6 className="fw-bold text-dark mb-0">Delivery Timeline</h6>
                                    <span className="small text-muted">Track your reward's journey</span>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="delivery-timeline">
                                    {timeline.map((step, i) => (
                                        <div key={i} className="timeline-item">
                                            <div className={`timeline-dot ${step.done ? '' : 'pending'}`}></div>
                                            <div>
                                                <div className={`fw-bold small ${step.done ? 'text-success' : 'text-muted'}`}>{step.label}</div>
                                                <div className="text-muted" style={{ fontSize: '12px' }}>{step.desc}</div>
                                                <div className="text-dark fw-semibold" style={{ fontSize: '12px', marginTop: '2px' }}>{step.date}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-grid gap-3">
                            <Link to="/my-orders" className="btn checkout-btn-primary py-3 fw-bold text-decoration-none">
                                <i className="fa-solid fa-list-check me-2"></i> View All Orders
                            </Link>
                            <Link to="/reward-store" className="btn checkout-btn-secondary py-3 fw-bold text-decoration-none">
                                <i className="fa-solid fa-store me-2"></i> Continue Shopping
                            </Link>
                            <Link to="/E-Waste-Form" className="btn py-3 fw-bold text-success border-2 text-decoration-none" style={{ borderColor: '#1cc88a', borderStyle: 'dashed', borderRadius: '16px', background: '#f0fdf9' }}>
                                <i className="fa-solid fa-recycle me-2"></i> Recycle More & Earn Points
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
