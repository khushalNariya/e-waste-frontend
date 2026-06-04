import React, { useState } from 'react';
import './Contact_Us.css';
import Select from "react-select";



const Contact_Us = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Data Received! Our environmental experts will analyze your request.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    };

    const cities = [
        { name: 'Mumbai', type: 'Global HQ', icon: 'bi-buildings', desc: 'Central command center for pan-India logistics and operations.' },
        { name: 'Aurangabad', type: 'Tech Hub', icon: 'bi-cpu', desc: 'Advanced sorting facility and regional administrative office.' },
        { name: 'Pune', type: 'Research', icon: 'bi-flask', desc: 'Innovation center focused on chemical e-waste extraction.' },
        { name: 'Delhi', type: 'Logistics Center', icon: 'bi-truck', desc: 'Primary collection fleet management for Northern India.' }
    ];

    const options = [
        { value: "Residential", label: "Residential Pickup" },
        { value: "Corporate", label: "Corporate Bulk Disposal" },
        { value: "Partnership", label: "Partnership Inquiry" }
    ];

    return (
        <div className="contact-layout-root">
            {/* Hero Header */}
            <header className="contact-hero-banner">
                <div className="container">
                    <span className="badge bg-success mb-3 px-3 py-2">CONNECT WITH IMPACT</span>
                    <h1>Get In Touch</h1>
                    <p className="lead opacity-75 mx-auto" style={{ maxWidth: '700px' }}>
                        Join 25,000+ conscious citizens in building a sustainable future.
                        Our experts are ready to assist you.
                    </p>
                </div>
            </header>

            {/* Main Interactive Section */}
            <div className="container contact-container-overlap">
                <div className="premium-contact-split">
                    <div className="row g-0">
                        {/* Info Side (Dark Green) */}
                        <div className="col-lg-5 order-2 order-lg-1">
                            <div className="info-sidebar-green h-100">
                                <h3>Direct Channels</h3>
                                <p className="opacity-75 mb-5">Skip the queue by reaching us through our dedicated helplines.</p>

                                <div className="detail-box">
                                    <div className="detail-icon"><i className="bi bi-telephone"></i></div>
                                    <div>
                                        <div className="small opacity-50 fw-bold">TOLL FREE</div>
                                        <div className="fs-5 fw-bold">1800-ELOCATE-ECO</div>
                                    </div>
                                </div>

                                <div className="detail-box">
                                    <div className="detail-icon"><i className="bi bi-envelope"></i></div>
                                    <div>
                                        <div className="small opacity-50 fw-bold">EMAIL SUPPORT</div>
                                        <div className="fs-5 fw-bold">connect@elocate.earth</div>
                                    </div>
                                </div>

                                <div className="detail-box">
                                    <div className="detail-icon"><i className="bi bi-clock"></i></div>
                                    <div>
                                        <div className="small opacity-50 fw-bold">RESPONSE TIME</div>
                                        <div className="fs-5 fw-bold">Within 2 Hours</div>
                                    </div>
                                </div>

                                <div className="social-bar-bottom">
                                    <p className="small fw-bold opacity-50 mb-3">FOLLOW OUR JOURNEY</p>
                                    <div className="d-flex">
                                        <a href="#" className="social-ink"><i className="bi bi-linkedin"></i></a>
                                        <a href="#" className="social-ink"><i className="bi bi-instagram"></i></a>
                                        <a href="#" className="social-ink"><i className="bi bi-twitter-x"></i></a>
                                        <a href="#" className="social-ink"><i className="bi bi-facebook"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Side (Refined & Modern) */}
                        <div className="col-lg-7 order-1 order-lg-2">
                            <div className="form-content-area h-100">
                                <h2>Send Us a Message</h2>
                                <p className="text-muted mb-5">Fill in your details and our team will get back to you shortly.</p>

                                <form onSubmit={handleSubmit}>
                                    <div className="row g-4">
                                        <div className="col-md-6 mb-3">
                                            <label className="premium-field-label">Full Name</label>
                                            <div className="input-icon-wrapper">
                                                <input type="text" name="name" className=" premium-input-style" placeholder="Rahul Sharma" value={formData.name} onChange={handleChange} required />
                                                <i className="bi bi-person"></i>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="premium-field-label">Work Email</label>
                                            <div className="input-icon-wrapper">
                                                <input type="email" name="email" className="f premium-input-style" placeholder="rahul@company.com" value={formData.email} onChange={handleChange} required />
                                                <i className="bi bi-envelope"></i>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="premium-field-label">Inquiry Category</label>
                                        {/* <div className="input-icon-wrapper">
                                            <select name="subject" className="form-select premium-input-style" value={formData.subject} onChange={handleChange}>
                                                <option value="">Choose one category</option>
                                                <option value="Residential">Residential Pickup</option>
                                                <option value="Corporate">Corporate Bulk Disposal</option>
                                                <option value="Partnership">Partnership Inquiry</option>
                                            </select>
                                            <i className="bi bi-list-task"></i>
                                        </div> */}

                                        <div className="input-icon-wrapper">
                                            <Select
                                                name="subject"
                                                options={options}
                                                placeholder="Choose one category"
                                                className="custom-react-select"
                                                classNamePrefix="custom"
                                                onChange={(selected) =>
                                                    setFormData({ ...formData, subject: selected?.value || "" })
                                                }
                                            />
                                            <i className="bi bi-list-task"></i>
                                        </div>
                                    </div>


                                    <div className="mb-4">
                                        <label className="premium-field-label">Your Message or Requirement</label>
                                        <textarea name="message" className="premium-input-style" rows="4" placeholder="Briefly describe your e-waste quantity or any specific query..." value={formData.message} onChange={handleChange} required></textarea>
                                    </div>

                                    <button type="submit" className="btn btn-submit-green w-100 mb-3">
                                        Deploy Message <i className="bi bi-lightning-charge-fill ms-2"></i>
                                    </button>

                                    <div className="form-footer-note">
                                        <i className="bi bi-shield-check text-success"></i>
                                        <span>Your data is encrypted and handled according to ISO guidelines.</span>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Regional Presence */}
            <section className="location-hub-section">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold" style={{ color: '#1a4d2e' }}>Our Global Hubs</h2>
                        <div className="mx-auto bg-success mt-2" style={{ height: '4px', width: '60px', borderRadius: '2px' }}></div>
                    </div>

                    <div className="row g-4">
                        {cities.map((city, idx) => (
                            <div className="col-lg-3 col-md-6" key={idx}>
                                <div className="hub-card text-center">
                                    <i className={city.icon}></i>
                                    <span className="small text-uppercase fw-bold opacity-50 mb-1 d-block">{city.type}</span>
                                    <h4 className="hub-title">{city.name}</h4>
                                    <p className="text-muted small mb-0">{city.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact_Us;
