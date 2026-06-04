import React from 'react';

const PaymentMethod = ({ paymentMethod, setPaymentMethod, address, setStep, handlePlaceOrder, isSubmitting }) => {
    return (
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
    );
};

export default PaymentMethod;
