import React from 'react';

const AddressForm = ({ address, handleAddressChange, onValidate, errors, onBack, showBackButton, isSubmitting }) => {
    return (
        <div className="checkout-card animate-slide-in">
            <div className="checkout-card-header">
                <div className="header-icon"><i className="fa-solid fa-location-dot"></i></div>
                <div className="flex-grow-1">
                    <h4 className="mb-0 fw-bold">Delivery Address</h4>
                    <p className="mb-0 small opacity-75">Where should we send your reward?</p>
                </div>
                {showBackButton && (
                    <button className="btn btn-link text-success text-decoration-none fw-bold" onClick={onBack}>
                        <i className="fa-solid fa-chevron-left me-1"></i> Use Saved Address
                    </button>
                )}
            </div>
            <div className="checkout-card-body">
                <div className="row g-4">
                    <div className="col-md-6">
                        <label className="form-label checkout-label">Full Name *</label>
                        <input type="text" name="fullName" className={`form-control checkout-input ${errors.full_name ? 'is-invalid' : ''}`} value={address.fullName} onChange={handleAddressChange} placeholder="Enter your full name" />
                        {errors.full_name && <div className="invalid-feedback d-block mt-1" style={{fontSize: '11px'}}>{errors.full_name[0]}</div>}
                    </div>
                    <div className="col-md-6">
                        <label className="form-label checkout-label">Phone Number *</label>
                        <input type="tel" name="phone" className={`form-control checkout-input ${errors.phone ? 'is-invalid' : ''}`} value={address.phone} onChange={handleAddressChange} placeholder="10-digit mobile number" />
                        {errors.phone && <div className="invalid-feedback d-block mt-1" style={{fontSize: '11px'}}>{errors.phone[0]}</div>}
                    </div>
                    <div className="col-12">
                        <label className="form-label checkout-label">Street Address *</label>
                        <textarea name="address" rows="2" className={`form-control checkout-input ${errors.address ? 'is-invalid' : ''}`} value={address.address} onChange={handleAddressChange} placeholder="House No, Building, Street, Area" />
                        {errors.address && <div className="invalid-feedback d-block mt-1" style={{fontSize: '11px'}}>{errors.address[0]}</div>}
                    </div>
                    <div className="col-md-4">
                        <label className="form-label checkout-label">Pincode *</label>
                        <input type="text" name="pincode" className={`form-control checkout-input ${errors.pincode ? 'is-invalid' : ''}`} value={address.pincode} onChange={handleAddressChange} placeholder="6-digit pincode" />
                        {errors.pincode && <div className="invalid-feedback d-block mt-1" style={{fontSize: '11px'}}>{errors.pincode[0]}</div>}
                    </div>
                    <div className="col-md-4">
                        <label className="form-label checkout-label">City *</label>
                        <input type="text" name="city" className={`form-control checkout-input ${errors.city ? 'is-invalid' : ''}`} value={address.city} onChange={handleAddressChange} placeholder="City" />
                        {errors.city && <div className="invalid-feedback d-block mt-1" style={{fontSize: '11px'}}>{errors.city[0]}</div>}
                    </div>
                    <div className="col-md-4">
                        <label className="form-label checkout-label">State *</label>
                        <select name="state" className={`form-select checkout-input ${errors.state ? 'is-invalid' : ''}`} value={address.state} onChange={handleAddressChange}>
                            <option value="">Select State</option>
                            {['Gujarat', 'Maharashtra', 'Rajasthan', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal', 'Madhya Pradesh', 'Telangana'].map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        {errors.state && <div className="invalid-feedback d-block mt-1" style={{fontSize: '11px'}}>{errors.state[0]}</div>}
                    </div>
                    <div className="col-12">
                        <label className="form-label checkout-label">Landmark (Optional)</label>
                        <input type="text" name="landmark" className="form-control checkout-input" value={address.landmark} onChange={handleAddressChange} placeholder="Near school, hospital, etc." />
                    </div>
                </div>
                <div className="d-flex justify-content-end mt-4">
                    <button 
                        className="btn checkout-btn-primary px-5 py-3 fw-bold" 
                        onClick={onValidate}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <><i className="fa-solid fa-spinner fa-spin me-2"></i> Validating...</>
                        ) : (
                            <>{'Continue to Payment'} <i className="fa-solid fa-arrow-right ms-2"></i></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddressForm;
