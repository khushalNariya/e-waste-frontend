import React from 'react';

const CartSummary = ({ cartLength, totalPoints, userBalance, isLoggedIn, onCheckout }) => {
    return (
        <div className="eco-summary-card shadow-lg sticky-top border-0 overflow-hidden" style={{ top: '100px', zIndex: 10, borderRadius: '30px' }}>
            <div className="eco-summary-header text-center p-5 position-relative">
                <div className="floating-icon-bg">
                    <i className="fa-solid fa-seedling"></i>
                </div>
                <h3 className="fw-black m-0 text-white" style={{ letterSpacing: '-1px', fontFamily: 'Outfit' }}>Redeem Hub</h3>
                <p className="small text-white opacity-75 m-0 mt-2 fw-medium">Review your redemption details.</p>
            </div>

            <div className="eco-summary-body p-4 bg-white relative">
                <div className="d-flex justify-content-between mb-3 align-items-center px-2">
                    <span className="text-secondary fw-bold small text-uppercase tracking-wider">Rewards Selected ({cartLength})</span>
                    <span className="fs-6 fw-black text-dark">{totalPoints.toLocaleString()} PTS</span>
                </div>

                <div className="d-flex justify-content-between mb-3 align-items-center px-2">
                    <span className="text-secondary fw-bold small text-uppercase tracking-wider">Service Fee</span>
                    <span className="badge bg-success text-white fw-black rounded-pill px-3 py-1" style={{ fontSize: '10px' }}>FREE</span>
                </div>

                <div className="impact-divider my-4"></div>

                <div className="user-points-wallet mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3 px-2">
                        <span className="small text-dark fw-black text-uppercase tracking-widest" style={{ fontSize: '11px' }}>Your Eco-Wallet</span>
                        <div className="p-2 bg-success bg-opacity-10 rounded-circle">
                            <i className="fa-solid fa-wallet text-success" style={{ fontSize: '14px' }}></i>
                        </div>
                    </div>

                    {isLoggedIn ? (
                        <>
                            <div className="wallet-balance p-4 rounded-4 bg-light d-flex justify-content-between align-items-center border-0 mb-4 shadow-inner">
                                <div>
                                    <span className="d-block small text-muted fw-bold text-uppercase mb-1" style={{ fontSize: '9px' }}>Current balance</span>
                                    <span className="fs-3 fw-black text-dark m-0" style={{ fontFamily: 'Outfit' }}>{(userBalance || 0).toLocaleString()}</span>
                                </div>
                                <span className="badge bg-white text-success shadow-sm rounded-3 py-2 px-3 fw-black">PTS</span>
                            </div>

                            <div className="impact-projection p-4 rounded-4 bg-dark text-white shadow-lg overflow-hidden position-relative">
                                <div className="glass-shine"></div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="small opacity-75 fw-medium">Required Points</span>
                                    <span className="small fw-black text-warning">-{totalPoints.toLocaleString()} PTS</span>
                                </div>
                                <div className="projection-line my-3"></div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="small fw-black text-uppercase tracking-tighter">Est. New Balance</span>
                                    <span className={`fs-4 fw-black ${userBalance >= totalPoints ? 'text-success' : 'text-danger'}`} style={{ fontFamily: 'Outfit' }}>
                                        {(userBalance - totalPoints).toLocaleString()} <span className="small opacity-50">PTS</span>
                                    </span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="wallet-balance p-4 rounded-4 bg-light text-center border-dashed">
                            <i className="fa-solid fa-lock text-muted mb-2 fs-4 d-block"></i>
                            <span className="text-muted fw-bold small">Please login to view balance</span>
                        </div>
                    )}
                </div>

                {userBalance < totalPoints && isLoggedIn && (
                    <div className="eco-alert-modern mb-4 animate-shake">
                        <div className="alert-icon">
                            <i className="fa-solid fa-triangle-exclamation"></i>
                        </div>
                        <div className="alert-content">
                            <span className="d-block fw-black" style={{ fontSize: '13px' }}>Point Deficit</span>
                            <span className="small opacity-75">You're short of {(totalPoints - userBalance).toLocaleString()} points.</span>
                        </div>
                    </div>
                )}

                <button
                    className="btn btn-eco-premium w-100 fw-black py-3 mt-2 shadow-lg"
                    disabled={!isLoggedIn || userBalance < totalPoints}
                    onClick={onCheckout}
                >
                    {!isLoggedIn ? (
                        <>SIGN IN TO REDEEM <i className="fa-solid fa-arrow-right ms-2"></i></>
                    ) : (
                        userBalance < totalPoints ? (
                            <>NEED {(totalPoints - userBalance).toLocaleString()} MORE PTS</>
                        ) : (
                            <>REDEEM NOW <i className="fa-solid fa-sparkles ms-2"></i></>
                        )
                    )}
                </button>

                <p className="text-center mt-4 small text-muted fw-medium opacity-50">
                    <i className="fa-solid fa-shield-halved me-1"></i> Eco-Secure Transaction
                </p>
            </div>
        </div>
    );
};

export default CartSummary;
