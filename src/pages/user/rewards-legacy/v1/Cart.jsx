import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RewardStore.css';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [totalPoints, setTotalPoints] = useState(0);
    const [userBalance, setUserBalance] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('rewardCart') || '[]');
        setCart(storedCart);
        calculateTotal(storedCart);

        const points = localStorage.getItem('user_total_points');
        const token = localStorage.getItem('user_access_token');

        if (token) {
            setIsLoggedIn(true);
            setUserBalance(points ? parseInt(points) : 0);
        } else {
            setIsLoggedIn(false);
            setUserBalance(0);
        }
    }, []);

    const calculateTotal = (cartItems) => {
        const total = cartItems.reduce((acc, item) => {
            let itemTotal = item.points * (item.weight || 1) * item.quantity;

            // BONUS LOGIC
            if (item.weight && item.weight > 50) {
                const extraWeight = item.weight - 50;
                const bonus = Math.floor(extraWeight / 10) * 50 * item.quantity;
                itemTotal += bonus;
            }

            return acc + itemTotal;
        }, 0);

        setTotalPoints(total);
    };

    const getItemTotal = (item) => {
        let total = item.points * (item.weight || 1) * item.quantity;

        // BONUS LOGIC
        if (item.weight && item.weight > 50) {
            const extraWeight = item.weight - 50;
            const bonus = Math.floor(extraWeight / 10) * 50 * item.quantity;
            total += bonus;
        }

        return total;
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        const newCart = cart.map(item => item.id === id ? { ...item, quantity: newQuantity } : item);
        setCart(newCart);
        localStorage.setItem('rewardCart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cartUpdated'));
        calculateTotal(newCart);
    };

    const removeItem = (id) => {
        const newCart = cart.filter(item => item.id !== id);
        setCart(newCart);
        localStorage.setItem('rewardCart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cartUpdated'));
        calculateTotal(newCart);
    };

    const placeOrder = () => {
        if (totalPoints > userBalance) {
            alert('Insufficient points in your account! Try recycling more e-waste.');
            return;
        }
        alert('Reward redemption successful! Your items will arrive within 5-7 business days.');
        localStorage.removeItem('rewardCart');
        window.dispatchEvent(new Event('cartUpdated'));
        navigate('/reward-store');
    };

    if (cart.length === 0) {
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
    }

    return (
        <div className="cart-page py-5 bg-light min-vh-100">
            <div className="container">
                <h2 className="fw-bolder mb-4 d-flex align-items-center text-dark" style={{ letterSpacing: '-0.5px' }}>
                    <div className="d-flex align-items-center justify-content-center bg-success text-white rounded-circle me-3 shadow-sm" style={{ width: '50px', height: '50px' }}>
                        <i className="fa-solid fa-gift fs-5"></i>
                    </div>
                    My Reward Collection
                </h2>

                <div className="row g-4">
                    {/* Left: Reward Items */}
                    <div className="col-lg-8">
                        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                            <div className="card-body p-0">
                                {cart.map((item, index) => (
                                    <div key={item.id} className={`cart-item p-4 bg-white ${index !== cart.length - 1 ? 'border-bottom' : ''}`}>
                                        <div className="row align-items-center">
                                            <div className="col-md-2 text-center text-md-start mb-3 mb-md-0">
                                                <div className="p-2 bg-light rounded-3 d-inline-block">
                                                    <img src={item.image} alt={item.name} className="img-fluid cart-item-img" style={{ maxHeight: '70px' }} />
                                                </div>
                                            </div>
                                            <div className="col-md-5 mb-3 mb-md-0">
                                                <h5 className="fw-bolder mb-1 text-dark">{item.name}</h5>
                                                <p className="small text-muted fw-semibold mb-2"><i className="fa-solid fa-tag me-1 opacity-50"></i>{item.category}</p>
                                                <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-2 py-1 small">
                                                    Ready to Redeem
                                                </span>
                                            </div>
                                            <div className="col-md-3 mt-2 mt-md-0 d-flex justify-content-center justify-content-md-start">
                                                <div className="d-flex flex-column align-items-center align-items-md-start">
                                                    <div className="quantity-control d-flex border rounded-pill overflow-hidden bg-white shadow-sm" style={{ borderColor: '#e0e0e0' }}>
                                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="btn btn-sm btn-light border-0 py-1 px-3 text-secondary hover-bg-light fw-bold">-</button>
                                                        <input type="text" className="form-control text-center border-0 py-1 bg-white fw-bold" style={{ width: '45px', boxShadow: 'none' }} value={item.quantity} readOnly />
                                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="btn btn-sm btn-light border-0 py-1 px-3 text-secondary hover-bg-light fw-bold">+</button>
                                                    </div>
                                                    <button onClick={() => removeItem(item.id)} className="btn btn-link link-danger text-decoration-none p-0 small fw-semibold mt-2 px-2">
                                                        <i className="fa-regular fa-trash-can me-1"></i> Remove
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-md-2 mt-3 mt-md-0 text-center text-md-end">
                                                <div className="cart-item-points mb-1">
                                                    <span className="h4 fw-bolder text-dark m-0">{getItemTotal(item)}</span>
                                                    <span className="ms-1 fw-bold text-success" style={{ fontSize: '12px' }}>PTS</span>
                                                </div>
                                                <div className="small text-muted fw-semibold">
                                                    {item.weight ? `${item.points} pts x ${item.weight}kg / ea` : `${item.points} pts / ea`}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-success bg-opacity-10 rounded-4 border border-success border-opacity-25 d-flex gap-3 align-items-start shadow-sm">
                            <i className="fa-solid fa-leaf text-success fs-4 mt-1"></i>
                            <div>
                                <h6 className="fw-bold text-success mb-1">Great Job!</h6>
                                <p className="small text-muted mb-0">By redeeming these eco-friendly products and digital cards, you are contributing towards a greener planet and reducing your carbon footprint.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Custom Eco-Summary Box */}
                    <div className="col-lg-4">
                        <div className="eco-summary-card shadow-lg sticky-top" style={{ top: '100px', zIndex: 10 }}>
                            <div className="eco-summary-header text-center">
                                <i className="fa-solid fa-seedling fs-1 mb-2 text-white opacity-75"></i>
                                <h4 className="fw-bolder m-0 text-white" style={{ letterSpacing: '-0.5px' }}>Impact & Rewards</h4>
                                <p className="small text-white opacity-75 m-0 mt-1">Review your redemption details.</p>
                            </div>
                            <div className="eco-summary-body p-4 bg-white relative">
                                <div className="d-flex justify-content-between mb-3 align-items-center">
                                    <span className="text-secondary fw-semibold">Rewards Selected ({cart.length})</span>
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

                                {userBalance < totalPoints && (
                                    <div className="eco-alert error mb-4">
                                        <i className="fa-solid fa-triangle-exclamation fs-5"></i>
                                        <span>Short by <strong>{totalPoints - userBalance} Points.</strong></span>
                                    </div>
                                )}

                                <button
                                    className="btn btn-eco-redeem w-100 fw-bold py-3 mt-1"
                                    disabled={!isLoggedIn || userBalance < totalPoints}
                                    onClick={placeOrder}
                                >
                                    {!isLoggedIn ? 'Login to Proceed' : (userBalance < totalPoints ? 'Insufficient Balance' : 'Confirm Redemption')}
                                </button>

                                <div className="text-center mt-3">
                                    <span className="small text-muted opacity-75"><i className="fa-solid fa-shield-check me-1"></i>Secure Reward Transaction</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
