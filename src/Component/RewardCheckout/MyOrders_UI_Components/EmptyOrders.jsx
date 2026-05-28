import React from 'react';
import { Link } from 'react-router-dom';

const EmptyOrders = ({ activeTab }) => {
    return (
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
    );
};

export default EmptyOrders;
