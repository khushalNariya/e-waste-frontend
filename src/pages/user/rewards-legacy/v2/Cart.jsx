import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/RewardStore.css';
import EmptyCart from './Cart_UI_Components/EmptyCart';
import CartItemRow from './Cart_UI_Components/CartItemRow';
import CartSummary from './Cart_UI_Components/CartSummary';

const Cart_2 = () => {
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
            setUserBalance(points ? parseInt(points) : 500000);
        } else {
            setIsLoggedIn(false);
            setUserBalance(0);
        }
    }, []);

    const calculateTotal = (cartItems) => {
        const total = cartItems.reduce((acc, item) => {
            return acc + getItemTotal(item);
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
        navigate('/checkout');
    };

    if (cart.length === 0) {
        return <EmptyCart />;
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
                                    <CartItemRow 
                                        key={item.id} 
                                        item={item} 
                                        index={index} 
                                        isLast={index === cart.length - 1} 
                                        onUpdateQuantity={updateQuantity} 
                                        onRemove={removeItem} 
                                        getItemTotal={getItemTotal} 
                                    />
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
                        <CartSummary 
                            cartLength={cart.length} 
                            totalPoints={totalPoints} 
                            userBalance={userBalance} 
                            isLoggedIn={isLoggedIn} 
                            onCheckout={placeOrder} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart_2;
