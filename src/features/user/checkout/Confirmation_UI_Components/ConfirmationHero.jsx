import React from 'react';

const ConfirmationHero = ({ orderId, isCancelled, isReturned }) => {

    const getEmoji  = () => isCancelled ? '🛑' : isReturned ? '↩️' : '🎉';
    const getTitle  = () => isCancelled ? 'Order Status Update' : isReturned ? 'Return & Refund Processed' : 'Order Confirmed!';
    const getDesc   = () => {
        if (isCancelled) return 'This order has been cancelled and is no longer being processed.';
        if (isReturned)  return 'Your return was completed and points have been credited back to your eco-wallet.';
        return 'Your eco-reward has been successfully redeemed. Thank you for recycling!';
    };

    const heroBg = isReturned
        ? 'linear-gradient(135deg, #0d6e4a 0%, #1cc88a 100%)'
        : undefined; // default CSS from stylesheet

    return (
        <div className="confirmation-hero-card" style={heroBg ? { background: heroBg } : {}}>
            <div className={`success-icon-ring ${isCancelled ? 'bg-danger-subtle border-danger text-danger' : ''}`}
                 style={isReturned ? { background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.5)' } : {}}>
                {getEmoji()}
            </div>
            <h1 className="confirmation-title">{getTitle()}</h1>
            <p className="confirmation-subtitle">{getDesc()}</p>
            <div className={`order-id-badge ${isCancelled ? 'bg-danger text-white border-danger' : ''}`}>
                <i className="fa-solid fa-hashtag me-1"></i> {orderId}
            </div>
        </div>
    );
};

export default ConfirmationHero;
