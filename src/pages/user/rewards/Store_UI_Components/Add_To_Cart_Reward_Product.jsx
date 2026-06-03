import React, { useEffect } from 'react';
import '../Styles/Add_To_Cart.css';

const Add_To_Cart_Reward_Product = ({ show, message, onClose, type = 'success' }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className={`notification-container animate-slide-in ${type}`}>
            <div className="notification-content">
                <div className="notification-icon">
                    {type === 'success' ? (
                        <i className="fa-solid fa-circle-check"></i>
                    ) : (
                        <i className="fa-solid fa-triangle-exclamation"></i>
                    )}
                </div>
                <div className="notification-text">
                    <div className="title">
                        {type === 'success' ? 'Reward Added!' : 'Notice'}
                    </div>
                    <div className="desc">{message}</div>
                </div>
                <button onClick={onClose} className="notification-close-btn">
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div className="notification-progress"></div>
        </div>
    );
};

export default Add_To_Cart_Reward_Product;
