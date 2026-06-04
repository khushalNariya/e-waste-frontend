import React from 'react';

const CartSummary = ({ cartLength, totalPoints, userBalance, isLoggedIn, onCheckout }) => {
    return (
        <div className="eco-summary-card shadow-lg sticky-top" style={{ top: '100px', zIndex: 10 }}>
            <div className="eco-summary-header text-center">
                <i className="fa-solid fa-seedling fs-1 mb-2 text-white opacity-75"></i>
                <h4 className="fw-bolder m-0 text-white" style={{ letterSpacing: '-0.5px' }}>Impact & Rewards</h4>
                <p className="small text-white opacity-75 m-0 mt-1">Review your redemption details.</p>
            </div>
            <div className="eco-summary-body p-4 bg-white relative">
                <div className="d-flex justify-content-between mb-3 align-items-center">
                    <span className="text-secondary fw-semibold">Rewards Selected ({cartLength})</span>
                    <span className="fs-6 fw-bold text-dark">{totalPoints} PTS</span>
                </div>
                <div className="d-flex justify-content-between mb-3 align-items-center">
                    <span className="text-secondary fw-semibold">Processing Fee</span>
                    <span className="badge bg-success text-white fw-bold rounded-pill px-2 py-1">WAIVED</span>
                </div>

                <hr className="border-dashed my-4" />

                <div className="d-flex justify-content-between mb-4 align-items-end">
                    <span className="fw-bolder text-dark fs-5">Points Required</span>
                    <span className="fs-3 fw-black text-success" style={{ fontWeight: '900' }}>{totalPoints} <span className="fs-6 text-muted fw-bold">PTS</span></span>
                </div>

                <div className="user-points-wallet mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2 px-1">
                        <span className="small text-muted fw-bold text-uppercase tracking-wider">Your Eco Wallet</span>
                        <i className="fa-solid fa-wallet text-muted"></i>
                    </div>
                    {isLoggedIn ? (
                        <div className="wallet-balance p-3 rounded-4 bg-light d-flex justify-content-between align-items-center border border-success border-opacity-25">
                            <span className="fs-4 fw-bolder text-dark m-0">{userBalance.toLocaleString()}</span>
                            <span className="text-success fw-bolder small px-2 py-1 bg-success bg-opacity-10 rounded-2">Balance</span>
                        </div>
                    ) : (
                        <div className="wallet-balance p-3 rounded-4 bg-light text-center border">
                            <span className="text-danger fw-bold small"><i className="fa-solid fa-lock me-2"></i>Not Logged In</span>
                        </div>
                    )}
                </div>

                {userBalance < totalPoints && isLoggedIn && (
                    <div className="eco-alert error mb-4">
                        <i className="fa-solid fa-triangle-exclamation fs-5"></i>
                        <span>Short by <strong>{totalPoints - userBalance} Points.</strong></span>
                    </div>
                )}

                <button
                    className="btn btn-eco-redeem w-100 fw-bold py-3 mt-1"
                    disabled={!isLoggedIn || userBalance < totalPoints}
                    onClick={onCheckout}
                >
                    {!isLoggedIn ? 'Login to Proceed' : (userBalance < totalPoints ? 'Insufficient Balance' : 'Proceed to Checkout ›')}
                </button>

                <div className="text-center mt-3">
                    <span className="small text-muted opacity-75"><i className="fa-solid fa-shield-check me-1"></i>Secure Reward Transaction</span>
                </div>
            </div>
        </div>
    );
};

export default CartSummary;
