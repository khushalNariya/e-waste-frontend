import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addToCartAPI } from '../../User-Interface-API/API_Service';

const StoreProductCard = ({ item, onShowToast }) => {
    const [adding, setAdding] = useState(false);
    const navigate = useNavigate();

    const primaryImage = item.images?.find(img => img.is_primary)?.image || 
                         item.images?.[0]?.image || 
                         'https://img.icons8.com/clouds/256/box.png';

    const handleAddToCart = async (e) => {
        e.preventDefault();
        setAdding(true);
        try {
            await addToCartAPI(item.id, 1);
            // Trigger a cart update event for the header/cart count
            window.dispatchEvent(new Event('cartUpdated'));
            
            // Show modern toast message
            onShowToast(`${item.name} has been added to your collection!`);
            
            setTimeout(() => setAdding(false), 1000);
        } catch (error) {
            console.error('Error adding to cart:', error);
            setAdding(false);
            if (error.response && error.response.status === 401) {
                onShowToast('Please login to claim rewards.', 'error');
                navigate('/login');
            } else {
                onShowToast('Failed to add reward. Please try again.', 'error');
            }
        }
    };

    return (
        <div className="col-xl-3 col-lg-4 col-md-6">
            <div className="reward-item-card h-100 shadow-sm">
                <div className="card-top">
                    {item.tag && <span className="item-tag">{item.tag}</span>}
                    <div className="item-img-container">
                        <img src={primaryImage} alt={item.name} className="item-image" />
                    </div>
                    <Link to={`/reward-item/${item.slug}`} className="view-detail-overlay">
                        View Details
                    </Link>
                </div>
                <div className="card-body p-4">
                    <div className="item-category d-flex justify-content-between align-items-center mb-2">
                        <span className="text-truncate" style={{ maxWidth: '60%' }}>
                            {item.category?.name || 'Reward'}
                        </span>
                        <span className={`${item.stock > 10 ? 'text-success' : 'text-danger'} ms-2 flex-shrink-0`}>
                            {item.stock} in stock
                        </span>
                    </div>
                    <h4 className="item-name">{item.name}</h4>
                    <p className="item-desc">{item.description ? item.description.substring(0, 60) : ''}...</p>
                    <div className="item-footer d-flex align-items-center justify-content-between">
                        <div className="item-points">
                            <span className="value">{item.points}</span>
                            <span className="unit">PTS</span>
                        </div>
                        <button 
                            onClick={handleAddToCart} 
                            className={`redeem-btn border-0 ${adding ? 'opacity-75' : ''}`}
                            disabled={adding || item.stock <= 0}
                        >
                            {adding ? (
                                <i className="fa-solid fa-circle-notch fa-spin"></i>
                            ) : (
                                <><i className="fa-solid fa-cart-plus me-2"></i>Add</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreProductCard;
