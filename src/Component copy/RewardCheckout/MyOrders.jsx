import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Checkout.css';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('All');
    const [expandedOrder, setExpandedOrder] = useState(null);

    // Cancel modal state
    const [cancelModal, setCancelModal] = useState({ open: false, orderId: null, orderName: '' });
    const [cancelReason, setCancelReason] = useState('');
    const [cancelSuccess, setCancelSuccess] = useState(null); // orderId of just-cancelled order

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('rewardOrders') || '[]');
        if (stored.length === 0) {
            const staticOrders = [
                {
                    orderId: 'ECO-1746200001',
                    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                    items: [
                        { id: 6, name: 'Noise Cancelling Headphones', category: 'Electronics', points: 12000, quantity: 1, image: 'https://img.icons8.com/plasticine/144/headphones.png' }
                    ],
                    totalPoints: 12000,
                    status: 'Delivered',
                    paymentMethod: 'points',
                    estimatedDelivery: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
                    address: { fullName: 'Khushal Patel', phone: '9876543210', address: '12, Green Park Society', city: 'Ahmedabad', state: 'Gujarat', pincode: '380001', landmark: 'Near ISRO Gate' }
                },
                {
                    orderId: 'ECO-1746100002',
                    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    items: [
                        { id: 4, name: 'Starbucks Card ₹200', category: 'Gift Cards', points: 2000, quantity: 2, image: 'https://img.icons8.com/color/144/starbucks.png' },
                        { id: 7, name: 'Solar Keychain Light', category: 'Eco-Friendly', points: 1200, quantity: 1, image: 'https://img.icons8.com/external-flat-line-rich-line/144/external-solar-energy-earth-day-flat-line-rich-line.png' }
                    ],
                    totalPoints: 5200,
                    status: 'Shipped',
                    paymentMethod: 'upi',
                    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                    address: { fullName: 'Khushal Patel', phone: '9876543210', address: '12, Green Park Society', city: 'Ahmedabad', state: 'Gujarat', pincode: '380001', landmark: 'Near ISRO Gate' }
                },
                {
                    orderId: 'ECO-1746050003',
                    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    items: [
                        { id: 3, name: 'Power Bank 10,000mAh', category: 'Electronics', points: 6000, quantity: 1, image: 'https://img.icons8.com/plasticine/144/external-battery.png' }
                    ],
                    totalPoints: 6000,
                    status: 'Processing',
                    paymentMethod: 'points',
                    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                    address: { fullName: 'Khushal Patel', phone: '9876543210', address: '12, Green Park Society', city: 'Ahmedabad', state: 'Gujarat', pincode: '380001', landmark: 'Near ISRO Gate' }
                }
            ];
            localStorage.setItem('rewardOrders', JSON.stringify(staticOrders));
            setOrders(staticOrders);
        } else {
            setOrders(stored);
        }
    }, []);

    /* ─── Cancel Logic ─── */
    const openCancelModal = (order) => {
        setCancelReason('');
        setCancelModal({ open: true, orderId: order.orderId, orderName: order.items.map(i => i.name).join(', ') });
    };

    const closeCancelModal = () => {
        setCancelModal({ open: false, orderId: null, orderName: '' });
        setCancelReason('');
    };

    const confirmCancel = () => {
        if (!cancelReason) return;
        const updated = orders.map(o =>
            o.orderId === cancelModal.orderId
                ? { ...o, status: 'Cancelled', cancelReason, cancelledAt: new Date().toISOString() }
                : o
        );
        localStorage.setItem('rewardOrders', JSON.stringify(updated));
        setOrders(updated);
        setCancelSuccess(cancelModal.orderId);
        closeCancelModal();
        setTimeout(() => setCancelSuccess(null), 4000);
    };

    /* ─── Helpers ─── */
    const tabs = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const filteredOrders = activeTab === 'All' ? orders : orders.filter(o => o.status === activeTab);
    const formatDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    const statusClass = {
        'Processing': 'status-processing',
        'Shipped':    'status-shipped',
        'Delivered':  'status-delivered',
        'Cancelled':  'status-cancelled'
    };
    const statusIcon = {
        'Processing': 'fa-clock',
        'Shipped':    'fa-truck',
        'Delivered':  'fa-circle-check',
        'Cancelled':  'fa-ban'
    };
    const paymentLabel = {
        points: '🪙 Eco Points',
        upi:    '📱 UPI',
        card:   '💳 Card',
        cod:    '💵 COD'
    };

    const cancelReasons = [
        'Changed my mind',
        'Ordered by mistake',
        'Found a better reward',
        'Insufficient points concern',
        'Delivery address issue',
        'Other reason'
    ];

    const totalPointsRedeemed = orders.filter(o => o.status !== 'Cancelled').reduce((acc, o) => acc + o.totalPoints, 0);

    return (
        <div className="orders-page">

            {/* ── Cancel Success Toast ── */}
            {cancelSuccess && (
                <div className="cancel-toast-wrapper">
                    <div className="cancel-toast">
                        <i className="fa-solid fa-circle-check me-2 text-success"></i>
                        Order cancelled successfully. Points will be refunded within 24 hrs.
                        <button className="btn-close btn-close-sm ms-3" onClick={() => setCancelSuccess(null)}></button>
                    </div>
                </div>
            )}

            {/* ── Cancel Confirmation Modal ── */}
            {cancelModal.open && (
                <div className="cancel-modal-overlay" onClick={closeCancelModal}>
                    <div className="cancel-modal-box" onClick={e => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="cancel-modal-header">
                            <div className="cancel-modal-icon">
                                <i className="fa-solid fa-triangle-exclamation"></i>
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1 text-dark">Cancel Order?</h5>
                                <p className="text-muted small mb-0">This action cannot be undone.</p>
                            </div>
                            <button className="btn-close ms-auto" onClick={closeCancelModal}></button>
                        </div>

                        {/* Order info */}
                        <div className="cancel-modal-body">
                            <div className="cancel-order-preview">
                                <i className="fa-solid fa-box text-muted me-2"></i>
                                <span className="small text-dark fw-semibold">{cancelModal.orderName}</span>
                            </div>

                            <div className="cancel-info-banner">
                                <i className="fa-solid fa-coins text-success me-2"></i>
                                <span>Your redeemed points will be <strong>refunded within 24 hours</strong> of cancellation.</span>
                            </div>

                            {/* Reason Selection */}
                            <div className="mt-3">
                                <label className="form-label checkout-label">Select Cancellation Reason *</label>
                                <div className="cancel-reasons">
                                    {cancelReasons.map(reason => (
                                        <label key={reason} className={`cancel-reason-option ${cancelReason === reason ? 'selected' : ''}`}>
                                            <input
                                                type="radio"
                                                name="cancelReason"
                                                value={reason}
                                                checked={cancelReason === reason}
                                                onChange={() => setCancelReason(reason)}
                                                hidden
                                            />
                                            <i className={`fa-solid ${cancelReason === reason ? 'fa-circle-check text-danger' : 'fa-circle text-muted'} me-2`}></i>
                                            {reason}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="cancel-modal-footer">
                            <button className="btn checkout-btn-secondary px-4 py-2 fw-semibold" onClick={closeCancelModal}>
                                Keep Order
                            </button>
                            <button
                                className="btn cancel-confirm-btn px-4 py-2 fw-bold"
                                onClick={confirmCancel}
                                disabled={!cancelReason}
                            >
                                <i className="fa-solid fa-ban me-2"></i>
                                Confirm Cancellation
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="container">
                {/* Page Header */}
                <div className="orders-page-header">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb" style={{ fontSize: 13 }}>
                            <li className="breadcrumb-item"><Link to="/reward-store" className="text-white opacity-75 text-decoration-none">Reward Store</Link></li>
                            <li className="breadcrumb-item active text-white fw-bold">My Orders</li>
                        </ol>
                    </nav>
                    <h1 className="fw-black mb-1" style={{ fontSize: 36, letterSpacing: '-1px' }}>My Reward Orders</h1>
                    <p className="opacity-80 mb-0" style={{ fontSize: 15 }}>Track and manage all your eco-reward redemptions</p>

                    <div className="orders-stats">
                        <div className="order-stat">
                            <span className="stat-value">{orders.length}</span>
                            <span className="stat-label">Total Orders</span>
                        </div>
                        <div className="order-stat">
                            <span className="stat-value">{orders.filter(o => o.status === 'Delivered').length}</span>
                            <span className="stat-label">Delivered</span>
                        </div>
                        <div className="order-stat">
                            <span className="stat-value">{orders.filter(o => o.status === 'Cancelled').length}</span>
                            <span className="stat-label">Cancelled</span>
                        </div>
                        <div className="order-stat">
                            <span className="stat-value">{totalPointsRedeemed.toLocaleString()}</span>
                            <span className="stat-label">PTS Used</span>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="orders-filter-tabs">
                    {tabs.map(tab => (
                        <button key={tab} className={`orders-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                            {tab}
                            <span className="ms-2 badge" style={{
                                background: activeTab === tab ? 'rgba(255,255,255,0.3)' : '#e8f9f2',
                                color: activeTab === tab ? '#fff' : '#1cc88a',
                                fontSize: '11px',
                                padding: '3px 8px'
                            }}>
                                {tab === 'All' ? orders.length : orders.filter(o => o.status === tab).length}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="empty-orders-card">
                        <div className="empty-orders-icon">
                            <i className="fa-solid fa-box-open"></i>
                        </div>
                        <h3 className="fw-bold text-dark mb-3">No {activeTab !== 'All' ? activeTab : ''} Orders Found</h3>
                        <p className="text-muted mb-5">Looks like you haven't placed any orders yet. Start recycling e-waste to earn points and redeem amazing rewards!</p>
                        <Link to="/reward-store" className="btn checkout-btn-primary px-5 py-3 text-decoration-none">
                            <i className="fa-solid fa-store me-2"></i> Browse Rewards
                        </Link>
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <div key={order.orderId} className={`order-card ${order.status === 'Cancelled' ? 'order-card-cancelled' : ''}`}>

                            {/* Cancelled Ribbon */}
                            {order.status === 'Cancelled' && (
                                <div className="cancelled-ribbon">
                                    <i className="fa-solid fa-ban me-1"></i> Cancelled
                                </div>
                            )}

                            {/* Card Header */}
                            <div className="order-card-header">
                                <div className="d-flex align-items-center gap-3 flex-wrap">
                                    <div>
                                        <div className="small text-muted fw-semibold">ORDER ID</div>
                                        <div className="fw-bold text-dark" style={{ fontSize: 14 }}>{order.orderId}</div>
                                    </div>
                                    <div className="vr d-none d-sm-block" style={{ height: 32 }}></div>
                                    <div>
                                        <div className="small text-muted fw-semibold">PLACED ON</div>
                                        <div className="fw-bold text-dark" style={{ fontSize: 14 }}>{formatDate(order.date)}</div>
                                    </div>
                                    <div className="vr d-none d-sm-block" style={{ height: 32 }}></div>
                                    <div>
                                        <div className="small text-muted fw-semibold">PAYMENT</div>
                                        <div className="fw-bold text-dark" style={{ fontSize: 14 }}>{paymentLabel[order.paymentMethod]}</div>
                                    </div>
                                    {order.status === 'Cancelled' && order.cancelReason && (
                                        <>
                                            <div className="vr d-none d-sm-block" style={{ height: 32 }}></div>
                                            <div>
                                                <div className="small text-muted fw-semibold">CANCEL REASON</div>
                                                <div className="fw-semibold text-danger" style={{ fontSize: 13 }}>{order.cancelReason}</div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className={`order-status-badge ${statusClass[order.status]}`}>
                                        <i className={`fa-solid ${statusIcon[order.status]} me-1`}></i>{order.status}
                                    </span>
                                    <button
                                        className="btn btn-sm btn-light border fw-semibold"
                                        style={{ borderRadius: 10, fontSize: 13 }}
                                        onClick={() => setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)}
                                    >
                                        {expandedOrder === order.orderId ? 'Hide' : 'Details'}
                                        <i className={`fa-solid fa-chevron-${expandedOrder === order.orderId ? 'up' : 'down'} ms-1`} style={{ fontSize: 10 }}></i>
                                    </button>
                                </div>
                            </div>

                            {/* Items Preview */}
                            <div className={`order-card-body ${order.status === 'Cancelled' ? 'opacity-50' : ''}`}>
                                <div className="d-flex gap-3 align-items-center flex-wrap">
                                    {order.items.map(item => (
                                        <div key={item.id} className="d-flex align-items-center gap-3">
                                            <div className="order-item-thumb">
                                                <img src={item.image} alt={item.name} />
                                            </div>
                                            <div>
                                                <div className="fw-semibold text-dark" style={{ fontSize: 14 }}>{item.name}</div>
                                                <div className="small text-muted">{item.category} • Qty {item.quantity}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Expanded Details */}
                                {expandedOrder === order.orderId && (
                                    <div className="mt-4 pt-4" style={{ borderTop: '1px dashed #e0e0e0' }}>
                                        <div className="row g-4">
                                            <div className="col-md-6">
                                                <div className="small text-muted fw-bold text-uppercase mb-2">Delivery Address</div>
                                                <div className="p-3 rounded-3" style={{ background: '#f8fffe', border: '1px solid #e8f5e9' }}>
                                                    <div className="fw-bold text-dark small">{order.address.fullName}</div>
                                                    <div className="small text-muted mt-1">{order.address.address}, {order.address.city}, {order.address.state} — {order.address.pincode}</div>
                                                    <div className="small text-muted">{order.address.phone}</div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="small text-muted fw-bold text-uppercase mb-2">Order Info</div>
                                                <div className="p-3 rounded-3" style={{ background: '#f8fffe', border: '1px solid #e8f5e9' }}>
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <span className="small text-muted">Est. Delivery</span>
                                                        <span className="small fw-bold text-dark">{formatDate(order.estimatedDelivery)}</span>
                                                    </div>
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <span className="small text-muted">Points Used</span>
                                                        <span className="small fw-bold text-success">{order.totalPoints.toLocaleString()} PTS</span>
                                                    </div>
                                                    {order.status === 'Cancelled' && order.cancelledAt && (
                                                        <div className="d-flex justify-content-between">
                                                            <span className="small text-muted">Cancelled On</span>
                                                            <span className="small fw-bold text-danger">{formatDate(order.cancelledAt)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Cancellation refund note */}
                                        {order.status === 'Cancelled' && (
                                            <div className="cancel-refund-note mt-3">
                                                <i className="fa-solid fa-rotate-left me-2 text-success"></i>
                                                <span><strong>{order.totalPoints.toLocaleString()} PTS</strong> will be refunded to your eco-wallet within 24 hours.</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Card Footer */}
                            <div className="order-card-footer">
                                <div className="fw-bold text-dark">
                                    Total: <span className={order.status === 'Cancelled' ? 'text-muted text-decoration-line-through' : 'text-success'}>
                                        {order.totalPoints.toLocaleString()}
                                    </span>
                                    <span className="text-muted ms-1 small fw-normal">PTS {order.status === 'Cancelled' ? '(Refunding)' : 'Redeemed'}</span>
                                </div>
                                <div className="d-flex gap-2 flex-wrap">
                                    {order.status === 'Delivered' && (
                                        <Link to="/reward-store" className="btn btn-sm fw-semibold text-decoration-none" style={{ borderRadius: 10, background: '#e8f9f2', color: '#1cc88a', border: '1px solid #c6f6e0', fontSize: 13 }}>
                                            <i className="fa-solid fa-star me-1"></i> Review
                                        </Link>
                                    )}
                                    {order.status !== 'Cancelled' && (
                                        <Link to="/reward-store" className="btn btn-sm fw-semibold text-decoration-none" style={{ borderRadius: 10, background: '#f0f4f8', color: '#4a5568', border: '1px solid #e2e8f0', fontSize: 13 }}>
                                            <i className="fa-solid fa-rotate-right me-1"></i> Reorder
                                        </Link>
                                    )}
                                    <Link to="/order-confirmation" className="btn btn-sm fw-semibold text-decoration-none" style={{ borderRadius: 10, background: '#f0f4f8', color: '#4a5568', border: '1px solid #e2e8f0', fontSize: 13 }}>
                                        <i className="fa-solid fa-eye me-1"></i> View
                                    </Link>

                                    {/* Cancel Button — only for Processing orders */}
                                    {order.status === 'Processing' && (
                                        <button
                                            className="btn btn-sm fw-semibold cancel-order-btn"
                                            onClick={() => openCancelModal(order)}
                                        >
                                            <i className="fa-solid fa-ban me-1"></i> Cancel Order
                                        </button>
                                    )}

                                    {/* Cannot cancel if Shipped */}
                                    {order.status === 'Shipped' && (
                                        <span className="cannot-cancel-badge">
                                            <i className="fa-solid fa-truck me-1"></i> Cannot Cancel (Shipped)
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {/* Bottom Banner */}
                {orders.length > 0 && (
                    <div className="mt-5 p-4 rounded-4 d-flex align-items-center gap-4 flex-wrap" style={{ background: 'linear-gradient(135deg, #1cc88a, #0d6e4a)', color: '#fff' }}>
                        <i className="fa-solid fa-recycle fa-2x opacity-75"></i>
                        <div className="flex-grow-1">
                            <div className="fw-bold fs-5">Keep Recycling, Keep Earning!</div>
                            <div className="small opacity-80">Submit more e-waste to unlock bigger rewards.</div>
                        </div>
                        <Link to="/E-Waste-Form" className="btn btn-light fw-bold px-4 py-2 text-success text-decoration-none" style={{ borderRadius: 12 }}>
                            Submit E-Waste <i className="fa-solid fa-arrow-right ms-2"></i>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
