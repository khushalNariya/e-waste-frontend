import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Styles/Checkout.css';
import { getMyOrdersAPI, getMyReturnsAPI, getMyReplacesAPI } from '../User-Interface-API/API_Service';


// UI Components
import ConfirmationHero from './Confirmation_UI_Components/ConfirmationHero';
import OrderInfoStrip from './Confirmation_UI_Components/OrderInfoStrip';
import OrderedItems from './Confirmation_UI_Components/OrderedItems';
import DeliveryTimeline from './Confirmation_UI_Components/DeliveryTimeline';

const LAST_ORDER_KEY = 'last_viewed_order_id';

// Shared function to map raw API order → UI order object
const mapRawOrder = (raw, returnedOrderNumbers, replaces = [], returns = []) => {
    const isReturned = returnedOrderNumbers.has(raw.order_number);
    const rawStatus  = raw.order_status.charAt(0).toUpperCase() + raw.order_status.slice(1);
    return {
        orderId:           raw.order_number,
        dbId:              raw.id,
        date:              raw.created_at,
        items:             raw.items.map(item => ({
            id:       item.product_id,
            name:     item.product_name,
            points:   item.points,
            quantity: item.quantity,
            subtotal: item.subtotal_points,
            image:    item.image 
                ? (item.image.startsWith('http') ? item.image : `${(process.env.REACT_APP_API_URL || "http://127.0.0.1:1000/").replace(/\/$/, "")}${item.image}`)
                : 'https://img.icons8.com/plasticine/144/package.png'
        })),
        totalPoints:       raw.total_points,
        status:            isReturned ? 'Returned' : rawStatus,
        replaces:          replaces,
        returns:           returns,
        paymentMethod:     'points',
        estimatedDelivery: new Date(new Date(raw.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        statusHistory:     raw.status_history || [],
        address:           raw.address ? {
            fullName: raw.address.full_name,
            phone:    raw.address.phone,
            address:  raw.address.address,
            city:     raw.address.city,
            state:    raw.address.state,
            pincode:  raw.address.pincode,
            landmark: raw.address.landmark
        } : null,
        adminNotes:        raw.admin_notes,
        deliveredAt:       raw.delivered_at || null
    };
};

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Show cached data instantly (no spinner flash on normal navigation)
    const [order, setOrder] = useState(() => location.state?.order || null);
    const [confetti, setConfetti] = useState(true);
    const [fetchError, setFetchError] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setConfetti(false), 4000);

        // Determine which orderId to fetch
        const orderId = location.state?.order?.orderId
            || sessionStorage.getItem(LAST_ORDER_KEY);

        if (!orderId) {
            navigate('/reward-store');
            return () => clearTimeout(timer);
        }

        // Persist orderId for hard-refresh recovery
        try { sessionStorage.setItem(LAST_ORDER_KEY, orderId); } catch {}

        // ✅ Always fetch fresh data from API — updates stale cached data silently
        (async () => {
            try {
                const [ordersRes, returnsRes, replacesRes] = await Promise.all([
                    getMyOrdersAPI(),
                    getMyReturnsAPI(),
                    getMyReplacesAPI()
                ]);

                const returnsData = returnsRes.data.results || returnsRes.data || [];
                const replacesData = replacesRes.data.results || replacesRes.data || [];

                const returnedOrderNumbers = new Set(
                    returnsData
                        .filter(ret => ['refunded'].includes(ret.return_status))
                        .map(ret => ret.order_number)
                );

                const raw = ordersRes.data.find(o => o.order_number === orderId);
                if (!raw) { setFetchError(true); return; }

                const orderReps = replacesData.filter(rep => rep.order_number === orderId);
                const orderReturns = returnsData.filter(ret => ret.order_number === orderId);

                // Also invalidate MyOrders cache so it's fresh next time
                try { sessionStorage.removeItem('my_orders_cache'); } catch {}

                setOrder(mapRawOrder(raw, returnedOrderNumbers, orderReps, orderReturns));
            } catch (err) {
                console.error('OrderConfirmation: failed to fetch order:', err);
                // Only show error if we have NO data at all to display
                if (!location.state?.order) setFetchError(true);
            }
        })();

        return () => clearTimeout(timer);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Loading / Error states ──────────────────────────────────────────────────
    if (fetchError) {
        return (
            <div className="confirmation-page d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <i className="fa-solid fa-triangle-exclamation fa-2x text-warning mb-3"></i>
                    <p className="text-muted">Order details could not be loaded.</p>
                    <button className="btn checkout-btn-primary" onClick={() => navigate('/my-orders')}>
                        Go to My Orders
                    </button>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="confirmation-page d-flex align-items-center justify-content-center">
                <div className="spinner-border text-success" role="status"></div>
            </div>
        );
    }

    const formatDate = (iso) => {
        if (!iso) return '';
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

    const isCancelled = order?.status?.toLowerCase() === 'cancelled';
    const isReturned  = order?.status?.toLowerCase() === 'returned';
    const isDelivered = order?.status?.toLowerCase() === 'delivered' || order?.status?.toLowerCase() === 'returned';
    const isAdminCancelled = !!order?.adminNotes;
    const cancelHistory = order?.statusHistory?.find(h => h.status.toLowerCase() === 'cancelled');
    const deliveredHistory = order?.statusHistory?.find(h => h.status.toLowerCase() === 'delivered');

    // Return/Replace window logic (1 calendar day)
    const getWindowInfo = () => {
        if (!isDelivered || !order?.deliveredAt) return { open: false, expired: false, closeDate: null };
        const d1 = new Date(order.deliveredAt);
        d1.setHours(0, 0, 0, 0);
        const d2 = new Date();
        d2.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
        const closeDate = new Date(order.deliveredAt);
        closeDate.setDate(closeDate.getDate() + 1);
        return {
            open: diffDays <= 1,
            expired: diffDays > 1,
            closeDate,
            daysLeft: 1 - diffDays
        };
    };
    const windowInfo = getWindowInfo();
    const isWindowOpen   = windowInfo.open;
    const isWindowExpired = windowInfo.expired;

    const reps = order.replaces || [];
    const returns = order.returns || [];
    const hasActiveRep = reps.some(r => !['rejected'].includes(r.replace_status));
    const hasActiveReturn = returns.some(r => !['refunded', 'rejected'].includes(r.return_status));

    // Compute per-item returned + replaced quantities by matching product id or name
    const itemReturnedQty = {};
    const itemReplacedQty = {};
    order.items?.forEach(item => {
        let retQty = 0;
        returns.filter(r => !['rejected'].includes(r.return_status))
            .forEach(r => {
                const match = r.items_data?.find(ri => ri.product_name === item.name || ri.product_id === item.id);
                if (match) {
                    retQty += match.quantity;
                }
            });
        itemReturnedQty[item.id] = retQty;

        let repQty = 0;
        reps.filter(r => !['rejected'].includes(r.replace_status))
            .forEach(r => {
                const match = r.items_data?.find(ri => ri.product_name === item.name || ri.product_id === item.id);
                if (match) {
                    repQty += match.quantity;
                }
            });
        itemReplacedQty[item.id] = repQty;
    });

    // Any item that still has untouched qty (not returned or replaced)
    const hasUntouchedItems = order.items?.some(item => {
        const used = (itemReturnedQty[item.id] || 0) + (itemReplacedQty[item.id] || 0);
        return item.quantity > used;
    }) ?? false;

    // True if there is at least one replaced item that is not fully returned
    const hasReplacedButNotReturned = order.items?.some(item => {
        const repQty = itemReplacedQty[item.id] || 0;
        const retQty = itemReturnedQty[item.id] || 0;
        return repQty > 0 && retQty < repQty;
    }) ?? false;

    // Replacement return window — find if any completed replacement was delivered within 1 day
    const repReturnWindowInfo = (() => {
        const completedRep = reps.find(r =>
            ['replacement_delivered'].includes(r.replace_status) &&
            r.replacement_delivered_at
        );
        if (!completedRep) return null;
        const d1 = new Date(completedRep.replacement_delivered_at);
        d1.setHours(0, 0, 0, 0);
        const d2 = new Date();
        d2.setHours(0, 0, 0, 0);
        const diff = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
        const closeDate = new Date(new Date(completedRep.replacement_delivered_at).setDate(
            new Date(completedRep.replacement_delivered_at).getDate() + 1
        ));
        return { open: diff <= 1, closeDate, daysLeft: 1 - diff };
    })();

    // Filter timeline to stop at cancelled if it is cancelled; add return step if returned
    const getTimeline = () => {
        const steps = [
            { key: 'pending', label: 'Order Placed', desc: 'Your redemption request was received.' },
            { key: 'confirmed', label: 'Confirmed', desc: 'Your order has been confirmed by our team.' },
            { key: 'processing', label: 'Processing', desc: 'Your reward item is being prepared for dispatch.' },
            { key: 'packed', label: 'Packed', desc: 'Items have been packed and are ready for pickup.' },
            { key: 'shipped', label: 'Shipped', desc: 'Your package is on the way to you.' },
            { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Our delivery partner is arriving at your location.' },
            { key: 'delivered', label: 'Delivered', desc: 'Reward successfully delivered to your address.' },
        ];

        if (isCancelled) {
            const cancelledStep = {
                key: 'cancelled',
                label: 'Order Cancelled',
                desc: cancelHistory?.remarks || 'This order was cancelled.',
                isCancel: true
            };
            const reachedSteps = steps.filter(step => order.statusHistory?.some(h => h.status.toLowerCase() === step.key));
            return [...reachedSteps, cancelledStep].map(step => {
                const history = order.statusHistory?.find(h => h.status.toLowerCase() === step.key);
                return {
                    label: step.label,
                    desc: step.desc,
                    date: history ? history.created_at : (step.key === 'cancelled' ? cancelHistory?.created_at : '---'),
                    done: true,
                    isCancel: step.isCancel
                };
            });
        }

        if (isReturned) {
            // Show all steps up to delivered as done, then add a Return Completed step
            const reachedSteps = steps.map(step => {
                const history = order.statusHistory?.find(h => h.status.toLowerCase() === step.key);
                return {
                    label: step.label,
                    desc: step.desc,
                    date: history ? history.created_at : (step.key === 'delivered' ? formatDate(order.estimatedDelivery) : 'Pending...'),
                    done: !!history || step.key === 'delivered',
                    isReturn: false
                };
            });
            reachedSteps.push({
                label: 'Return & Refunded',
                desc: 'Return request processed. Points have been credited back to your eco-wallet.',
                date: deliveredHistory?.created_at || '',
                done: true,
                isReturn: true
            });
            return reachedSteps;
        }

        return steps.map(step => {
            const history = order.statusHistory?.find(h => h.status.toLowerCase() === step.key);
            return {
                label: step.label,
                desc: step.desc,
                date: history ? history.created_at : (step.key === 'delivered' ? formatDate(order.estimatedDelivery) : 'Pending...'),
                done: !!history,
                current: order.status.toLowerCase() === step.key
            };
        });
    };

    const timeline = getTimeline();

    return (
        <div className="confirmation-page">
            {/* Confetti — only for success (not cancelled or returned) */}
            {confetti && !isCancelled && !isReturned && (
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

                .cancelled-status-box {
                    border-radius: 20px;
                    padding: 24px;
                    margin-bottom: 24px;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    backdrop-filter: blur(10px);
                    animation: fadeInDown 0.5s ease;
                }
                .admin-cancel {
                    background: rgba(78, 115, 223, 0.08);
                    border: 1px solid rgba(78, 115, 223, 0.2);
                }
                .user-cancel {
                    background: rgba(231, 74, 59, 0.08);
                    border: 1px solid rgba(231, 74, 59, 0.2);
                }
            `}</style>

            <div className="container">

                {/* ── Cancelled Banner ── */}
                {isCancelled && (
                    <div className={`cancelled-status-box ${isAdminCancelled ? 'admin-cancel' : 'user-cancel'}`}>
                        <div className={`${isAdminCancelled ? 'bg-primary' : 'bg-danger'} text-white rounded-circle d-flex align-items-center justify-content-center`}
                            style={{ width: 60, height: 60, flexShrink: 0, boxShadow: `0 8px 20px ${isAdminCancelled ? 'rgba(78, 115, 223, 0.3)' : 'rgba(231, 74, 59, 0.3)'}` }}>
                            <i className={`fa-solid ${isAdminCancelled ? 'fa-user-shield' : 'fa-ban'} fa-xl`}></i>
                        </div>
                        <div>
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <h5 className={`fw-bold mb-0 ${isAdminCancelled ? 'text-primary' : 'text-danger'}`}>
                                    {isAdminCancelled ? 'System Notification' : 'Order Cancelled'}
                                </h5>
                                <span className="badge bg-white text-dark border small fw-normal">Refunding</span>
                            </div>
                            <p className="text-dark-50 mb-0" style={{ fontSize: 14, lineHeight: 1.5 }}>
                                {order.adminNotes || cancelHistory?.remarks || "This order was cancelled. Points have been refunded."}
                            </p>
                            <div className="mt-2 small text-muted">
                                <i className="fa-regular fa-calendar-check me-1"></i>
                                Event Logged: <strong>{cancelHistory?.created_at || formatDate(order.updated_at)}</strong>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Returned & Refunded Banner ── */}
                {isReturned && (
                    <div className="cancelled-status-box" style={{ background: 'rgba(28, 200, 138, 0.07)', border: '1px solid rgba(28, 200, 138, 0.25)' }}>
                        <div className="text-white rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: 60, height: 60, flexShrink: 0, background: 'linear-gradient(135deg, #1cc88a, #0d6e4a)', boxShadow: '0 8px 20px rgba(28,200,138,0.3)' }}>
                            <i className="fa-solid fa-rotate-left fa-xl"></i>
                        </div>
                        <div>
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <h5 className="fw-bold mb-0 text-success">Return Completed &amp; Points Refunded</h5>
                                <span className="badge text-white small fw-semibold" style={{ background: '#1cc88a' }}>✓ Refunded</span>
                            </div>
                            <p className="text-dark-50 mb-0" style={{ fontSize: 14, lineHeight: 1.5 }}>
                                Your return request was approved and processed. The redeemed points have been credited back to your eco-wallet.
                            </p>
                            <div className="mt-2 small text-success fw-semibold">
                                <i className="fa-solid fa-wallet me-1"></i>
                                {order.totalPoints.toLocaleString()} PTS returned to your wallet
                            </div>
                        </div>
                    </div>
                )}

                <ConfirmationHero orderId={order.orderId} isCancelled={isCancelled} isReturned={isReturned} />

                <OrderInfoStrip order={order} formatDate={formatDate} statusMap={statusMap} />

                <div className="row g-4">
                    {/* Left: Order Items + Address */}
                    <div className="col-lg-7">
                        <OrderedItems order={order} />

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
                        <DeliveryTimeline timeline={timeline} />

                        {/* Action Buttons */}
                        <div className="d-grid gap-3">
                        {/* Return/Replace Window Actions */}
                        {isDelivered && (
                            <>
                            {/* Window OPEN — show only if there are items not yet actioned */}
                            {isWindowOpen && hasUntouchedItems && (
                                <div className="mb-3 p-3 rounded-4" 
                                     style={{ 
                                         background: 'linear-gradient(135deg, #fffcf5 0%, #fffbeb 100%)', 
                                         border: '1px solid #fde68a',
                                         boxShadow: '0 4px 12px rgba(253, 230, 138, 0.15)'
                                     }}>
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div className="d-flex align-items-center justify-content-center bg-warning text-white rounded-circle" 
                                             style={{ width: 38, height: 38, flexShrink: 0, boxShadow: '0 4px 10px rgba(245, 158, 11, 0.3)' }}>
                                            <i className="fa-solid fa-clock-rotate-left" style={{ fontSize: 14 }}></i>
                                        </div>
                                        <div>
                                            <div className="fw-bold text-dark" style={{ fontSize: 13 }}>Return &amp; Replacement Available</div>
                                            <div className="small text-muted mt-0.5" style={{ fontSize: 11, whiteSpace: 'nowrap' }}>
                                                 {windowInfo.daysLeft === 0 ? (
                                                     <span>
                                                         Expires <strong className="text-danger">today at 11:59 PM (Last day today ⚠️)</strong>
                                                     </span>
                                                 ) : (
                                                     <span>
                                                         You have <strong>{windowInfo.daysLeft} day{windowInfo.daysLeft !== 1 ? 's' : ''}</strong> remaining.
                                                     </span>
                                                 )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <Link to="/my-returns" 
                                              state={{ openCreateModal: true, selectOrderId: order.orderId }} 
                                              className="btn btn-sm fw-bold px-3 py-2 text-decoration-none flex-fill text-center" 
                                              style={{ 
                                                  borderRadius: 12, 
                                                  background: '#ffffff', 
                                                  color: '#b45309', 
                                                  border: '1px solid #fde68a', 
                                                  fontSize: 12, 
                                                  transition: 'all 0.2s ease',
                                                  boxShadow: '0 2px 4px rgba(180, 83, 9, 0.05)'
                                              }}
                                              onMouseOver={(e) => { e.currentTarget.style.background = '#fff8e6'; e.currentTarget.style.borderColor = '#b45309'; }}
                                              onMouseOut={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#fde68a'; }}>
                                            <i className="fa-solid fa-rotate-left me-1"></i> Return Items
                                        </Link>
                                        <Link to="/my-replaces" 
                                              state={{ openCreateModal: true, selectOrderId: order.orderId }} 
                                              className="btn btn-sm fw-bold px-3 py-2 text-decoration-none flex-fill text-center" 
                                              style={{ 
                                                  borderRadius: 12, 
                                                  background: '#4338ca', 
                                                  color: '#ffffff', 
                                                  border: '1px solid #4338ca', 
                                                  fontSize: 12, 
                                                  transition: 'all 0.2s ease',
                                                  boxShadow: '0 4px 10px rgba(67, 56, 202, 0.2)'
                                              }}
                                              onMouseOver={(e) => { e.currentTarget.style.background = '#3730a3'; e.currentTarget.style.borderColor = '#3730a3'; }}
                                              onMouseOut={(e) => { e.currentTarget.style.background = '#4338ca'; e.currentTarget.style.borderColor = '#4338ca'; }}>
                                            <i className="fa-solid fa-arrows-rotate me-1"></i> Replace Items
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Return Replaced Product Action Panel */}
                            {repReturnWindowInfo && repReturnWindowInfo.open && hasReplacedButNotReturned && (
                                <div className="mb-3 p-3 rounded-4" 
                                     style={{ 
                                         background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', 
                                         border: '1px solid #c084fc',
                                         boxShadow: '0 4px 12px rgba(168, 85, 247, 0.15)'
                                     }}>
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div className="d-flex align-items-center justify-content-center text-white rounded-circle" 
                                             style={{ width: 38, height: 38, flexShrink: 0, background: 'linear-gradient(135deg, #9333ea, #7e22ce)', boxShadow: '0 4px 10px rgba(147, 51, 234, 0.3)' }}>
                                            <i className="fa-solid fa-rotate-left" style={{ fontSize: 14 }}></i>
                                        </div>
                                        <div>
                                            <div className="fw-bold text-dark" style={{ fontSize: 13 }}>Return Replaced Product</div>
                                            <div className="small text-muted mt-0.5" style={{ fontSize: 11, whiteSpace: 'nowrap' }}>
                                                {repReturnWindowInfo.daysLeft === 0 ? (
                                                    <span>
                                                        Expires <strong className="text-danger">today at 11:59 PM (Last day today ⚠️)</strong>
                                                    </span>
                                                ) : (
                                                    <span>
                                                        Expires <strong>{repReturnWindowInfo.closeDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} at 11:59 PM</strong>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-grid">
                                        <Link to="/my-returns" 
                                              state={{ openCreateModal: true, selectOrderId: order.orderId }} 
                                              className="btn btn-sm fw-bold px-3 py-2 text-decoration-none text-center" 
                                              style={{ 
                                                  borderRadius: 12, 
                                                  background: '#9333ea', 
                                                  color: '#ffffff', 
                                                  border: '1px solid #9333ea', 
                                                  fontSize: 12, 
                                                  transition: 'all 0.2s ease',
                                                  boxShadow: '0 4px 10px rgba(147, 51, 234, 0.2)'
                                              }}
                                              onMouseOver={(e) => { e.currentTarget.style.background = '#7e22ce'; e.currentTarget.style.borderColor = '#7e22ce'; }}
                                              onMouseOut={(e) => { e.currentTarget.style.background = '#9333ea'; e.currentTarget.style.borderColor = '#9333ea'; }}>
                                            <i className="fa-solid fa-rotate-left me-1"></i> Return Replaced Product
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Expired Window — show only if there are still untouched items */}
                            {isWindowExpired && hasUntouchedItems && !hasActiveRep && !hasActiveReturn && (
                                <div className="mb-3 p-3 rounded-4 d-flex align-items-center gap-3"
                                     style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', border: '1px solid #cbd5e1', boxShadow: '0 2px 8px rgba(100, 116, 139, 0.08)' }}>
                                    <div className="d-flex align-items-center justify-content-center rounded-circle text-white"
                                         style={{ width: 38, height: 38, flexShrink: 0, background: 'linear-gradient(135deg, #94a3b8, #64748b)', boxShadow: '0 4px 10px rgba(100,116,139,0.25)' }}>
                                        <i className="fa-solid fa-lock" style={{ fontSize: 14 }}></i>
                                    </div>
                                    <div>
                                        <div className="fw-bold text-dark" style={{ fontSize: 13 }}>Return &amp; Replacement Window Closed</div>
                                        <div className="small" style={{ fontSize: 11, color: '#64748b' }}>
                                            <i className="fa-regular fa-calendar-xmark me-1 text-danger"></i>
                                            Expired on{' '}
                                            <strong className="text-danger">
                                                {windowInfo.closeDate?.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                            )}
                            </>
                        )}

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
