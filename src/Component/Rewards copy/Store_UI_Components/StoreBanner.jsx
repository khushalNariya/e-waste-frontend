import React from 'react';
import { Link } from 'react-router-dom';

const StoreBanner = () => {
    return (
        <div className="earn-more-banner mt-5 p-5 shadow-lg rounded-4 overflow-hidden">
            <div className="row align-items-center position-relative">
                <div className="col-md-8">
                    <h2 className="banner-title">Need more points?</h2>
                    <p className="banner-text">Recycle your old gadgets and watch your points grow! It's fast, free, and rewarding.</p>
                    <Link to="/E-Waste-Form" className="btn btn-light btn-lg px-5 rounded-pill fw-bold text-success shadow mt-3">
                        Start Recycling <i className="fa-solid fa-arrow-right ms-2"></i>
                    </Link>
                </div>
                <div className="col-md-4 text-end d-none d-md-block">
                    <i className="fa-solid fa-recycle banner-bg-icon"></i>
                </div>
            </div>
        </div>
    );
};

export default StoreBanner;
