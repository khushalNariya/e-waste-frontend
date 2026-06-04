import React from 'react';
import { Link } from 'react-router-dom';

const EmptyCart = () => {
    return (
        <div className="checkout-page min-vh-100 d-flex align-items-center justify-content-center">
            <div className="text-center p-5">
                <div className="empty-icon-wrapper mb-4">
                    <i className="fa-solid fa-cart-shopping fa-4x text-success opacity-50"></i>
                </div>
                <h3 className="fw-bold text-dark mb-3">Your cart is empty!</h3>
                <p className="text-muted mb-4">Add some rewards before proceeding to checkout.</p>
                <Link to="/reward-store" className="btn checkout-btn-primary px-5 py-3">
                    Browse Rewards <i className="fa-solid fa-arrow-right ms-2"></i>
                </Link>
            </div>
        </div>
    );
};

export default EmptyCart;
