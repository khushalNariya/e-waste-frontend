import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [totalPoints, setTotalPoints] = useState(0);
    const [step, setStep] = useState(1); // 1=Address, 2=Payment
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [address, setAddress] = useState({
        fullName: 'Khushal Patel',
        phone: '9876543210',
        pincode: '380001',
        address: '12, Green Park Society, Near Satellite Road',
        city: 'Ahmedabad',
        state: 'Gujarat',
        landmark: 'Near ISRO Gate'
    });

    const [paymentMethod, setPaymentMethod] = useState('points');

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('rewardCart') || '[]');
        setCart(storedCart);
        const total = storedCart.reduce((acc, item) => acc + item.points * (item.weight || 1) * item.quantity, 0);
        setTotalPoints(total);
    }, []);

    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = () => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            // Save order to localStorage for history
            const existingOrders = JSON.parse(localStorage.getItem('rewardOrders') || '[]');
            const newOrder = {
                orderId: `ECO-${Date.now()}`,
                date: new Date().toISOString(),
                items: cart,
                totalPoints,
                address,
                paymentMethod,
                status: 'Processing',
                estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            };
            existingOrders.unshift(newOrder);
            localStorage.setItem('rewardOrders', JSON.stringify(existingOrders));
            localStorage.removeItem('rewardCart');
            window.dispatchEvent(new Event('cartUpdated'));
            navigate('/order-confirmation', { state: { order: newOrder } });
        }, 1500);
    };

    if (cart.length === 0) {
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
    }

    return (
        <div className="checkout-page min-vh-100">
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

            <div className="container py-5">
                {/* Progress Steps */}
                <div className="checkout-steps mb-5">
                    <div className={`checkout-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}>
                        <div className="step-circle">
                            {step > 1 ? <i className="fa-solid fa-check"></i> : '1'}
                        </div>
                        <span className="step-label">Delivery Address</span>
                    </div>
                    <div className="step-line"></div>
                    <div className={`checkout-step ${step >= 2 ? 'active' : ''}`}>
                        <div className="step-circle">2</div>
                        <span className="step-label">Redemption Method</span>
                    </div>
                    <div className="step-line"></div>
                    <div className="checkout-step">
                        <div className="step-circle">3</div>
                        <span className="step-label">Confirm Order</span>
                    </div>
                </div>

                <div className="row g-5">
                    {/* Left Panel */}
                    <div className="col-lg-8">
                        {/* STEP 1: Address */}
                        {step === 1 && (
                            <div className="checkout-card animate-slide-in">
                                <div className="checkout-card-header">
                                    <div className="header-icon"><i className="fa-solid fa-location-dot"></i></div>
                                    <div>
                                        <h4 className="mb-0 fw-bold">Delivery Address</h4>
                                        <p className="mb-0 small opacity-75">Where should we send your reward?</p>
                                    </div>
                                </div>
                                <div className="checkout-card-body">
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <label className="form-label checkout-label">Full Name *</label>
                                            <input type="text" name="fullName" className="form-control checkout-input" value={address.fullName} onChange={handleAddressChange} placeholder="Enter your full name" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label checkout-label">Phone Number *</label>
                                            <input type="tel" name="phone" className="form-control checkout-input" value={address.phone} onChange={handleAddressChange} placeholder="10-digit mobile number" />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label checkout-label">Street Address *</label>
                                            <textarea name="address" rows="2" className="form-control checkout-input" value={address.address} onChange={handleAddressChange} placeholder="House No, Building, Street, Area" />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label checkout-label">Pincode *</label>
                                            <input type="text" name="pincode" className="form-control checkout-input" value={address.pincode} onChange={handleAddressChange} placeholder="6-digit pincode" />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label checkout-label">City *</label>
                                            <input type="text" name="city" className="form-control checkout-input" value={address.city} onChange={handleAddressChange} placeholder="City" />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label checkout-label">State *</label>
                                            <select name="state" className="form-select checkout-input" value={address.state} onChange={handleAddressChange}>
                                                {['Gujarat', 'Maharashtra', 'Rajasthan', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal', 'Madhya Pradesh', 'Telangana'].map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label checkout-label">Landmark (Optional)</label>
                                            <input type="text" name="landmark" className="form-control checkout-input" value={address.landmark} onChange={handleAddressChange} placeholder="Near school, hospital, etc." />
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end mt-4">
                                        <button className="btn checkout-btn-primary px-5 py-3 fw-bold" onClick={() => setStep(2)}>
                                            Continue to Payment <i className="fa-solid fa-arrow-right ms-2"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Payment Method */}
                        {step === 2 && (
                            <div className="checkout-card animate-slide-in">
                                <div className="checkout-card-header">
                                    <div className="header-icon"><i className="fa-solid fa-coins"></i></div>
                                    <div>
                                        <h4 className="mb-0 fw-bold">Redemption Method</h4>
                                        <p className="mb-0 small opacity-75">Choose how to redeem your eco-points</p>
                                    </div>
                                </div>
                                <div className="checkout-card-body">
                                    <div className="payment-options">
                                        <label className={`payment-option ${paymentMethod === 'points' ? 'selected' : ''}`}>
                                            <input type="radio" name="payment" value="points" checked={paymentMethod === 'points'} onChange={() => setPaymentMethod('points')} hidden />
                                            <div className="payment-option-icon" style={{ background: '#e8f9f2' }}>
                                                <i className="fa-solid fa-coins text-success"></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="fw-bold text-dark">Eco Points</div>
                                                <div className="small text-muted">Redeem using your earned recycling points</div>
                                            </div>
                                            <div className="payment-option-check">
                                                <i className="fa-solid fa-circle-check text-success fs-5"></i>
                                            </div>
                                        </label>

                                        <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                                            <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} hidden />
                                            <div className="payment-option-icon" style={{ background: '#fff3e0' }}>
                                                <i className="fa-solid fa-mobile-screen-button text-warning"></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="fw-bold text-dark">UPI Payment</div>
                                                <div className="small text-muted">Pay via Google Pay, PhonePe, Paytm etc.</div>
                                            </div>
                                            <div className="payment-option-check">
                                                <i className="fa-solid fa-circle-check text-success fs-5"></i>
                                            </div>
                                        </label>

                                        <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                                            <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} hidden />
                                            <div className="payment-option-icon" style={{ background: '#e8eaf6' }}>
                                                <i className="fa-solid fa-credit-card text-primary"></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="fw-bold text-dark">Debit / Credit Card</div>
                                                <div className="small text-muted">Visa, Mastercard, RuPay accepted</div>
                                            </div>
                                            <div className="payment-option-check">
                                                <i className="fa-solid fa-circle-check text-success fs-5"></i>
                                            </div>
                                        </label>

                                        <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                                            <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} hidden />
                                            <div className="payment-option-icon" style={{ background: '#fce4ec' }}>
                                                <i className="fa-solid fa-hand-holding-dollar text-danger"></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="fw-bold text-dark">Cash on Delivery</div>
                                                <div className="small text-muted">Pay when your item arrives</div>
                                            </div>
                                            <div className="payment-option-check">
                                                <i className="fa-solid fa-circle-check text-success fs-5"></i>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="address-preview mt-4">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="fw-bold text-dark small text-uppercase">Delivering to</span>
                                            <button className="btn btn-link btn-sm text-success p-0 fw-semibold" onClick={() => setStep(1)}>
                                                <i className="fa-solid fa-pen-to-square me-1"></i> Change
                                            </button>
                                        </div>
                                        <div className="address-preview-box">
                                            <i className="fa-solid fa-location-dot text-success me-2"></i>
                                            <span className="text-dark fw-semibold">{address.fullName}</span>
                                            <span className="text-muted ms-2 small">{address.address}, {address.city}, {address.state} - {address.pincode}</span>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-3 justify-content-between mt-5">
                                        <button className="btn checkout-btn-secondary px-4 py-3 fw-bold" onClick={() => setStep(1)}>
                                            <i className="fa-solid fa-arrow-left me-2"></i> Back
                                        </button>
                                        <button className="btn checkout-btn-primary px-5 py-3 fw-bold" onClick={handlePlaceOrder} disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <><span className="spinner-border spinner-border-sm me-2" role="status"></span> Placing Order...</>
                                            ) : (
                                                <>Confirm Redemption <i className="fa-solid fa-check ms-2"></i></>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Panel: Order Summary */}
                    <div className="col-lg-4">
                        <div className="order-summary-sticky">
                            <div className="order-summary-card">
                                <div className="order-summary-header">
                                    <h5 className="fw-bold text-white mb-0">
                                        <i className="fa-solid fa-receipt me-2"></i>Order Summary
                                    </h5>
                                </div>
                                <div className="order-summary-body">
                                    {cart.map(item => (
                                        <div key={item.id} className="summary-item">
                                            <div className="summary-item-img">
                                                <img src={item.image} alt={item.name} />
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="fw-semibold text-dark small">{item.name}</div>
                                                <div className="text-muted" style={{ fontSize: '12px' }}>Qty: {item.quantity}</div>
                                            </div>
                                            <div className="fw-bold text-dark small">{item.points * item.quantity} <span className="text-success" style={{ fontSize: '11px' }}>PTS</span></div>
                                        </div>
                                    ))}

                                    <hr className="my-3" />

                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted small">Subtotal</span>
                                        <span className="fw-semibold">{totalPoints} PTS</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted small">Shipping</span>
                                        <span className="text-success fw-bold small">FREE</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted small">Processing Fee</span>
                                        <span className="text-success fw-bold small">WAIVED</span>
                                    </div>

                                    <hr className="my-3" />

                                    <div className="d-flex justify-content-between align-items-end">
                                        <span className="fw-bold text-dark">Total Points</span>
                                        <span className="fs-4 fw-black text-success">{totalPoints} <span className="fs-6 text-muted fw-bold">PTS</span></span>
                                    </div>

                                    <div className="secure-badge mt-3">
                                        <i className="fa-solid fa-shield-halved me-2 text-success"></i>
                                        <span>100% Secure & Encrypted</span>
                                    </div>
                                </div>
                            </div>

                            <div className="eco-note mt-3">
                                <i className="fa-solid fa-leaf me-2 text-success"></i>
                                <span>By redeeming points, you're supporting sustainable e-waste management.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
