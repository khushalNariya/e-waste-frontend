import React from 'react';

const CartItemRow = ({ item, index, isLast, onUpdateQuantity, onRemove }) => {
    return (
        <div className={`cart-item p-3 mb-3 bg-white rounded-4 shadow-sm border-start border-4 ${item.stock > 0 ? 'border-success' : 'border-danger'} transition-all hover-shadow-lg`}>
            <div className="row align-items-center">
                <div className="col-md-2 text-center text-md-start mb-3 mb-md-0">
                    <div className="p-2 bg-light rounded-4 d-inline-block shadow-sm float-animation">
                        <img src={item.image} alt={item.name} className="img-fluid cart-item-img" style={{ maxHeight: '85px', borderRadius: '12px' }} />
                    </div>
                </div>
                <div className="col-md-5 mb-3 mb-md-0">
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="item-category text-uppercase tracking-tighter fw-bold" style={{ fontSize: '10px', color: 'var(--eco-green)' }}>
                            {item.category}
                        </span>
                        {item.stock <= 5 && item.stock > 0 && (
                            <span className="badge bg-warning text-dark border-0 rounded-pill px-2 py-1 fw-bold" style={{ fontSize: '9px' }}>
                                <i className="fa-solid fa-fire-flame-curved me-1"></i>LOW STOCK
                            </span>
                        )}
                    </div>
                    <h5 className="fw-bolder mb-2 text-dark" style={{ letterSpacing: '-0.3px' }}>{item.name}</h5>
                    <div className="d-flex flex-row align-items-center gap-2 flex-nowrap overflow-hidden">
                        <span className="badge bg-success bg-opacity-10 text-success border-0 rounded-pill px-2 py-1 small fw-bold text-nowrap">
                            <i className="fa-solid fa-circle-check me-1"></i>Available
                        </span>
                        <span className={`badge ${item.stock > 0 ? 'bg-primary' : 'bg-danger'} bg-opacity-10 ${item.stock > 0 ? 'text-primary' : 'text-danger'} border-0 rounded-pill px-2 py-1 small fw-bold text-nowrap`}>
                            {item.stock > 0 ? `${item.stock} in Stock` : 'Out of Stock'}
                        </span>
                    </div>
                </div>
                <div className="col-md-3 mt-2 mt-md-0">
                    <div className="d-flex flex-column align-items-center align-items-md-center">
                        <div className="quantity-control d-flex border-0 rounded-4 overflow-hidden bg-light p-1 shadow-inner mb-2" style={{ width: 'fit-content' }}>
                            <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                className="btn btn-sm btn-white border-0 shadow-sm rounded-3 py-1 px-3 text-dark fw-bold"
                                disabled={item.quantity <= 1}
                            >
                                <i className="fa-solid fa-minus fs-xs"></i>
                            </button>
                            <span className="d-flex align-items-center justify-content-center fw-black px-3" style={{ minWidth: '40px', fontSize: '1.1rem' }}>
                                {item.quantity}
                            </span>
                            <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="btn btn-sm btn-white border-0 shadow-sm rounded-3 py-1 px-3 text-dark fw-bold"
                                disabled={item.quantity >= 5 || item.quantity >= item.stock}
                            >
                                <i className="fa-solid fa-plus fs-xs"></i>
                            </button>
                        </div>
                        <button
                            onClick={() => onRemove(item.id)}
                            className="btn btn-link link-danger text-decoration-none p-0 small fw-bold mt-1 px-2 opacity-75 hover-opacity-100 transition-all"
                            style={{ fontSize: '12px' }}
                        >
                            <i className="fa-regular fa-trash-can me-1"></i> Remove Reward
                        </button>
                    </div>
                </div>
                <div className="col-md-2 mt-3 mt-md-0 text-center text-md-end">
                    <div className="cart-item-points mb-1">
                        <span className="h3 fw-black text-dark m-0" style={{ fontFamily: 'Outfit' }}>{(item.points * item.quantity).toLocaleString()}</span>
                        <span className="ms-1 fw-bold text-success" style={{ fontSize: '13px' }}>PTS</span>
                    </div>
                    <div className="small text-muted fw-bold text-uppercase opacity-50 text-nowrap" style={{ fontSize: '10px', letterSpacing: '1px' }}>
                        {item.points.toLocaleString()} PTS / UNIT
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItemRow;
