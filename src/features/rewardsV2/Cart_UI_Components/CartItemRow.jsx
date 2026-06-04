import React from 'react';

const CartItemRow = ({ item, index, isLast, onUpdateQuantity, onRemove, getItemTotal }) => {
    return (
        <div className={`cart-item p-4 bg-white ${!isLast ? 'border-bottom' : ''}`}>
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
                            <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="btn btn-sm btn-light border-0 py-1 px-3 text-secondary hover-bg-light fw-bold">-</button>
                            <input type="text" className="form-control text-center border-0 py-1 bg-white fw-bold" style={{ width: '45px', boxShadow: 'none' }} value={item.quantity} readOnly />
                            <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="btn btn-sm btn-light border-0 py-1 px-3 text-secondary hover-bg-light fw-bold">+</button>
                        </div>
                        <button onClick={() => onRemove(item.id)} className="btn btn-link link-danger text-decoration-none p-0 small fw-semibold mt-2 px-2">
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
    );
};

export default CartItemRow;
