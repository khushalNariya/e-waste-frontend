import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RewardStore.css';

const RewardStore = () => {
    const [filter, setFilter] = useState('All');
    const [userPoints, setUserPoints] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Retrieve points and login status from localStorage
        const points = localStorage.getItem('user_total_points');
        const token = localStorage.getItem('user_access_token');

        if (token) {
            setIsLoggedIn(true);
            setUserPoints(points ? parseInt(points) : 0);
        } else {
            setIsLoggedIn(false);
            setUserPoints(0);
        }
    }, []);

    const categories = ['All', 'Gift Cards', 'Electronics', 'Eco-Friendly', 'Accessories'];

    const items = [
        {
            id: 1,
            name: 'Amazon Gift Card ₹500',
            category: 'Gift Cards',
            points: 5000,
            image: 'https://img.icons8.com/color/144/amazon.png',
            desc: 'Digital gift card for Amazon India store. Valid for all products including electronics, beauty, and grocery. This is a virtual card delivered via email.',
            terms: 'Non-refundable. Valid for 12 months. Limited one per user.',
            stock: 15,
            tag: 'Popular'
        },
        {
            id: 2,
            name: 'Eco Bamboo Mouse',
            category: 'Eco-Friendly',
            points: 3500,
            image: 'https://img.icons8.com/emoji/144/mouse-emoji.png',
            desc: 'A sustainable wireless mouse made from 100% natural bamboo. High precision optical sensor with ergonomic design for comfortable use.',
            terms: '1-year warranty against manufacturing defects.',
            stock: 8,
            tag: 'Best Seller'
        },
        {
            id: 3,
            name: 'Power Bank 10,000mAh',
            category: 'Electronics',
            points: 6000,
            image: 'https://img.icons8.com/plasticine/144/external-battery.png',
            desc: 'High-speed 10,000mAh power bank with dual USB ports and power delivery support. Charge two devices simultaneously.',
            terms: '6-month repair warranty. Accessories not included.',
            stock: 22,
            tag: 'New'
        },
        {
            id: 4,
            name: 'Starbucks Card ₹200',
            category: 'Gift Cards',
            points: 2000,
            image: 'https://img.icons8.com/color/144/starbucks.png',
            desc: 'Enjoy your handcrafted beverage at any Starbucks outlet across India. Valid for all coffee, food, and merchandise.',
            terms: 'Cannot be combined with other offers. No cash refund.',
            stock: 45,
            tag: 'Hot'
        },
        {
            id: 5,
            name: 'Laptop Sleeve (Recycled)',
            category: 'Eco-Friendly',
            points: 2500,
            image: 'https://img.icons8.com/external-flat-line-rich-line/144/external-bag-earth-day-flat-line-rich-line.png',
            desc: 'A sleek, durable laptop sleeve made entirely from upcycled ocean plastic. Fits laptops up to 15.6 inches.',
            terms: 'Hand-wash only. Durable for daily use.',
            stock: 5,
            tag: 'Eco Choice'
        },
        {
            id: 6,
            name: 'Noise Cancelling Headphones',
            category: 'Electronics',
            points: 12000,
            image: 'https://img.icons8.com/plasticine/144/headphones.png',
            desc: 'Premium wireless headphones with active noise cancellation (ANC). Perfect for travel, focus, and high-fidelity audio experience.',
            terms: '1-year brand warranty. Physical damage not covered.',
            stock: 12,
            tag: 'Premium'
        },
        {
            id: 7,
            name: 'Solar Keychain Light',
            category: 'Eco-Friendly',
            points: 1200,
            image: 'https://img.icons8.com/external-flat-line-rich-line/144/external-solar-energy-earth-day-flat-line-rich-line.png',
            desc: 'Never run out of light with this solar-charging keychain torch. Compact, lightweight, and waterproof.',
            terms: 'Charge for 4 hours for 2 hours of light.',
            stock: 30,
            tag: 'Eco Choice'
        },
        {
            id: 8,
            name: 'Travel Adapter (Universal)',
            category: 'Accessories',
            points: 1800,
            image: 'https://img.icons8.com/plasticine/144/adapter.png',
            desc: 'Universal travel adapter compatible with 150+ countries. Features multiple pin configurations and built-in safety fuse.',
            terms: 'Indoor use only. Max 600W load capacity.',
            stock: 18,
            tag: 'Utility'
        }
    ];

    const filteredItems = filter === 'All' ? items : items.filter(i => i.category === filter);

    return (
        <div className="reward-store-page">
            {/* Store Header */}
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

            <div className="container py-5">
                {/* Category Filter */}
                <div className="store-filters mb-5 pb-3 scroll-hidden">
                    <div className="d-flex gap-3 justify-content-center">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                                onClick={() => setFilter(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Items Grid */}
                <div className="row g-4 justify-content-center">
                    {filteredItems.map(item => (
                        <div className="col-xl-3 col-lg-4 col-md-6" key={item.id}>
                            <div className="reward-item-card h-100 shadow-sm">
                                <div className="card-top">
                                    <span className="item-tag">{item.tag}</span>
                                    <div className="item-img-container">
                                        <img src={item.image} alt={item.name} className="item-image" />
                                    </div>
                                    <Link to={`/reward-item/${item.id}`} className="view-detail-overlay">
                                        View Details
                                    </Link>
                                </div>
                                <div className="card-body p-4">
                                    <span className="item-category d-flex justify-content-between">
                                        {item.category}
                                        <span className={item.stock > 10 ? 'text-success' : 'text-danger'}>
                                            {item.stock} in stock
                                        </span>
                                    </span>
                                    <h4 className="item-name">{item.name}</h4>
                                    <p className="item-desc">{item.desc.substring(0, 60)}...</p>
                                    <div className="item-footer d-flex align-items-center justify-content-between mt-4">
                                        <div className="item-points">
                                            <span className="value">{item.points}</span>
                                            <span className="unit">PTS</span>
                                        </div>
                                        <Link to={`/reward-item/${item.id}`} className="redeem-btn">
                                            Buy <i className="fa-solid fa-cart-shopping ms-2"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredItems.length === 0 && (
                        <div className="col-12 text-center py-5">
                            <i className="fa-solid fa-box-open fa-3x text-muted mb-3"></i>
                            <h3 className="text-muted">No rewards found in this category.</h3>
                        </div>
                    )}
                </div>

                {/* Bonus Banner */}
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
            </div>
        </div>
    );
};

export default RewardStore;
