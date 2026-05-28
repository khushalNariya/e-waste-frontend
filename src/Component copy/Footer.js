import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    const [hoverWhatsApp, setHoverWhatsApp] = useState(false);
    const [hoverInstagram, setHoverInstagram] = useState(false);
    const [hoverFacebook, setHoverFacebook] = useState(false);
    const [hoverLinkedin, setHoverLinkedin] = useState(false);

    return (
        <div>

            <footer className="bg-white text-dark pt-0 mt-0 shadow-lg">
                <div className="border-top border-secondary mt-0  pt-2 pb-0">
                    <div className="container">

                        <div className="row gy-4">

                            {/* Brand Section */}
                            <div className="col-12 col-md-3 text-center text-md-start">
                                <Link to="/" className="d-inline-block mb-3">
                                    <img
                                        src='/image/images.jpg'
                                        alt=""
                                        width="90"
                                        height="90"
                                        className="logo"
                                    />
                                </Link>
                                <p className="small text-muted">
                                    ELocate connects you with certified e-waste recycling facilities,
                                    enabling responsible disposal and a greener future.
                                </p>
                            </div>

                            {/* Recycling Solutions */}
                            <div className="col-6 col-md-3">
                                <h6 className="footer-title text-uppercase fw-bold mb-3">Recycling Solutions</h6>
                                <ul className="footer-links list-unstyled">
                                    <li><Link to="#" >Smartphone Recycling</Link></li>
                                    <li><Link to="" >Laptop & Computer Recycling</Link></li>
                                    <li><Link to="" >Electronic Accessories</Link></li>
                                    <li><Link to="" >TV & Display Recycling</Link></li>
                                    <li><Link to="" >Home Appliance Recycling</Link></li>
                                </ul>
                            </div>

                            {/* Platform Links */}
                            <div className="col-6 col-md-3">
                                <h6 className="footer-title text-uppercase fw-bold mb-3">ELocate Platform</h6>
                                <ul className="footer-links list-unstyled">
                                    <li><Link to="">Mission & Vision</Link></li>
                                    <li><Link to="">E-Waste Education</Link></li>
                                    <li><Link to="">Certified Facilities</Link></li>
                                    <li><Link to="">Blogs & Insights</Link></li>
                                    <li><Link to="">Contact Us</Link></li>
                                </ul>
                            </div>

                            {/* Contact */}
                            <div className="col-12 col-md-3">
                                <h6 className="footer-title text-uppercase fw-bold mb-3">Connect With Us</h6>

                                <p className="footer-links mb-1 d-flex align-items-center gap-2">
                                    <img
                                        src="/image/location.png"
                                        alt="Email"
                                        width="18"
                                        height="18"
                                    // className="me-2"
                                    />
                                    <a className="">
                                        Chh. Sambhajinagar, Maharashtra,India 431001
                                    </a>
                                </p>

                                <p className="footer-links mb-1 d-flex align-items-center gap-2">
                                    {/* <IonIcon icon='' className="me-2" /> */}
                                    <img
                                        src="/image/phone.png"
                                        alt="Email"
                                        width="18"
                                        height="18"
                                    // className="me-2"
                                    />
                                    <a className="">
                                        +91 123 456 7890
                                    </a>

                                </p>

                                <p className="footer-links mb-3 d-flex align-items-center gap-2">
                                    {/* <IonIcon icon='' className="me-2" /> */}
                                    <img
                                        src="/image/gmail.png"
                                        alt="Email"
                                        width="18"
                                        height="18"
                                    // className="me-2"
                                    />
                                    <a href="" className="">
                                        contact@ewasterecycle.com
                                    </a>
                                </p>

                                <div className="footer-divider" >
                                    <div className="d-flex gap-2">
                                        {/* WhatsApp */}
                                        <a
                                            href=""
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="WhatsApp"
                                            onMouseEnter={() => setHoverWhatsApp(true)}
                                            onMouseLeave={() => setHoverWhatsApp(false)}
                                        >
                                            <img
                                                src={hoverWhatsApp ? "/image/whatsapp.gif" : "/image/whatsapp.png"}
                                                alt="WhatsApp"
                                                width="32"
                                                height="32"
                                                className="whatsapp-static"
                                            />
                                        </a>

                                        {/* Instagram */}
                                        <a
                                            href=""
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="Instagram"
                                            onMouseEnter={() => setHoverInstagram(true)}
                                            onMouseLeave={() => setHoverInstagram(false)}
                                        >
                                            <img
                                                src={hoverInstagram ? "/image/instagram.gif" : "/image/instagram.png"}
                                                alt="instagram"
                                                width="32"
                                                height="32"
                                                className="instagram-static"
                                            />
                                        </a>
                                        {/* twitter */}
                                        <a
                                            href=""
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="twitter"
                                        >
                                            <img
                                                src="/image/twitter.png"
                                                alt="twitter"
                                                width="32"
                                                height="32"
                                                className="twitter"
                                            />
                                        </a>
                                        {/* Facebook */}
                                        <a
                                            href=""
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="Facebook"
                                            onMouseEnter={() => setHoverFacebook(true)}
                                            onMouseLeave={() => setHoverFacebook(false)}
                                        >
                                            <img
                                                src={hoverFacebook ? "/image/facebook.gif" : "/image/facebook.png"}
                                                alt="Facebook"
                                                width="32"
                                                height="32"
                                                className="Facebook"
                                            />
                                        </a>
                                        {/* Linkedin */}
                                        <a
                                            href=""
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="Linkedin"
                                            onMouseEnter={() => setHoverLinkedin(true)}
                                            onMouseLeave={() => setHoverLinkedin(false)}
                                        >
                                            <img
                                                src={hoverLinkedin ? "/image/linkedin.gif" : "/image/linkedin.png"}
                                                alt="Linkedin"
                                                width="32"
                                                height="32"
                                                className="Linkedin"
                                            />
                                        </a>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-top border-secondary mt-4 pt-1 pb-2">
                        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
                            <p className="mb-0 mb-md-0 small">
                                © 2026 E-waste | All Rights Reserved by <strong>Team Spam</strong>
                            </p>

                            <ul className="footer-links list-unstyled d-flex gap-3 mb-0">
                                <li>
                                    <Link href="" className="footer-bottom-link">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="" className="footer-bottom-link">
                                        Terms of Service
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    )
}

export default Footer
