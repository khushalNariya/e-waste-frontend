import React, { useState } from 'react';
import './EWasteForm.css';

const EWasteForm = () => {
    const [formData, setFormData] = useState({
        category: '',
        brand: '',
        modelName: '',
        condition: 'good',
        pickupType: 'pickup',
        facility: '',
        address: '',
        pickupDate: '',
        pickupTime: '',
        phoneNumber: '',
        notes: ''
    });

    const categories = [
        { id: 'it-assets', label: 'IT Assets (Laptops, PCs, Servers)' },
        { id: 'mobile-devices', label: 'Mobile Devices (Phones, Tablets)' },
        { id: 'home-appliances', label: 'Home Appliances (Fridge, AC, Microwaves)' },
        { id: 'consumer-electronics', label: 'Consumer Electronics (TV, Audio)' },
        { id: 'batteries', label: 'Batteries & Power Storage' },
        { id: 'others', label: 'Other E-Waste Items' }
    ];

    const facilities = [
        { id: 'central-recycling', label: 'Central E-Waste Recycling Hub' },
        { id: 'north-collection', label: 'North Zone Collection Point' },
        { id: 'green-earth-eco', label: 'Green Earth Eco Solutions' },
        { id: 'tech-scrap-yard', label: 'Tech Scrap Yard' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Final Form Data:', formData);
        alert('Product submission successful! Our team will contact you soon.');
    };

    return (
        <div className="ewaste-form-page">
            <div className="ewaste-form-container">

                <header className="ew-form-header">
                    <div className="ew-header-icon">
                        <i className="fa-solid fa-recycle fa-spin-slow"></i>
                    </div>
                    <h2>Electronic Waste Submission</h2>
                    <p>Provide details of your e-waste for responsible recycling and earn reward points.</p>
                </header>

                <main className="ew-form-body">
                    <form onSubmit={handleSubmit}>

                        {/* SECTION 1: Product Specifications */}
                        <div className="ew-form-section">
                            <h3 className="ew-section-title">
                                <i className="fa-solid fa-laptop-code"></i>
                                1. Product Details
                            </h3>
                            <div className="ew-grid">
                                <div className="ew-input-group">
                                    <label className="ew-label">Category</label>
                                    <select name="category" className="ew-select" value={formData.category} onChange={handleChange} required>
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                    </select>
                                </div>
                                <div className="ew-input-group">
                                    <label className="ew-label">Brand</label>
                                    <input type="text" name="brand" className="ew-input" placeholder="e.g., Apple, Samsung, Dell" value={formData.brand} onChange={handleChange} required />
                                </div>
                                <div className="ew-input-group">
                                    <label className="ew-label">Model Name / Number</label>
                                    <input type="text" name="modelName" className="ew-input" placeholder="e.g., A2633, XPS 15 9510" value={formData.modelName} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="ew-input-group mt-4">
                                <label className="ew-label">Condition Field</label>
                                <div className="ew-condition-grid">
                                    {[
                                        { id: 'new', label: 'Like New', icon: 'fa-sparkles' },
                                        { id: 'working', label: 'Working', icon: 'fa-check' },
                                        { id: 'minor-damage', label: 'Minor Damage', icon: 'fa-wrench' },
                                        { id: 'not-working', label: 'Not Working', icon: 'fa-circle-xmark' },
                                        { id: 'scrap', label: 'Scrap', icon: 'fa-trash-can' }
                                    ].map(cond => (
                                        <label key={cond.id} className="ew-radio-card">
                                            <input type="radio" name="condition" value={cond.id} checked={formData.condition === cond.id} onChange={handleChange} />
                                            <div className="ew-radio-content">
                                                <i className={`fa-solid ${cond.icon}`}></i>
                                                <span className="ew-radio-label">{cond.label}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="ew-input-group mt-4">
                                <label className="ew-label">Image Upload</label>
                                <div className="ew-upload-area">
                                    <input type="file" id="imageUpload" className="d-none" multiple />
                                    <label htmlFor="imageUpload" style={{ cursor: 'pointer', width: '100%' }}>
                                        <i className="fa-solid fa-camera-retro ew-upload-icon"></i>
                                        <div className="ew-upload-text">
                                            <h4>Click to Upload Product Images</h4>
                                            <p>Clear photos help us evaluate the value better.</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: Pickup & Logistics */}
                        <div className="ew-form-section">
                            <h3 className="ew-section-title">
                                <i className="fa-solid fa-truck-fast"></i>
                                2. Pickup & Logistics
                            </h3>
                            <div className="ew-grid">
                                <div className="ew-input-group">
                                    <label className="ew-label">Pickup Type</label>
                                    <div className="ew-pickup-tabs">
                                        <label className={`ew-tab ${formData.pickupType === 'pickup' ? 'active' : ''}`}>
                                            <input type="radio" name="pickupType" value="pickup" checked={formData.pickupType === 'pickup'} onChange={handleChange} />
                                            <i className="fa-solid fa-house-chimney"></i> Doorstep Pickup
                                        </label>
                                        <label className={`ew-tab ${formData.pickupType === 'dropoff' ? 'active' : ''}`}>
                                            <input type="radio" name="pickupType" value="dropoff" checked={formData.pickupType === 'dropoff'} onChange={handleChange} />
                                            <i className="fa-solid fa-store"></i> Self Drop-off
                                        </label>
                                    </div>
                                </div>

                                <div className="ew-input-group">
                                    <label className="ew-label">Select Facility</label>
                                    <select name="facility" className="ew-select" value={formData.facility} onChange={handleChange} required>
                                        <option value="">Choose Nearest Center</option>
                                        {facilities.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                                    </select>
                                </div>

                                <div className="ew-input-group ew-full">
                                    <label className="ew-label">Pickup Address (Important)</label>
                                    <textarea name="address" className="ew-textarea" rows="3" placeholder="Enter your full detailed address..." value={formData.address} onChange={handleChange} required></textarea>
                                </div>

                                <div className="ew-input-group">
                                    <label className="ew-label">Pickup Date</label>
                                    <input type="date" name="pickupDate" className="ew-input" value={formData.pickupDate} onChange={handleChange} required />
                                </div>
                                <div className="ew-input-group">
                                    <label className="ew-label">Pickup Time</label>
                                    <input type="time" name="pickupTime" className="ew-input" value={formData.pickupTime} onChange={handleChange} required />
                                </div>
                                <div className="ew-input-group">
                                    <label className="ew-label">Phone Number</label>
                                    <input type="tel" name="phoneNumber" className="ew-input" placeholder="+91 00000 00000" value={formData.phoneNumber} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: Additional Notes */}
                        <div className="ew-form-section">
                            <h3 className="ew-section-title">
                                <i className="fa-solid fa-comment-dots"></i>
                                3. Additional Information
                            </h3>
                            <div className="ew-input-group ew-full">
                                <label className="ew-label">Notes / Description</label>
                                <textarea name="notes" className="ew-textarea" rows="4" placeholder="Mention any extra details (e.g., accessories included, specific pickup instructions...)" value={formData.notes} onChange={handleChange}></textarea>
                            </div>
                        </div>

                        <div className="ew-form-footer">
                            <button type="submit" className="ew-btn ew-btn-primary w-100">
                                <i className="fa-solid fa-circle-check me-2"></i>
                                Submit Recycling Request
                            </button>
                        </div>

                    </form>
                </main>

            </div>
        </div>
    );
};

export default EWasteForm;
