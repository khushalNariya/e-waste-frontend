import React from 'react';
import { Link } from 'react-router-dom';

const OrdersHeader = ({ orders, totalPointsRedeemed }) => {
    return (
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
                    <span className="stat-value">{orders.filter(o => o.status === 'Returned').length}</span>
                    <span className="stat-label">Returned</span>
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
    );
};

export default OrdersHeader;
