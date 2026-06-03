import React from 'react';

const ProgressSteps = ({ step }) => {
    return (
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
    );
};

export default ProgressSteps;
