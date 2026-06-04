import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/RewardStore.css';
import EmptyCart from './Cart_UI_Components/EmptyCart';
import CartItemRow from './Cart_UI_Components/CartItemRow';
import CartSummary from './Cart_UI_Components/CartSummary';
import DeleteConfirmationModal from './Cart_UI_Components/DeleteConfirmationModal';
import { getMyCart, updateCartItemAPI, removeCartItemAPI, getUserWallet } from '../../services/API_Service';

const Cart = () => {
    const [cartData, setCartData] = useState(null);
    const [userBalance, setUserBalance] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
        fetchWallet();
    }, []);

    const fetchCart = async (showLoader = true) => {
        if (showLoader) setLoading(true);
        try {
            const response = await getMyCart();
            setCartData(response.data);
            setIsLoggedIn(true);
        } catch (error) {
            console.error('Error fetching cart:', error);
            if (error.response && error.response.status === 401) {
                setIsLoggedIn(false);
            }
        } finally {
            if (showLoader) setLoading(false);
        }
    };

    const fetchWallet = async () => {
        try {
            const response = await getUserWallet();
            // Handle both paginated and non-paginated responses
            const walletData = response.data.results ? response.data.results[0] : (Array.isArray(response.data) ? response.data[0] : response.data);
            setUserBalance(walletData?.total_points || 0);
        } catch (error) {
            console.error('Error fetching wallet:', error);
        }
    };

    const updateQuantity = async (item, newQuantity) => {
        if (newQuantity < 1) return;
        if (newQuantity > 5) {
            alert("Maximum 5 items of a single reward can be redeemed at once.");
            return;
        }
        if (newQuantity > item.product_stock) {
            alert(`Sorry, only ${item.product_stock} items available in stock.`);
            return;
        }

        // Optimistic Update
        const oldQuantity = item.quantity;
        const updatedItems = cartData.cart_items.map(i =>
            i.id === item.id ? { ...i, quantity: newQuantity, subtotal_points: i.points * newQuantity } : i
        );
        const pointsDiff = (newQuantity - oldQuantity) * item.points;

        setCartData({
            ...cartData,
            cart_items: updatedItems,
            total_points: cartData.total_points + pointsDiff
        });

        try {
            await updateCartItemAPI(item.id, newQuantity);
            fetchCart(false); // Refresh cart in background
            fetchWallet(); // Refresh wallet balance
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error('Error updating quantity:', error);
            // Revert optimistic update on error
            fetchCart(false);
        }
    };

    const handleRemoveClick = (item) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const confirmRemove = async () => {
        if (!itemToDelete) return;

        // Optimistic Remove
        const updatedItems = cartData.cart_items.filter(i => i.id !== itemToDelete.id);
        const pointsRemoved = itemToDelete.subtotal_points || (itemToDelete.points * itemToDelete.quantity);
        
        setCartData({
            ...cartData,
            cart_items: updatedItems,
            total_points: cartData.total_points - pointsRemoved
        });

        try {
            await removeCartItemAPI(itemToDelete.id);
            fetchCart(false); // Refresh cart in background
            fetchWallet(); // Refresh wallet balance
            window.dispatchEvent(new Event('cartUpdated'));
            setShowDeleteModal(false);
            setItemToDelete(null);
        } catch (error) {
            console.error('Error removing item:', error);
            // Revert on error
            fetchCart(false);
            setShowDeleteModal(false);
            setItemToDelete(null);
        }
    };

    const placeOrder = () => {
        if (cartData.total_points > userBalance) {
            alert('Insufficient points in your account! Try recycling more e-waste.');
            return;
        }
        navigate('/checkout');
    };

    if (loading) return (
        <div className="text-center py-5 min-vh-100 d-flex flex-column justify-content-center align-items-center">
            <div className="spinner-border text-success" role="status"></div>
            <h5 className="mt-3 text-muted">Refreshing your cart...</h5>
        </div>
    );

    if (!cartData || cartData.cart_items.length === 0) {
        return <EmptyCart />;
    }

    return (
        <div className="cart-page py-5 bg-light min-vh-100">
            <div className="container">
                <h2 className="fw-bolder mb-4 d-flex align-items-center text-dark">
                    <div className="d-flex align-items-center justify-content-center bg-success text-white rounded-circle me-3 shadow-sm" style={{ width: '50px', height: '50px' }}>
                        <i className="fa-solid fa-gift fs-5"></i>
                    </div>
                    My Reward Collection
                </h2>

                <div className="row g-4">
                    <div className="col-lg-8">
                        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                            <div className="card-body p-0">
                                <div className="cart-items-scroll">
                                    {cartData.cart_items.map((item, index) => (
                                        <CartItemRow
                                            key={item.id}
                                            item={{
                                                id: item.id,
                                                name: item.product_name,
                                                image: item.product_image,
                                                points: item.points,
                                                quantity: item.quantity,
                                                stock: item.product_stock,
                                                category: item.category_name || 'Reward'
                                            }}
                                            index={index}
                                            isLast={index === cartData.cart_items.length - 1}
                                            onUpdateQuantity={(id, qty) => updateQuantity(item, qty)}
                                            onRemove={() => handleRemoveClick(item)}
                                            getItemTotal={() => item.subtotal_points}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <CartSummary
                            cartLength={cartData.cart_items.length}
                            totalPoints={cartData.total_points}
                            userBalance={userBalance}
                            isLoggedIn={isLoggedIn}
                            onCheckout={placeOrder}
                        />
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <DeleteConfirmationModal
                show={showDeleteModal}
                itemName={itemToDelete?.product_name || itemToDelete?.name}
                onConfirm={confirmRemove}
                onCancel={() => setShowDeleteModal(false)}
            />
        </div>
    );
};

export default Cart;

