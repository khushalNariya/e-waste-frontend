import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './RewardStore.css';

const RewardProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState('');
    const [isImageFading, setIsImageFading] = useState(false);

    const items = [
        { id: 1, name: 'Amazon Gift Card ₹500', category: 'Gift Cards', points: 5000, image: 'https://img.icons8.com/color/256/amazon.png', desc: 'Digital gift card for Amazon India store. Valid for all products including electronics, beauty, and grocery. This is a virtual card delivered via email.', terms: 'Non-refundable. Valid for 12 months. Limited one per user.', stock: 15 },
        { id: 2, name: 'Eco Bamboo Mouse', category: 'Eco-Friendly', points: 3500, image: 'https://img.icons8.com/emoji/256/mouse-emoji.png', desc: 'A sustainable wireless mouse made from 100% natural bamboo. High precision optical sensor with ergonomic design for comfortable use.', terms: '1-year warranty against manufacturing defects.', stock: 8 },
        { id: 3, name: 'Power Bank 10,000mAh', category: 'Electronics', points: 6000, image: 'https://img.icons8.com/plasticine/256/external-battery.png', desc: 'High-speed 10,000mAh power bank with dual USB ports and power delivery support. Charge two devices simultaneously.', terms: '6-month repair warranty. Accessories not included.', stock: 22 },
        { id: 4, name: 'Starbucks Card ₹200', category: 'Gift Cards', points: 2000, image: 'https://img.icons8.com/color/256/starbucks.png', desc: 'Enjoy your handcrafted beverage at any Starbucks outlet across India. Valid for all coffee, food, and merchandise.', terms: 'Cannot be combined with other offers. No cash refund.', stock: 45 },
        { id: 5, name: 'Laptop Sleeve (Recycled)', category: 'Eco-Friendly', points: 2500, image: 'https://img.icons8.com/external-flat-line-rich-line/256/external-bag-earth-day-flat-line-rich-line.png', desc: 'A sleek, durable laptop sleeve made entirely from upcycled ocean plastic. Fits laptops up to 15.6 inches.', terms: 'Hand-wash only. Durable for daily use.', stock: 5 },
        { id: 6, name: 'Noise Cancelling Headphones', category: 'Electronics', points: 12000, image: 'https://img.icons8.com/plasticine/256/headphones.png', desc: 'Premium wireless headphones with active noise cancellation (ANC). Perfect for travel, focus, and high-fidelity audio experience.', terms: '1-year brand warranty. Physical damage not covered.', stock: 12 },
        { id: 7, name: 'Solar Keychain Light', category: 'Eco-Friendly', points: 1200, image: 'https://img.icons8.com/external-flat-line-rich-line/256/external-solar-energy-earth-day-flat-line-rich-line.png', desc: 'Never run out of light with this solar-charging keychain torch. Compact, lightweight, and waterproof.', terms: 'Charge for 4 hours for 2 hours of light.', stock: 30 },
        { id: 8, name: 'Travel Adapter (Universal)', category: 'Accessories', points: 1800, image: 'https://img.icons8.com/plasticine/256/adapter.png', desc: 'Universal travel adapter compatible with 150+ countries. Features multiple pin configurations and built-in safety fuse.', terms: 'Indoor use only. Max 600W load capacity.', stock: 18 }
    ];

    useEffect(() => {
        const found = items.find(item => item.id === parseInt(id));
        if (found) {
            setProduct(found);
            setActiveImage(found.image);
        }
    }, [id]);

    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem('rewardCart') || '[]');
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ ...product, quantity });
        }

        localStorage.setItem('rewardCart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
        navigate('/cart');
    };

    const handleThumbnailClick = (imgSrc) => {
        if (imgSrc === activeImage) return;
        setIsImageFading(true);
        setTimeout(() => {
            setActiveImage(imgSrc);
            setIsImageFading(false);
        }, 200);
    };

    if (!product) return <div className="text-center py-5">Loading Reward Data...</div>;

    // Generate mock gallery images for demonstration
    const galleryImages = [
        product.image,
        'https://img.icons8.com/clouds/256/box.png',
        'https://img.icons8.com/clouds/256/delivery.png'
    ];

    return (
        <div className="eco-pdp-page py-5 bg-light min-vh-100">
            <div className="container">
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/reward-store" className="text-success text-decoration-none fw-semibold">Reward Store</Link></li>
                        <li className="breadcrumb-item text-muted">{product.category}</li>
                        <li className="breadcrumb-item active fw-bold text-dark" aria-current="page">{product.name}</li>
                    </ol>
                </nav>

                <div className="row g-5">
                    {/* Left: Image Gallery */}
                    <div className="col-lg-5">
                        <div className="gallery-container sticky-top" style={{ top: '100px', zIndex: 10 }}>
                            {/* Main Active Image */}
                            <div className="main-image-box bg-white border-0 shadow-sm rounded-4 d-flex align-items-center justify-content-center p-5 mb-3 position-relative overflow-hidden">
                                <div className="position-absolute top-0 start-0 m-3">
                                    <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill">
                                        <i className="fa-solid fa-leaf me-1"></i> Eco-Reward
                                    </span>
                                </div>
                                <img
                                    src={activeImage}
                                    alt={product.name}
                                    className={`img-fluid main-product-img ${isImageFading ? 'opacity-0 scale-down' : 'opacity-100 scale-up'}`}
                                    style={{ transition: 'all 0.3s ease', maxHeight: '350px' }}
                                />
                            </div>

                            {/* Thumbnails */}
                            <div className="d-flex gap-3 justify-content-center">
                                {galleryImages.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className={`thumbnail-box bg-white rounded-3 p-2 cursor-pointer shadow-sm transition-all ${activeImage === img ? 'border border-2 border-success border-opacity-50' : 'border border-transparent opacity-75 hover-opacity-100'}`}
                                        onClick={() => handleThumbnailClick(img)}
                                    >
                                        <img src={img} alt={`view-${idx}`} className="img-fluid" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Center: Details */}
                    <div className="col-lg-4 pb-5">
                        <h1 className="fw-bolder mb-3 text-dark lh-sm" style={{ letterSpacing: '-0.5px' }}>{product.name}</h1>
                        <div className="d-flex align-items-center mb-4 gap-3">
                            <div className="badge bg-light text-dark border px-2 py-1">
                                <i className="fa-solid fa-star text-warning me-1"></i> 4.8
                            </div>
                            <span className="text-primary small fw-semibold cursor-pointer text-decoration-underline">128 Recyclers redeemed this</span>
                        </div>

                        <div className="p-4 bg-success bg-opacity-10 rounded-4 border border-success border-opacity-25 mb-4 shadow-sm">
                            <span className="text-success fw-bold small text-uppercase tracking-wider">Redemption Cost</span>
                            <div className="d-flex align-items-baseline mt-1">
                                <span className="display-4 fw-black text-dark m-0 tracking-tight">{product.points.toLocaleString()}</span>
                                <span className="ms-2 fw-bolder text-success">PTS</span>
                            </div>
                            <hr className="border-success opacity-25 my-3" />
                            <p className="small text-muted m-0"><i className="fa-solid fa-circle-info me-1"></i> Earn points by scheduling an E-waste pickup.</p>
                        </div>

                        <h5 className="fw-bold mb-3 text-dark">Reward Overview</h5>
                        <p className="text-secondary lh-lg mb-4" style={{ fontSize: '15px' }}>
                            {product.desc}
                        </p>

                        <div className="row g-3 mb-4">
                            <div className="col-6">
                                <div className="p-3 bg-white rounded-3 shadow-sm border border-light text-center h-100">
                                    <i className="fa-solid fa-truck-fast text-success fs-3 mb-2"></i>
                                    <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '13px' }}>Fast Delivery</h6>
                                    <span className="small text-muted" style={{ fontSize: '11px' }}>Within 5-7 Days</span>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-3 bg-white rounded-3 shadow-sm border border-light text-center h-100">
                                    <i className="fa-solid fa-seedling text-success fs-3 mb-2"></i>
                                    <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '13px' }}>Eco-Verified</h6>
                                    <span className="small text-muted" style={{ fontSize: '11px' }}>100% Genuine</span>
                                </div>
                            </div>
                        </div>

                        <div className="accordion" id="termsAccordion">
                            <div className="accordion-item border-0 bg-white rounded-3 shadow-sm overflow-hidden">
                                <h2 className="accordion-header">
                                    <button className="accordion-button collapsed fw-bold text-dark bg-white shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTerms">
                                        <i className="fa-solid fa-file-contract me-2 text-primary"></i> Terms & Conditions
                                    </button>
                                </h2>
                                <div id="collapseTerms" className="accordion-collapse collapse" data-bs-parent="#termsAccordion">
                                    <div className="accordion-body text-muted small bg-light">
                                        {product.terms}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Eco-Action Box */}
                    <div className="col-lg-3">
                        <div className="eco-summary-card shadow-lg sticky-top" style={{ top: '100px', zIndex: 10 }}>
                            <div className="eco-summary-header text-center pb-5">
                                <i className="fa-solid fa-box-open fs-1 mb-2 text-white opacity-75"></i>
                                <h4 className="fw-bolder m-0 text-white">Action Box</h4>
                            </div>
                            <div className="eco-summary-body p-4 bg-white relative">
                                <div className="d-flex justify-content-between mb-3 align-items-center">
                                    <span className="text-secondary fw-semibold">Availability</span>
                                    {product.stock > 0 ? (
                                        <span className="badge bg-success text-white px-3 py-2 rounded-pill">In Stock ({product.stock})</span>
                                    ) : (
                                        <span className="badge bg-danger text-white px-3 py-2 rounded-pill">Out of Stock</span>
                                    )}
                                </div>
                                <div className="d-flex justify-content-between mb-4 align-items-center">
                                    <span className="text-secondary fw-semibold">Dispatched via</span>
                                    <span className="text-dark fw-bold small"><i className="fa-solid fa-leaf text-success me-1"></i>GreenHub</span>
                                </div>

                                <div className="quantity-selector mb-4">
                                    <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">Select Quantity</label>
                                    <select
                                        className="form-select border-2 shadow-none fw-bold"
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                                        disabled={product.stock === 0}
                                        style={{ height: '50px', borderRadius: '12px' }}
                                    >
                                        {[...Array(Math.min(product.stock, 5))].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    className="btn btn-eco-redeem w-100 fw-bold py-3 mb-3 d-flex align-items-center justify-content-center gap-2"
                                    onClick={addToCart}
                                    disabled={product.stock === 0}
                                >
                                    <i className="fa-solid fa-plus"></i> Add to Collection
                                </button>

                                <button
                                    className="btn w-100 fw-bold py-3 text-success d-flex align-items-center justify-content-center gap-2 border border-success border-2 rounded-4 hover-bg-light"
                                    onClick={() => { addToCart(); navigate('/cart'); }}
                                    disabled={product.stock === 0}
                                    style={{ transition: 'all 0.3s' }}
                                >
                                    <i className="fa-solid fa-bolt"></i> Fast Redeem
                                </button>

                                <div className="text-center mt-4">
                                    <span className="small text-muted opacity-75"><i className="fa-solid fa-shield-check me-1"></i>Platform Guaranteed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RewardProductDetail;
