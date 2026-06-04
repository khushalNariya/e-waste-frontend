import React from 'react';
import { Link } from 'react-router-dom';

// Returns true only if order is Delivered AND within 1 calendar day of delivery
const isReturnEligible = (status, deliveredAt) => {
    if (!['delivered', 'returned'].includes(status?.toLowerCase())) return false;
    if (!deliveredAt) return false;
    
    const d1 = new Date(deliveredAt);
    d1.setHours(0, 0, 0, 0);
    const d2 = new Date();
    d2.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 1;
};

const OrderCard = ({ order, expandedOrder, setExpandedOrder, openCancelModal, formatDate, statusClass, statusIcon, paymentLabel }) => {
    const eligible = isReturnEligible(order.status, order.deliveredAt);
    
    const getDaysLeft = () => {
        if (!order.deliveredAt) return null;
        const d1 = new Date(order.deliveredAt);
        d1.setHours(0, 0, 0, 0);
        const d2 = new Date();
        d2.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
        return 1 - diffDays;
    };
    
    const daysLeft = eligible ? getDaysLeft() : null;

    // Window close date = delivered_at + 1 day (end of that calendar day)
    const getWindowCloseDate = () => {
        if (!order.deliveredAt) return null;
        const closeDate = new Date(order.deliveredAt);
        closeDate.setDate(closeDate.getDate() + 1);
        return closeDate;
    };
    const windowCloseDate = getWindowCloseDate();
    // True if order is Delivered, window has expired, and no active/completed returns or replaces
    const isWindowExpired = ['Delivered', 'Returned'].includes(order.status) && !eligible && !!order.deliveredAt;

    const reps = order.replaces || [];
    const hasActiveRep      = reps.some(r => !['replacement_delivered', 'rejected'].includes(r.replace_status));
    const hasCompletedRep   = reps.some(r => ['replacement_delivered'].includes(r.replace_status));
    const hasActiveReturn    = order.returns?.some(r => !['refunded', 'rejected'].includes(r.return_status));
    const hasCompletedReturn = order.returns?.some(r => ['refunded'].includes(r.return_status));

    // Compute per-item returned + replaced quantities by matching product id or name
    const itemReturnedQty = {};
    const itemReplacedQty = {};
    order.items?.forEach(item => {
        let retQty = 0;
        order.returns?.filter(r => !['rejected'].includes(r.return_status))
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

    return (
        <div className={`order-card ${
            order.status === 'Cancelled' ? 'order-card-cancelled' :
            order.status === 'Returned' ? 'order-card-returned' :
            hasCompletedRep ? 'order-card-replaced' :
            hasActiveRep ? 'order-card-replacing' : ''
        }`}>

            {/* Cancelled Ribbon */}
            {order.status === 'Cancelled' && (
                <div className="cancelled-ribbon">
                    <i className="fa-solid fa-ban me-1"></i> Cancelled
                </div>
            )}

            {/* Returned Ribbon */}
            {order.status === 'Returned' && (
                <div className="cancelled-ribbon" style={{ background: 'linear-gradient(135deg, #1cc88a, #0d6e4a)' }}>
                    <i className="fa-solid fa-rotate-left me-1"></i> Returned & Refunded
                </div>
            )}

            {/* Replaced Ribbon */}
            {hasCompletedRep && order.status !== 'Returned' && (
                <div className="cancelled-ribbon" style={{ background: 'linear-gradient(135deg, #4f46e5, #3730a3)', boxShadow: '0 2px 8px rgba(79, 70, 229, 0.4)' }}>
                    <i className="fa-solid fa-arrows-rotate me-1"></i> Product Replaced
                </div>
            )}

            {/* Replacement In Progress Ribbon */}
            {hasActiveRep && order.status !== 'Returned' && (
                <div className="cancelled-ribbon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)' }}>
                    <i className="fa-solid fa-arrows-rotate fa-spin me-1"></i> Replacing
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
                <div className="d-flex flex-column gap-2">
                    {order.items.map(item => {
                        const itemRep = reps.find(r => 
                            r.items_data?.some(repItem => repItem.product_name === item.name || repItem.product_id === item.id)
                        );
                        
                        const itemReturn = order.returns?.find(r => 
                            r.items_data?.some(retItem => retItem.product_name === item.name || retItem.product_id === item.id)
                        );

                        const replacedQty = itemReplacedQty[item.id] || 0;
                        const returnedQty = itemReturnedQty[item.id] || 0;

                        // Lookup actual quantity from request even if rejected (quantity calculation excludes rejected by default)
                        const actualRetQty = itemReturn?.items_data?.find(ri => ri.product_name === item.name || ri.product_id === item.id)?.quantity || returnedQty;
                        const actualRepQty = itemRep?.items_data?.find(ri => ri.product_name === item.name || ri.product_id === item.id)?.quantity || replacedQty;
                        
                        return (
                            <div key={item.id} className="py-2.5 px-3 rounded-4 d-flex align-items-center justify-content-between flex-wrap gap-3" 
                                 style={{ 
                                     background: '#f8fafc', 
                                     border: '1px solid #f1f5f9',
                                     transition: 'all 0.25s ease',
                                     position: 'relative'
                                 }}>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="order-item-thumb">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div>
                                        <div className="fw-bold text-dark" style={{ fontSize: 14, letterSpacing: '-0.3px' }}>{item.name}</div>
                                        <div className="small text-muted mt-0.5 fw-medium">{item.category} • Qty {item.quantity}</div>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    {/* Return status display */}
                                    {itemReturn && (
                                        <div className="d-flex align-items-center gap-1 flex-wrap">
                                            {(() => {
                                                const showQty = actualRetQty !== item.quantity ? ` (${actualRetQty} Qty)` : '';
                                                return ['refunded'].includes(itemReturn.return_status) ? (
                                                    <span className="badge-returned-success" style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                                        background: 'rgba(34, 197, 94, 0.09)',
                                                        borderRadius: 20, padding: '4px 12px',
                                                        fontSize: 11, fontWeight: 700, color: '#15803d',
                                                        border: 'none', letterSpacing: '0.1px'
                                                    }}>
                                                        <i className="fa-solid fa-circle-check" style={{ fontSize: 10 }}></i>
                                                        Returned{showQty}
                                                    </span>
                                                ) : itemReturn.return_status === 'rejected' ? (
                                                    <span className="badge-returned-rejected" style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                                        background: 'rgba(239, 68, 68, 0.09)',
                                                        borderRadius: 20, padding: '4px 12px',
                                                        fontSize: 11, fontWeight: 700, color: '#b91c1c',
                                                        border: 'none', letterSpacing: '0.1px'
                                                    }}>
                                                        <i className="fa-solid fa-circle-xmark" style={{ fontSize: 10 }}></i>
                                                        Rejected{showQty}
                                                    </span>
                                                ) : (
                                                    <span className="badge-returned-pending" style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                                        background: 'rgba(245, 158, 11, 0.09)',
                                                        borderRadius: 20, padding: '4px 12px',
                                                        fontSize: 11, fontWeight: 700, color: '#b45309',
                                                        border: 'none', letterSpacing: '0.1px'
                                                    }}>
                                                        <i className="fa-solid fa-rotate-left fa-spin" style={{ fontSize: 10 }}></i>
                                                        Return: {itemReturn.return_status.replace(/_/g, ' ').toUpperCase()}{showQty}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    )}

                                    {/* Replacement status display */}
                                    {itemRep && (
                                        <div className="d-flex align-items-center gap-1 flex-wrap">
                                            {(() => {
                                                const showQty = actualRepQty !== item.quantity ? ` (${actualRepQty} Qty)` : '';
                                                return ['replacement_delivered'].includes(itemRep.replace_status) ? (
                                                    <span className="badge-replaced-success" style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                                        background: 'rgba(99, 102, 241, 0.09)',
                                                        borderRadius: 20, padding: '4px 12px',
                                                        fontSize: 11, fontWeight: 700, color: '#4f46e5',
                                                        border: 'none', letterSpacing: '0.1px'
                                                    }}>
                                                        <i className="fa-solid fa-circle-check" style={{ fontSize: 10 }}></i>
                                                        Replaced{showQty}
                                                    </span>
                                                ) : itemRep.replace_status === 'rejected' ? (
                                                    <span className="badge-replaced-rejected" style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                                        background: 'rgba(239, 68, 68, 0.09)',
                                                        borderRadius: 20, padding: '4px 12px',
                                                        fontSize: 11, fontWeight: 700, color: '#b91c1c',
                                                        border: 'none', letterSpacing: '0.1px'
                                                    }}>
                                                        <i className="fa-solid fa-circle-xmark" style={{ fontSize: 10 }}></i>
                                                        Rejected{showQty}
                                                    </span>
                                                ) : (
                                                    <span className="badge-replaced-pending" style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                                        background: 'rgba(99, 102, 241, 0.09)',
                                                        borderRadius: 20, padding: '4px 12px',
                                                        fontSize: 11, fontWeight: 700, color: '#4f46e5',
                                                        border: 'none', letterSpacing: '0.1px'
                                                    }}>
                                                        <i className="fa-solid fa-arrows-rotate fa-spin" style={{ fontSize: 10 }}></i>
                                                        Replace: {itemRep.replace_status.replace(/_/g, ' ').toUpperCase()}{showQty}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Always-visible Return/Replace Window Status Strip */}
                {['Delivered', 'Returned'].includes(order.status) && order.deliveredAt && (
                    <div className="mx-0 mt-3.5 px-4 py-3 rounded-4 d-flex align-items-center justify-content-between flex-wrap gap-3"
                         style={{ background: '#f8fafc', border: 'none', boxShadow: 'none' }}>
                        <div className="d-flex align-items-center gap-2 small fw-bold text-uppercase" style={{ letterSpacing: '0.8px', fontSize: '11px', color: '#64748b' }}>
                            <i className="fa-solid fa-clock text-muted" style={{ fontSize: '13px' }}></i> Support Windows
                        </div>
                        
                        <div className="d-flex flex-wrap gap-2 align-items-center">
                            {/* Window OPEN — show only if there are items not yet actioned */}
                            {eligible && hasUntouchedItems && (
                                <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill"
                                     style={{ 
                                         background: daysLeft === 0 ? 'rgba(249, 115, 22, 0.12)' : 'rgba(34, 197, 94, 0.09)', 
                                         color: daysLeft === 0 ? '#c2410c' : '#15803d',
                                         fontSize: 11,
                                         fontWeight: 700,
                                         border: 'none',
                                         letterSpacing: '0.2px'
                                     }}>
                                    {daysLeft === 0 ? (
                                        <>
                                            <span className="position-relative d-inline-flex" style={{ width: 6, height: 6 }}>
                                                <span className="position-absolute w-100 h-100 rounded-circle bg-danger opacity-75 animate-ping" style={{ animation: 'ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite' }}></span>
                                                <span className="position-relative rounded-circle bg-danger" style={{ width: 6, height: 6 }}></span>
                                            </span>
                                            <i className="fa-solid fa-triangle-exclamation animate-bounce" style={{ fontSize: 11, color: '#ea580c' }}></i>
                                            <span>Return/Replace:</span>
                                            <span className="fw-bold">Expires Today ⚠️</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="position-relative d-inline-flex" style={{ width: 6, height: 6 }}>
                                                <span className="position-absolute w-100 h-100 rounded-circle bg-success opacity-75 animate-ping" style={{ animation: 'ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite' }}></span>
                                                <span className="position-relative rounded-circle bg-success" style={{ width: 6, height: 6 }}></span>
                                            </span>
                                            <span>Return/Replace:</span>
                                            <span className="fw-bold">Ends {windowCloseDate?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Window EXPIRED — show only if there are still unactioned items */}
                            {isWindowExpired && hasUntouchedItems && !hasActiveRep && !hasActiveReturn && (
                                <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill"
                                     style={{ 
                                         background: 'rgba(148, 163, 184, 0.08)', 
                                         color: '#94a3b8',
                                         fontSize: 11,
                                         fontWeight: 600,
                                         border: 'none'
                                     }}>
                                    <i className="fa-solid fa-lock" style={{ fontSize: 10, color: '#94a3b8' }}></i>
                                    <span>Return/Replace:</span>
                                    <span className="fw-bold">Closed</span>
                                </div>
                            )}

                            {/* Replacement Return Window — show after a replacement is delivered and not fully returned */}
                            {repReturnWindowInfo && hasReplacedButNotReturned && (
                                <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill"
                                     style={{
                                         background: repReturnWindowInfo.open 
                                             ? (repReturnWindowInfo.daysLeft === 0 ? 'rgba(249, 115, 22, 0.12)' : 'rgba(99, 102, 241, 0.09)') 
                                             : 'rgba(148, 163, 184, 0.08)',
                                         color: repReturnWindowInfo.open 
                                             ? (repReturnWindowInfo.daysLeft === 0 ? '#c2410c' : '#4f46e5') 
                                             : '#94a3b8',
                                         fontSize: 11,
                                         fontWeight: repReturnWindowInfo.open ? 700 : 600,
                                         border: 'none',
                                         letterSpacing: '0.2px'
                                     }}>
                                    {repReturnWindowInfo.open ? (
                                        <>
                                            <span className="position-relative d-inline-flex" style={{ width: 6, height: 6 }}>
                                                <span className={`position-absolute w-100 h-100 rounded-circle opacity-75 animate-ping ${repReturnWindowInfo.daysLeft === 0 ? 'bg-danger' : 'bg-primary'}`} style={{ animation: 'ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite' }}></span>
                                                <span className={`position-relative rounded-circle ${repReturnWindowInfo.daysLeft === 0 ? 'bg-danger' : 'bg-primary'}`} style={{ width: 6, height: 6 }}></span>
                                            </span>
                                            {repReturnWindowInfo.daysLeft === 0 && <i className="fa-solid fa-triangle-exclamation animate-pulse" style={{ fontSize: 11, color: '#ea580c' }}></i>}
                                            <span>Replaced Return:</span>
                                            <span className="fw-bold">
                                                {repReturnWindowInfo.daysLeft === 0 
                                                    ? "Expires Today ⚠️" 
                                                    : `Ends ${repReturnWindowInfo.closeDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
                                                }
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-lock" style={{ fontSize: 10, color: '#94a3b8' }}></i>
                                            <span>Replaced Return:</span>
                                            <span className="fw-bold">Closed</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

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
                                    {order.deliveredAt && (
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="small text-muted">Delivered On</span>
                                            <span className="small fw-bold text-success">
                                                <i className="fa-solid fa-circle-check me-1"></i>
                                                {formatDate(order.deliveredAt)}
                                            </span>
                                        </div>
                                    )}
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

                            {/* Premium Return & Replace Action Panel (for untouched items) */}
                            {eligible && hasUntouchedItems && (
                                <div className="col-12 mt-3">
                                    <div className="p-3 rounded-4 d-flex align-items-center justify-content-between flex-wrap gap-3" 
                                         style={{ 
                                             background: 'linear-gradient(135deg, #fffcf5 0%, #fffbeb 100%)', 
                                             border: '1px solid #fde68a',
                                             boxShadow: '0 4px 12px rgba(253, 230, 138, 0.15)'
                                         }}>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="d-flex align-items-center justify-content-center bg-warning text-white rounded-circle" 
                                                 style={{ width: 42, height: 42, flexShrink: 0, boxShadow: '0 4px 10px rgba(245, 158, 11, 0.3)' }}>
                                                <i className="fa-solid fa-clock-rotate-left"></i>
                                            </div>
                                            <div>
                                                <div className="fw-bold text-dark" style={{ fontSize: 14 }}>Return or Replacement Available</div>
                                                <div className="small text-muted mt-0.5" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                                                     {daysLeft === 0 ? (
                                                         <span>
                                                             Expires <strong className="text-danger">today at 11:59 PM (Last day today ⚠️)</strong>
                                                         </span>
                                                     ) : (
                                                         <span>
                                                             You have <strong>{daysLeft} day{daysLeft !== 1 ? 's' : ''}</strong> remaining to request a return or replacement.
                                                         </span>
                                                     )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <Link to="/my-returns" 
                                                  state={{ openCreateModal: true, selectOrderId: order.orderId }} 
                                                  className="btn btn-sm fw-bold px-3 py-2 text-decoration-none" 
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
                                                  className="btn btn-sm fw-bold px-3 py-2 text-decoration-none" 
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
                                </div>
                            )}

                            {/* Return Replaced Product Action Panel */}
                            {repReturnWindowInfo && repReturnWindowInfo.open && hasReplacedButNotReturned && (
                                <div className="col-12 mt-3">
                                    <div className="p-3 rounded-4 d-flex align-items-center justify-content-between flex-wrap gap-3" 
                                         style={{ 
                                             background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', 
                                             border: '1px solid #c084fc',
                                             boxShadow: '0 4px 12px rgba(168, 85, 247, 0.15)'
                                         }}>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="d-flex align-items-center justify-content-center text-white rounded-circle" 
                                                 style={{ width: 42, height: 42, flexShrink: 0, background: 'linear-gradient(135deg, #9333ea, #7e22ce)', boxShadow: '0 4px 10px rgba(147, 51, 234, 0.3)' }}>
                                                <i className="fa-solid fa-rotate-left"></i>
                                            </div>
                                            <div>
                                                <div className="fw-bold text-dark" style={{ fontSize: 14 }}>Return Replaced Product</div>
                                                <div className="small text-muted mt-0.5" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
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
                                        <div className="d-flex gap-2">
                                            <Link to="/my-returns" 
                                                  state={{ openCreateModal: true, selectOrderId: order.orderId }} 
                                                  className="btn btn-sm fw-bold px-3 py-2 text-decoration-none" 
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
                                </div>
                            )}

                            {/* Expired Return/Replace Window Panel */}
                            {isWindowExpired && hasUntouchedItems && !hasActiveRep && !hasActiveReturn && (
                                <div className="col-12 mt-3">
                                    <div className="p-3 rounded-4 d-flex align-items-center gap-3 flex-wrap"
                                         style={{
                                             background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                             border: '1px solid #cbd5e1',
                                             boxShadow: '0 2px 8px rgba(100, 116, 139, 0.08)'
                                         }}>
                                        <div className="d-flex align-items-center justify-content-center rounded-circle text-white"
                                             style={{ width: 42, height: 42, flexShrink: 0, background: 'linear-gradient(135deg, #94a3b8, #64748b)', boxShadow: '0 4px 10px rgba(100,116,139,0.25)' }}>
                                            <i className="fa-solid fa-lock"></i>
                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="fw-bold text-dark" style={{ fontSize: 14 }}>
                                                Return &amp; Replacement Window Closed
                                            </div>
                                            <div className="small mt-0.5" style={{ fontSize: 12, color: '#64748b' }}>
                                                <i className="fa-regular fa-calendar-xmark me-1 text-danger"></i>
                                                Expired on{' '}
                                                <strong className="text-danger">
                                                    {windowCloseDate?.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </strong>
                                                {' '}at{' '}
                                                <strong className="text-danger">11:59 PM</strong>
                                                {' '}— 1-day return/replace policy window has passed.
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <a href="/contact" className="btn btn-sm fw-bold"
                                               style={{ borderRadius: 10, fontSize: 12, background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>
                                                <i className="fa-solid fa-headset me-1"></i> Need Help?
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Cancellation refund note */}
                        {order.status === 'Cancelled' && (
                            <div className="cancel-refund-note mt-3">
                                <i className="fa-solid fa-rotate-left me-2 text-success"></i>
                                <span><strong>{order.totalPoints.toLocaleString()} PTS</strong> will be refunded to your eco-wallet within 24 hours.</span>
                            </div>
                        )}

                        {/* Modern Admin Cancellation Message */}
                        {order.adminNotes && (
                            <div className="mt-3 p-3 rounded-4 d-flex align-items-center gap-3" 
                                 style={{ 
                                    background: 'rgba(255, 107, 107, 0.08)', 
                                    border: '1px solid rgba(255, 107, 107, 0.2)',
                                    backdropFilter: 'blur(5px)'
                                 }}>
                                <div className="d-flex align-items-center justify-content-center bg-danger text-white rounded-circle" 
                                     style={{ width: 40, height: 40, flexShrink: 0, boxShadow: '0 4px 10px rgba(255, 107, 107, 0.3)' }}>
                                    <i className="fa-solid fa-user-shield"></i>
                                </div>
                                <div>
                                    <div className="fw-bold text-danger mb-1" style={{ fontSize: 13 }}>System Notification</div>
                                    <div className="text-dark-50" style={{ fontSize: 12, lineHeight: 1.4 }}>{order.adminNotes}</div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Card Footer */}
            <div className="order-card-footer">
                <div className="fw-bold text-dark">
                    Total: <span className={
                        order.status === 'Cancelled' ? 'text-muted text-decoration-line-through' :
                        order.status === 'Returned'  ? 'text-success text-decoration-line-through' :
                        'text-success'
                    }>
                        {order.totalPoints.toLocaleString()}
                    </span>
                    {order.status === 'Cancelled' && (
                        <span className="text-muted ms-1 small fw-normal">PTS (Refunding)</span>
                    )}
                    {order.status === 'Returned' && (
                        <span className="ms-1 small fw-semibold" style={{ color: '#1cc88a' }}>
                            PTS&nbsp;<i className="fa-solid fa-rotate-left me-1"></i>Refunded to Wallet ✓
                        </span>
                    )}
                    {!['Cancelled', 'Returned'].includes(order.status) && (
                        <span className="text-muted ms-1 small fw-normal">PTS Redeemed</span>
                    )}
                </div>
            <div className="d-flex gap-2 flex-wrap">
                    {order.status === 'Delivered' && (
                        <Link to="/reward-store" className="btn btn-sm fw-semibold text-decoration-none" style={{ borderRadius: 10, background: '#e8f9f2', color: '#1cc88a', border: '1px solid #c6f6e0', fontSize: 13 }}>
                            <i className="fa-solid fa-star me-1"></i> Review
                        </Link>
                    )}
                    
                    {!['Cancelled', 'Returned'].includes(order.status) && (
                        <Link to="/reward-store" className="btn btn-sm fw-semibold text-decoration-none" style={{ borderRadius: 10, background: '#f0f4f8', color: '#4a5568', border: '1px solid #e2e8f0', fontSize: 13 }}>
                            <i className="fa-solid fa-rotate-right me-1"></i> Reorder
                        </Link>
                    )}
                    <Link to="/order-confirmation" 
                          state={{ order: order }}
                          className="btn btn-sm fw-semibold text-decoration-none" 
                          style={{ borderRadius: 10, background: '#f0f4f8', color: '#4a5568', border: '1px solid #e2e8f0', fontSize: 13 }}>
                        <i className="fa-solid fa-eye me-1"></i> View
                    </Link>
 
                    {/* Track Replacement Button */}
                    {reps.length > 0 && (
                        <Link to="/my-replaces" 
                              className="btn btn-sm fw-semibold text-decoration-none" 
                              style={{ borderRadius: 10, background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)', color: '#4338ca', border: '1px solid #a5b4fc', fontSize: 13 }}>
                            <i className="fa-solid fa-arrows-rotate me-1"></i> Track Replacement
                        </Link>
                    )}
 
                    {/* Track Return Button */}
                    {order.returns?.length > 0 && (
                        <Link to="/my-returns" 
                              className="btn btn-sm fw-semibold text-decoration-none" 
                              style={{ borderRadius: 10, background: 'linear-gradient(135deg, #e8f9f2, #c6f6e0)', color: '#0d6e4a', border: '1px solid #6ee7b7', fontSize: 13 }}>
                            <i className="fa-solid fa-rotate-left me-1"></i> Track Return
                        </Link>
                    )}
 
                    {/* Cancel Button — for orders before shipping */}
                    {['Pending', 'Confirmed', 'Processing', 'Packed'].includes(order.status) && (
                        <button
                            className="btn btn-sm fw-semibold cancel-order-btn"
                            onClick={() => openCancelModal(order)}
                        >
                            <i className="fa-solid fa-ban me-1"></i> Cancel Order
                        </button>
                    )}
 
                    {/* Returned & Refunded note */}
                    {order.status === 'Returned' && (
                        <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill border" style={{ fontSize: 12, background: '#e8f9f2', borderColor: '#c6f6e0' }}>
                            <i className="fa-solid fa-rotate-left text-success"></i>
                            <span className="text-success fw-semibold">Return completed. Points have been refunded to your wallet.</span>
                        </div>
                    )}
 
                    {/* Replaced completed note */}
                    {hasCompletedRep && order.status !== 'Returned' && (
                        <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill border" style={{ fontSize: 12, background: '#e0e7ff', borderColor: '#a5b4fc' }}>
                            <i className="fa-solid fa-circle-check text-primary"></i>
                            <span className="text-primary fw-semibold">Replacement completed. Your item swap was successful!</span>
                        </div>
                    )}
 
                    {/* Replacement in progress note */}
                    {hasActiveRep && order.status !== 'Returned' && (
                        <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill border" style={{ fontSize: 12, background: '#fffbeb', borderColor: '#fde68a' }}>
                            <i className="fa-solid fa-arrows-rotate fa-spin text-warning"></i>
                            <span className="fw-semibold" style={{ color: '#b45309' }}>Replacement in progress. Handover item to courier on pickup.</span>
                        </div>
                    )}
 
                    {/* Return in progress note */}
                    {order.returns?.some(r => !['refunded', 'rejected'].includes(r.return_status)) && order.status !== 'Returned' && (
                        <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill border" style={{ fontSize: 12, background: '#e8f9f2', borderColor: '#c6f6e0' }}>
                            <i className="fa-solid fa-rotate-left fa-spin text-warning" style={{ color: '#10b981' }}></i>
                            <span className="fw-semibold" style={{ color: '#047857' }}>Return in progress. Handover item to courier on pickup.</span>
                        </div>
                    )}
 
                    {/* Professional message for Shipped/Delivered orders */}
                    {['Shipped', 'Delivered'].includes(order.status) && !hasActiveRep && !hasCompletedRep && (
                        <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-light border" style={{ fontSize: 12 }}>
                            <i className="fa-solid fa-circle-info text-primary"></i>
                            <span className="text-muted">Order is in transit/delivered. Need help? <Link to="/contact" className="text-primary fw-bold text-decoration-none">Contact Support</Link></span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderCard;
