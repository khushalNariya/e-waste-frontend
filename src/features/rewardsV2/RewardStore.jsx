import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RewardStore.css';

const ITEMS = [
  {
    id: 1,
    name: 'Amazon Gift Card ₹500',
    category: 'Gift Cards',
    points: 5000,
    emoji: '🛒',
    desc: 'Digital gift card for Amazon India. Valid for all products including electronics, beauty, and grocery. Delivered instantly via email.',
    terms: 'Non-refundable. Valid for 12 months. Limited one per user.',
    stock: 15,
    tag: 'Popular',
  },
  {
    id: 2,
    name: 'Eco Bamboo Mouse',
    category: 'Eco-Friendly',
    points: 3500,
    emoji: '🖱️',
    desc: 'Sustainable wireless mouse crafted from 100% natural bamboo. High-precision optical sensor with ergonomic design for all-day comfort.',
    terms: '1-year warranty against manufacturing defects. Physical damage not covered.',
    stock: 8,
    tag: 'Best Seller',
  },
  {
    id: 3,
    name: 'Power Bank 10,000mAh',
    category: 'Electronics',
    points: 6000,
    emoji: '🔋',
    desc: 'High-speed 10,000mAh power bank with dual USB-A + USB-C ports. Supports 18W fast charging for two devices simultaneously.',
    terms: '6-month repair warranty. Accessories not included.',
    stock: 22,
    tag: 'New',
  },
  {
    id: 4,
    name: 'Starbucks Card ₹200',
    category: 'Gift Cards',
    points: 2000,
    emoji: '☕',
    desc: 'Enjoy your handcrafted beverage at any Starbucks outlet across India. Valid for all coffee, food, and merchandise items.',
    terms: 'Cannot be combined with other offers. No cash refund.',
    stock: 45,
    tag: 'Hot',
  },
  {
    id: 5,
    name: 'Laptop Sleeve (Recycled)',
    category: 'Eco-Friendly',
    points: 2500,
    emoji: '💼',
    desc: 'Sleek, durable laptop sleeve made from upcycled ocean plastic. Fits laptops up to 15.6 inches. Available in charcoal gray.',
    terms: 'Hand-wash only. Suitable for daily commute use.',
    stock: 5,
    tag: 'Eco Choice',
  },
  {
    id: 6,
    name: 'Noise Cancelling Headphones',
    category: 'Electronics',
    points: 12000,
    emoji: '🎧',
    desc: 'Premium wireless headphones with active noise cancellation. Up to 30hr battery life. Ideal for travel, focus, and high-fidelity audio.',
    terms: '1-year brand warranty. Physical damage not covered.',
    stock: 12,
    tag: 'Premium',
  },
  {
    id: 7,
    name: 'Solar Keychain Light',
    category: 'Eco-Friendly',
    points: 1200,
    emoji: '🔦',
    desc: 'Compact solar-charging keychain torch. Waterproof and lightweight. 4 hours of sunlight provides 2 hours of bright, steady light.',
    terms: 'Charge in direct sunlight only. Not suitable for diving.',
    stock: 30,
    tag: 'Eco Choice',
  },
  {
    id: 8,
    name: 'Travel Adapter (Universal)',
    category: 'Accessories',
    points: 1800,
    emoji: '🔌',
    desc: 'Universal adapter compatible with 150+ countries. Multiple pin configurations, dual USB ports, and a built-in safety fuse.',
    terms: 'Indoor use only. Max 600W load capacity.',
    stock: 18,
    tag: 'Utility',
  },
];

const CATEGORIES = ['All', 'Gift Cards', 'Electronics', 'Eco-Friendly', 'Accessories'];

const RewardStore_2 = () => {
  const [filter, setFilter] = useState('All');
  const [userPoints, setUserPoints] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const points = localStorage.getItem('user_total_points');
    const token = localStorage.getItem('user_access_token');
    if (token) {
      setIsLoggedIn(true);
      setUserPoints(points ? parseInt(points, 10) : 0);
    }
  }, []);

  const filteredItems =
    filter === 'All' ? ITEMS : ITEMS.filter((i) => i.category === filter);

  return (
    <div className="rs-page">
      {/* ── Hero ── */}
      <header className="rs-hero">
        <div className="rs-hero-inner">
          <div className="rs-hero-left">
            <p className="rs-eyebrow">Reward Store</p>
            <h1 className="rs-hero-title">
              Redeem Your <span className="rs-accent">Points</span>
            </h1>
            <p className="rs-hero-sub">
              Convert your recycling effort into real-world rewards.
              Every point counts.
            </p>
          </div>

          <div className="rs-points-badge">
            <span className="rs-pts-icon">🪙</span>
            <div>
              <p className="rs-pts-label">Your Balance</p>
              {isLoggedIn ? (
                <p className="rs-pts-val">
                  {userPoints.toLocaleString()}
                  <span className="rs-pts-unit">pts</span>
                </p>
              ) : (
                <Link to="/login" className="rs-login-link">
                  Login to view
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── Category Tabs ── */}
        <div className="rs-tabs-wrap">
          <div className="rs-tabs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`rs-tab${filter === cat ? ' active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Grid ── */}
      <main className="rs-body">
        {filteredItems.length === 0 ? (
          <div className="rs-empty">
            <span className="rs-empty-icon">📦</span>
            <p>No rewards in this category.</p>
          </div>
        ) : (
          <div className="rs-grid">
            {filteredItems.map((item) => {
              const canAfford = isLoggedIn && userPoints >= item.points;
              const stockLow = item.stock <= 10;
              return (
                <article className="rs-card" key={item.id}>
                  <Link to={`/reward-item-2/${item.id}`} className="rs-card-link">
                    <div className="rs-card-top">
                      <span className="rs-tag">{item.tag}</span>
                      <div className="rs-card-emoji">{item.emoji}</div>
                    </div>
                    <div className="rs-card-body">
                      <p className="rs-card-cat">{item.category}</p>
                      <h3 className="rs-card-name">{item.name}</h3>
                      <p className="rs-card-desc">
                        {item.desc.substring(0, 72)}…
                      </p>
                      <div className="rs-card-footer">
                        <div>
                          <p className="rs-card-pts">
                            {item.points.toLocaleString()}
                            <span> pts</span>
                          </p>
                          <p className={`rs-card-stock${stockLow ? ' low' : ''}`}>
                            {stockLow
                              ? `Only ${item.stock} left`
                              : `${item.stock} in stock`}
                          </p>
                        </div>
                        <span
                          className={`rs-card-btn${canAfford ? '' : ' muted'}`}
                        >
                          {canAfford ? 'Redeem' : 'View'}
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}

        {/* ── Banner ── */}
        <div className="rs-banner">
          <div className="rs-banner-text">
            <h2 className="rs-banner-title">Need more points?</h2>
            <p className="rs-banner-sub">
              Recycle your old gadgets and earn points instantly.
              Fast, free, and rewarding.
            </p>
          </div>
          <Link to="/E-Waste-Form" className="rs-banner-btn">
            Start Recycling →
          </Link>
        </div>
      </main>
    </div>
  );
};

export { ITEMS };
export default RewardStore_2;