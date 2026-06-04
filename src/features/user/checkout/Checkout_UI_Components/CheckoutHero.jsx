import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutHero = () => {
    return (
        <div className="checkout-hero">
            <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb checkout-breadcrumb">
                        <li className="breadcrumb-item"><Link to="/reward-store" className="text-white opacity-75 text-decoration-none">Store</Link></li>
                        <li className="breadcrumb-item"><Link to="/cart" className="text-white opacity-75 text-decoration-none">Cart</Link></li>
                        <li className="breadcrumb-item active text-white fw-bold">Checkout</li>
                    </ol>
                </nav>
                <h1 className="checkout-hero-title">Secure Checkout</h1>
                <p className="checkout-hero-sub">Complete your eco-reward redemption</p>
            </div>
        </div>
    );
};

export default CheckoutHero;
