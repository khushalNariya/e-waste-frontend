import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './Styles/RewardStore.css';
import ProductGallery from './Detail_UI_Components/ProductGallery';
import ProductInfo from './Detail_UI_Components/ProductInfo';
import ProductActionBox from './Detail_UI_Components/ProductActionBox';
import { getRewardProductDetails } from '../../../../services/user-api/API_Service';

const RewardProductDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState('');
    const [isImageFading, setIsImageFading] = useState(false);

    useEffect(() => {
        fetchProductDetail();
    }, [slug]);

    const fetchProductDetail = async () => {
        setLoading(true);
        try {
            const response = await getRewardProductDetails(slug);
            const data = response.data;
            setProduct(data);
            
            // Set initial active image (primary or first one)
            const primary = data.images?.find(img => img.is_primary)?.image || 
                           data.images?.[0]?.image || 
                           'https://img.icons8.com/clouds/256/box.png';
            setActiveImage(primary);
        } catch (error) {
            console.error('Error fetching product details:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem('rewardCart') || '[]');
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            // Simplify product object for cart to avoid circular refs or huge state
            const cartItem = {
                id: product.id,
                name: product.name,
                points: product.points,
                image: activeImage,
                category: product.category?.name,
                slug: product.slug,
                quantity: quantity
            };
            cart.push(cartItem);
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

    if (loading) return (
        <div className="text-center py-5 min-vh-100 d-flex flex-column justify-content-center align-items-center">
            <div className="spinner-grow text-success mb-3" role="status"></div>
            <h4 className="text-muted">Loading Reward Details...</h4>
        </div>
    );

    if (!product) return (
        <div className="text-center py-5 min-vh-100 d-flex flex-column justify-content-center align-items-center">
            <h3 className="text-danger">Reward Not Found</h3>
            <Link to="/reward-store" className="btn btn-success mt-3">Back to Store</Link>
        </div>
    );

    const galleryImages = product.images?.length > 0 
        ? product.images.map(img => img.image)
        : ['https://img.icons8.com/clouds/256/box.png'];

    return (
        <div className="eco-pdp-page py-5 bg-light min-vh-100">
            <div className="container">
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/reward-store" className="text-success text-decoration-none fw-semibold">Reward Store</Link></li>
                        <li className="breadcrumb-item text-muted">{product.category?.name || 'Rewards'}</li>
                        <li className="breadcrumb-item active fw-bold text-dark" aria-current="page">{product.name}</li>
                    </ol>
                </nav>

                <div className="row g-5">
                    {/* Left: Image Gallery */}
                    <div className="col-lg-5">
                        <ProductGallery 
                            product={product} 
                            activeImage={activeImage} 
                            isImageFading={isImageFading} 
                            galleryImages={galleryImages} 
                            onThumbnailClick={handleThumbnailClick} 
                        />
                    </div>

                    {/* Center: Details */}
                    <div className="col-lg-4 pb-5">
                        <ProductInfo product={product} />
                    </div>

                    {/* Right: Eco-Action Box */}
                    <div className="col-lg-3">
                        <ProductActionBox 
                            product={product} 
                            quantity={quantity} 
                            setQuantity={setQuantity} 
                            onAddToCart={addToCart} 
                            onFastRedeem={() => { addToCart(); navigate('/cart'); }} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RewardProductDetail;
