import React from 'react';

const SavedAddresses = ({ savedAddresses, onSelect, onAddNew, onEdit, canAddNew }) => {
    return (
        <div className="checkout-card animate-slide-in">
            <div className="checkout-card-header">
                <div className="header-icon"><i className="fa-solid fa-address-book"></i></div>
                <div className="flex-grow-1">
                    <h4 className="mb-0 fw-bold">Select Delivery Address</h4>
                    <p className="mb-0 small opacity-75">Choose from your previous addresses (Max 3)</p>
                </div>
            </div>
            <div className="checkout-card-body">
                <div className="row g-3">
                    {savedAddresses.map((addr, index) => (
                        <div key={index} className="col-12">
                            <div className="payment-option p-4">
                                <div className="d-flex justify-content-between align-items-start w-100">
                                    <div onClick={() => onSelect(addr)} style={{cursor: 'pointer', flex: 1}}>
                                        <div className="fw-bold text-dark mb-1" style={{fontSize: '16px'}}>{addr.full_name}</div>
                                        <div className="text-muted small mb-2"><i className="fa-solid fa-phone me-2"></i>{addr.phone}</div>
                                        <div className="text-dark small" style={{lineHeight: '1.5'}}>
                                            {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                                            {addr.landmark && <div className="mt-1 opacity-75">Landmark: {addr.landmark}</div>}
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column gap-2 ms-3">
                                        <button className="btn btn-outline-success btn-sm px-3 rounded-pill" onClick={() => onSelect(addr)}>
                                            Use This
                                        </button>
                                        <button className="btn btn-outline-primary btn-sm px-3 rounded-pill" onClick={() => onEdit(addr)}>
                                            <i className="fa-solid fa-pen-to-square me-1"></i> Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {canAddNew && (
                        <div className="col-12 mt-4">
                            <button 
                                className="btn checkout-btn-secondary w-100 py-3 fw-bold"
                                onClick={onAddNew}
                                style={{borderStyle: 'dashed', borderWidth: '2px'}}
                            >
                                <i className="fa-solid fa-plus me-2"></i> Deliver to a New Address
                            </button>
                        </div>
                    )}
                    
                    {!canAddNew && (
                        <div className="col-12 mt-3 text-center">
                            <p className="small text-danger fw-bold">
                                <i className="fa-solid fa-circle-info me-1"></i> 
                                Address limit reached (Max 3). Edit an existing address to use a different one.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SavedAddresses;
