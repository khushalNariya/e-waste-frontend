import React from 'react';
import { Link } from 'react-router-dom';

const StoreHeader = ({ isLoggedIn, userPoints }) => {
    return (
        <header className="store-header">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-7">
                        <span className="store-badge"><i className="fa-solid fa-store me-2"></i>Reward Store</span>
                        <h1 className="store-title">Redeem Your <span className="highlight">Points</span></h1>
                        <p className="store-subtitle">Choose from a variety of amazing rewards. Your points are the currency of sustainability.</p>
                    </div>
                    <div className="col-lg-5 text-center text-lg-end mt-4 mt-lg-0">
                        <div className="user-points-card shadow-lg inline-block">
                            <div className="points-info">
                                <span className="label">You Have</span>
                                <div className="points-value text-success h2 fw-bold m-0 mt-1">
                                    {isLoggedIn ? (
                                        <><span>{userPoints.toLocaleString()}</span> <span className="small opacity-50 tiny-pts">PTS</span></>
                                    ) : (
                                        <Link to="/login" className="btn btn-sm btn-outline-success border-2 fw-bold px-3">Login to see points</Link>
                                    )}
                                </div>
                            </div>
                            <div className="points-icon"><i className="fa-solid fa-coins"></i></div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default StoreHeader;
