import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css"; // Added styling file explicitly

const Footer = () => {
    const [hoverWhatsApp, setHoverWhatsApp] = useState(false);
    const [hoverInstagram, setHoverInstagram] = useState(false);
    const [hoverFacebook, setHoverFacebook] = useState(false);
    const [hoverLinkedin, setHoverLinkedin] = useState(false);

    return (
        <div className="elocate-footer">
            <div className="container">
                {/* Increased gap (gy-5) for columns and row spacing */}
                <div className="row gy-5">

                    {/* Brand Section */}
                    {/* Added padding end (pe-md-5) so text isn't crowded */}
                    <div className="col-12 col-md-4 text-center text-md-start pe-md-5">
                        <Link to="/" className="d-inline-block mb-3">
                            <img
                                src='/image/images.jpg'
                                alt="Logo"
                                width="95"
                                height="95"
                                className="logo shadow-sm"
                            />
                        </Link>
                        <p className="mt-2 text-justify">
                            ELocate connects you with certified e-waste recycling facilities,
                            enabling responsible disposal and a greener future. Drop smart, recycle right!
                        </p>
                    </div>

                    {/* Recycling Solutions */}
                    <div className="col-6 col-md-2">
                        {/* Title class handles uppercase and bold formatting */}
                        <h6 className="footer-title">Recycling</h6>
                        <ul className="footer-links list-unstyled">
                            <li><Link to="#">Smartphone</Link></li>
                            <li><Link to="#">Laptops</Link></li>
                            <li><Link to="#">Accessories</Link></li>
                            <li><Link to="#">Displays</Link></li>
                            <li><Link to="#">Home Appliances</Link></li>
                        </ul>
                    </div>

                    {/* Platform Links */}
                    <div className="col-6 col-md-2">
                        <h6 className="footer-title">Platform</h6>
                        <ul className="footer-links list-unstyled">
                            <li><Link to="#">Mission & Vision</Link></li>
                            <li><Link to="#">E-Waste Education</Link></li>
                            <li><Link to="#">Facilities</Link></li>
                            <li><Link to="#">Insights</Link></li>
                            <li><Link to="#">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact - improved spacing */}
                    <div className="col-12 col-md-4 ps-md-4">
                        <h6 className="footer-title">Connect With Us</h6>

                        <div className="mb-3 d-flex align-items-start gap-3">
                            <img
                                src="/image/location.png"
                                alt="Location"
                                width="22"
                                height="22"
                                className="mt-1"
                                style={{ borderRadius: '4px' }}
                            />
                            <p className="mb-0">
                                Chh. Sambhajinagar, Maharashtra, India 431001
                            </p>
                        </div>

                        <div className="mb-3 d-flex align-items-center gap-3">
                            <img
                                src="/image/phone.png"
                                alt="Phone"
                                width="22"
                                height="22"
                                style={{ borderRadius: '4px' }}
                            />
                            <p className="mb-0">+91 123 456 7890</p>
                        </div>

                        <div className="mb-4 d-flex align-items-center gap-3">
                            <img
                                src="/image/gmail.png"
                                alt="Email"
                                width="22"
                                height="22"
                                className="mt-1"
                                style={{ borderRadius: '4px' }}
                            />
                            <a href="mailto:contact@ewasterecycle.com" className="mb-0 d-block">
                                contact@ewasterecycle.com
                            </a>
                        </div>

                        {/* Social Icons - spacing improved in CSS */}
                        <div className="social-icons">
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                onMouseEnter={() => setHoverWhatsApp(true)}
                                onMouseLeave={() => setHoverWhatsApp(false)}
                            >
                                <img
                                    src={hoverWhatsApp ? "/image/whatsapp.gif" : "/image/whatsapp.png"}
                                    alt="WhatsApp"
                                    width="24"
                                    height="24"
                                />
                            </a>
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                onMouseEnter={() => setHoverInstagram(true)}
                                onMouseLeave={() => setHoverInstagram(false)}
                            >
                                <img
                                    src={hoverInstagram ? "/image/instagram.gif" : "/image/instagram.png"}
                                    alt="Instagram"
                                    width="24"
                                    height="24"
                                />
                            </a>
                            {/* Twitter / X */}
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                <img
                                    src="/image/twitter.png"
                                    alt="Twitter"
                                    width="24"
                                    height="24"
                                />
                            </a>
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                onMouseEnter={() => setHoverFacebook(true)}
                                onMouseLeave={() => setHoverFacebook(false)}
                            >
                                <img
                                    src={hoverFacebook ? "/image/facebook.gif" : "/image/facebook.png"}
                                    alt="Facebook"
                                    width="24"
                                    height="24"
                                />
                            </a>
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                onMouseEnter={() => setHoverLinkedin(true)}
                                onMouseLeave={() => setHoverLinkedin(false)}
                            >
                                <img
                                    src={hoverLinkedin ? "/image/linkedin.gif" : "/image/linkedin.png"}
                                    alt="LinkedIn"
                                    width="24"
                                    height="24"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar - Less compact, more padding */}
            <div className="bottom-bar">
                <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <p className="mb-3 mb-md-0 small">
                        © 2026 E-Waste Drop & Recycling | All Rights Reserved.
                    </p>
                    <ul className="list-unstyled d-flex gap-5 mb-0">
                        <li>
                            <Link to="#" className="text-decoration-none">
                                Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className="text-decoration-none">
                                Terms of Service
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Footer;
