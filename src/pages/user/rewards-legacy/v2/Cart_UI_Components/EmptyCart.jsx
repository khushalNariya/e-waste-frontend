import React from 'react';
import { Link } from 'react-router-dom';

const EmptyCart = () => {
    return (
        <div className="cart-page py-5 bg-light min-vh-100 d-flex align-items-center">
            <div className="container">
                <div className="empty-cart-card mx-auto p-5 border-0 rounded-4 shadow-sm bg-white text-center" style={{ maxWidth: '600px' }}>
                    <div className="mb-4 d-inline-block p-4 rounded-circle" style={{ background: '#e8f9f2' }}>
                        <i className="fa-solid fa-box-open fa-4x text-success"></i>
                    </div>
                    <h2 className="fw-bolder mb-3 text-dark">Your Reward Box is Empty</h2>
                    <p className="text-muted mb-4 fs-6">Recycle e-waste, earn points, and pick your favorite rewards here!</p>
                    <Link to="/reward-store" className="btn btn-eco-redeem px-5 py-3 fw-bold">
                        Explore Rewards <i className="fa-solid fa-arrow-right-long ms-2"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EmptyCart;
