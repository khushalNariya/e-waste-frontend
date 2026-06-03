import React from 'react';

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

const OrderedItems = ({ order }) => {
    const eligible = isReturnEligible(order.status, order.deliveredAt);
    const reps = order.replaces || [];
    const returns = order.returns || [];

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

    return (
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

            {order.items.map(item => {
                const itemRep = reps.find(r =>
                    r.items_data?.some(repItem => repItem.product_name === item.name || repItem.product_id === item.id)
                );
                const itemReturn = returns.find(r =>
                    r.items_data?.some(retItem => retItem.product_name === item.name || retItem.product_id === item.id)
                );

                // Find all replacement requests for this item and sum their quantities
                const itemReps = reps.filter(r => !['rejected'].includes(r.replace_status));
                let replacedQty = 0;
                itemReps.forEach(r => {
                    const match = r.items_data?.find(ri => ri.product_name === item.name || ri.product_id === item.id);
                    if (match) {
                        replacedQty += match.quantity;
                    }
                });

                // Find all return requests for this item and sum their quantities
                const itemReturns = returns.filter(r => !['rejected'].includes(r.return_status));
                let returnedQty = 0;
                itemReturns.forEach(r => {
                    const match = r.items_data?.find(ri => ri.product_name === item.name || ri.product_id === item.id);
                    if (match) {
                        returnedQty += match.quantity;
                    }
                });

                const remainingQty = item.quantity - (returnedQty + replacedQty);
                const hasRemaining = remainingQty > 0;

                const isWindowExpired = !eligible && !!order.deliveredAt;
                const hasActiveReturn = itemReturn && itemReturn.return_status !== 'rejected';

                return (
                    <div key={item.id} className="conf-item">
                        <div className="conf-item-img">
                            <img src={item.image} alt={item.name} />
                        </div>
                        <div className="flex-grow-1">
                            <div className="fw-semibold text-dark">{item.name}</div>
                            <div className="small text-muted">{item.category} • Qty: {item.quantity}</div>

                            {/* Return status display */}
                            {itemReturn && (
                                <div className="d-flex align-items-center gap-1 mt-1 flex-wrap">
                                    {['refunded'].includes(itemReturn.return_status) ? (
                                        <span className="badge-returned-success" style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 5,
                                            background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                                            border: '1px solid #6ee7b7',
                                            borderRadius: 20, padding: '3px 10px',
                                            fontSize: 11, fontWeight: 600, color: '#065f46'
                                        }}>
                                            <i className="fa-solid fa-circle-check" style={{ fontSize: 10 }}></i>
                                            Returned &amp; Refunded ({returnedQty} Qty) ✓
                                        </span>
                                    ) : itemReturn.return_status === 'rejected' ? (
                                        <span className="badge-returned-rejected" style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 5,
                                            background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
                                            border: '1px solid #fca5a5',
                                            borderRadius: 20, padding: '3px 10px',
                                            fontSize: 11, fontWeight: 600, color: '#b91c1c'
                                        }}>
                                            <i className="fa-solid fa-circle-xmark" style={{ fontSize: 10 }}></i>
                                            Return Rejected ({returnedQty} Qty)
                                        </span>
                                    ) : (
                                        <span className="badge-returned-pending" style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 5,
                                            background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                                            border: '1px solid #fde68a',
                                            borderRadius: 20, padding: '3px 10px',
                                            fontSize: 11, fontWeight: 600, color: '#b45309'
                                        }}>
                                            <i className="fa-solid fa-rotate-left fa-spin" style={{ fontSize: 10 }}></i>
                                            Return: {itemReturn.return_status.replace(/_/g, ' ').toUpperCase()} ({returnedQty} Qty) 🔄
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Replacement status display */}
                            {itemRep && (
                                <div className="d-flex align-items-center gap-1 mt-1 flex-wrap">
                                    {['replacement_delivered'].includes(itemRep.replace_status) ? (
                                        <>
                                            <span className="badge-replaced-success" style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 5,
                                                background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                                                border: '1px solid #a5b4fc',
                                                borderRadius: 20, padding: '3px 10px',
                                                fontSize: 11, fontWeight: 600, color: '#4338ca'
                                            }}>
                                                <i className="fa-solid fa-circle-check" style={{ fontSize: 10 }}></i>
                                                Replacement Successful ({replacedQty} Qty) ✓
                                            </span>
                                            {!hasActiveReturn && (() => {
                                                const repWindow = itemRep.replacement_delivered_at ? (() => {
                                                    const d1 = new Date(itemRep.replacement_delivered_at);
                                                    d1.setHours(0, 0, 0, 0);
                                                    const d2 = new Date();
                                                    d2.setHours(0, 0, 0, 0);
                                                    const diffDays = Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
                                                    const closeDate = new Date(itemRep.replacement_delivered_at);
                                                    closeDate.setDate(closeDate.getDate() + 1);
                                                    return { open: diffDays <= 1, closeDate, daysLeft: 1 - diffDays };
                                                })() : null;

                                                if (!repWindow) return null;
                                                return repWindow.open ? (
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: 5,
                                                        background: repWindow.daysLeft === 0 ? '#fffbeb' : 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
                                                        border: `1px solid ${repWindow.daysLeft === 0 ? '#f59e0b' : '#c7d2fe'}`,
                                                        borderRadius: 20, padding: '3px 10px',
                                                        fontSize: 11, fontWeight: 600, color: repWindow.daysLeft === 0 ? '#b45309' : '#6d28d9'
                                                    }}>
                                                        <i className="fa-solid fa-rotate-left" style={{ fontSize: 10 }}></i>
                                                        Replaced Return Open · {repWindow.daysLeft === 0 ? "Closes Today ⚠️" : `Closes ${repWindow.closeDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
                                                    </span>
                                                ) : (
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: 5,
                                                        background: '#f8fafc',
                                                        border: '1px solid #cbd5e1',
                                                        borderRadius: 20, padding: '3px 10px',
                                                        fontSize: 11, fontWeight: 600, color: '#64748b'
                                                    }}>
                                                        <i className="fa-solid fa-lock" style={{ fontSize: 10 }}></i>
                                                        Replaced Return Window Closed
                                                    </span>
                                                );
                                            })()}
                                        </>
                                    ) : itemRep.replace_status === 'rejected' ? (
                                        <span className="badge-replaced-rejected" style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 5,
                                            background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
                                            border: '1px solid #fca5a5',
                                            borderRadius: 20, padding: '3px 10px',
                                            fontSize: 11, fontWeight: 600, color: '#b91c1c'
                                        }}>
                                            <i className="fa-solid fa-circle-xmark" style={{ fontSize: 10 }}></i>
                                            Replacement Rejected ({replacedQty} Qty)
                                        </span>
                                    ) : (
                                        <span className="badge-replaced-pending" style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 5,
                                            background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                                            border: '1px solid #fde68a',
                                            borderRadius: 20, padding: '3px 10px',
                                            fontSize: 11, fontWeight: 600, color: '#b45309'
                                        }}>
                                            <i className="fa-solid fa-arrows-rotate fa-spin" style={{ fontSize: 10 }}></i>
                                            Replacement: {itemRep.replace_status.replace(/_/g, ' ').toUpperCase()} ({replacedQty} Qty) 🔄
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* ✅ Return & Replace Available badge — hide if active return request exists */}
                            {eligible && hasRemaining && !hasActiveReturn && (
                                <div className="d-flex align-items-center gap-1 mt-1 flex-wrap">
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 5,
                                        background: 'linear-gradient(135deg, #e8f9f2, #d4f5e7)',
                                        border: '1px solid #a8e6c8',
                                        borderRadius: 20, padding: '3px 10px',
                                        fontSize: 11, fontWeight: 600, color: '#0d6e4a'
                                    }}>
                                        <i className="fa-solid fa-rotate-left" style={{ fontSize: 10 }}></i>
                                        Return &amp; Replace Available ({remainingQty} Qty)
                                    </span>
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 4,
                                        background: daysLeft === 0 ? '#fffbeb' : '#f0fdf9',
                                        border: `1px solid ${daysLeft === 0 ? '#f59e0b' : '#c6f6e0'}`,
                                        borderRadius: 20, padding: '3px 10px',
                                        fontSize: 11, fontWeight: 600,
                                        color: daysLeft === 0 ? '#b45309' : '#1cc88a'
                                    }}>
                                        <i className="fa-solid fa-clock" style={{ fontSize: 10 }}></i>
                                        {daysLeft === 0 ? "Last day today" : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
                                    </span>
                                </div>
                            )}

                            {/* Window Closed badge — show if expired and has remaining items not actioned and no active return */}
                            {isWindowExpired && hasRemaining && !itemRep && !hasActiveReturn && (
                                <div className="d-flex align-items-center gap-1 mt-1 flex-wrap">
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 5,
                                        background: '#f8fafc',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: 20, padding: '3px 10px',
                                        fontSize: 11, fontWeight: 600, color: '#64748b'
                                    }}>
                                        <i className="fa-solid fa-lock" style={{ fontSize: 10 }}></i>
                                        Return/Replace Window Closed
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="text-end">
                            <div className="fw-bold text-success">{item.points * item.quantity}</div>
                            <div style={{ fontSize: '11px', color: '#9e9e9e' }}>PTS</div>
                        </div>
                    </div>
                );
            })}
            <div className="d-flex justify-content-between align-items-center px-4 py-3 bg-light">
                <span className="fw-bold text-dark">Total Redeemed</span>
                <span className="fs-5 fw-black text-success">{order.totalPoints.toLocaleString()} <span className="fs-6 text-muted">PTS</span></span>
            </div>
        </div>
    );
};

export default OrderedItems;
