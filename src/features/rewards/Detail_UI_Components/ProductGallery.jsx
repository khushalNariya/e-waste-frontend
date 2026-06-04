import React from 'react';

const ProductGallery = ({ product, activeImage, isImageFading, galleryImages, onThumbnailClick }) => {
    return (
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
                        onClick={() => onThumbnailClick(img)}
                    >
                        <img src={img} alt={`view-${idx}`} className="img-fluid" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductGallery;
