import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

const SignUp = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [generalErrors, setGeneralErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setGeneralErrors([]);
        setIsLoading(true);

        const form = new FormData(e.target);
        const data = {
            first_name: form.get("first_name")?.trim(),
            last_name: form.get("last_name")?.trim(),
            email: form.get("email")?.trim(),
            password: form.get("password"),
            confirmPassword: form.get("passwordConfirm"),
            mobile_number: form.get("mobile_number"),
            address_line_1: form.get("address_line_1"),
            address_line_2: form.get("address_line_2"),
            city: form.get("city"),
            state: form.get("state"),
            pincode: form.get("pincode"),
        };

        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL || "http://127.0.0.1:1000/"}api/1___API__app__1__User_Register/`,
                data,
                { headers: { "Content-Type": "application/json" } }
            );

            if (res.status === 201 || res.status === 200) {
                window.location.href = "/login";
            }
        } catch (err) {
            if (err.response && err.response.data) {
                console.log(err.response.data);
                setErrors(err.response.data);
            } else {
                setGeneralErrors(["Something went wrong. Try again"]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="split-layout">
            
            {/* Form side (now on left for variety, or keep right. Let's keep consistent) */}
            <div className="split-form-area" style={{justifyContent: "flex-start", overflowY: "auto", paddingTop: "50px"}}>
                <div className="split-form-wrapper wide" style={{marginBottom: "50px"}}>
                    
                    <div className="form-title-group mb-4">
                        <h2>Create an account</h2>
                        <p>Join ecoRecycle and track your environmental impact.</p>
                    </div>

                    {/* ✅ PRESERVED: Backend Error LOGIC */}
                    {generalErrors.length > 0 && (
                        <div className="sp-alert">
                            <i className="fa-solid fa-circle-exclamation"></i>
                            <div>{generalErrors.map((er, i) => <div key={i}>{er}</div>)}</div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        
                        <div className="sp-grid-2">
                            <div className="sp-input-block">
                                <label className="sp-label">First Name</label>
                                <div className="sp-input-container">
                                    <input type="text" name="first_name" className="sp-input" placeholder="e.g., Jane" />
                                </div>
                                {errors.first_name && errors.first_name.map((msg, i) => <span key={i} className="sp-err-text">{msg}</span>)}
                            </div>
                            <div className="sp-input-block">
                                <label className="sp-label">Last Name</label>
                                <div className="sp-input-container">
                                    <input type="text" name="last_name" className="sp-input" placeholder="e.g., Doe" />
                                </div>
                                {errors.last_name && errors.last_name.map((msg, i) => <span key={i} className="sp-err-text">{msg}</span>)}
                            </div>
                        </div>

                        <div className="sp-grid-2">
                            <div className="sp-input-block">
                                <label className="sp-label">Mobile Number</label>
                                <div className="sp-input-container">
                                    <input type="text" name="mobile_number" className="sp-input" placeholder="+1 (555) 000-0000" />
                                </div>
                                {errors.mobile_number && errors.mobile_number.map((msg, i) => <span key={i} className="sp-err-text">{msg}</span>)}
                            </div>
                            <div className="sp-input-block">
                                <label className="sp-label">Email Address</label>
                                <div className="sp-input-container">
                                    <input type="email" name="email" className="sp-input" placeholder="jane@example.com" />
                                </div>
                                {errors.email && errors.email.map((msg, i) => <span key={i} className="sp-err-text">{msg}</span>)}
                            </div>
                        </div>

                        <div className="sp-grid-2">
                            <div className="sp-input-block">
                                <label className="sp-label">Password</label>
                                <div className="sp-input-container">
                                    <input type={showPassword ? "text" : "password"} name="password" class="sp-input" placeholder="Create a password" />
                                    <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} sp-pass-toggle`} onClick={() => setShowPassword(!showPassword)}></i>
                                </div>
                                {errors.password && errors.password.map((msg, i) => <span key={i} className="sp-err-text">{msg}</span>)}
                            </div>
                            <div className="sp-input-block">
                                <label className="sp-label">Confirm Password</label>
                                <div className="sp-input-container">
                                    <input type={showConfirmPassword ? "text" : "password"} name="passwordConfirm" class="sp-input" placeholder="Repeat password" />
                                    <i className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} sp-pass-toggle`} onClick={() => setShowConfirmPassword(!showConfirmPassword)}></i>
                                </div>
                                {errors.confirmPassword && errors.confirmPassword.map((msg, i) => <span key={i} className="sp-err-text">{msg}</span>)}
                            </div>
                        </div>

                        <div className="sp-divider">Facility Location</div>

                        <div className="sp-grid-2">
                            <div className="sp-input-block">
                                <label className="sp-label">Address Line 1</label>
                                <div className="sp-input-container">
                                    <input type="text" name="address_line_1" className="sp-input" placeholder="Building, Street, etc." />
                                </div>
                                {errors.address_line_1 && errors.address_line_1.map((msg, i) => <span key={i} className="sp-err-text">{msg}</span>)}
                            </div>
                            <div className="sp-input-block">
                                <label className="sp-label">Address Line 2 <span style={{color: '#94a3b8', fontWeight: '400'}}>(Optional)</span></label>
                                <div className="sp-input-container">
                                    <input type="text" name="address_line_2" className="sp-input" placeholder="Suite, Landmark, etc." />
                                </div>
                            </div>
                        </div>

                        <div className="sp-grid-2" style={{gridTemplateColumns: "2fr 2fr 1.5fr"}}>
                            <div className="sp-input-block">
                                <label className="sp-label">City</label>
                                <div className="sp-input-container">
                                    <input type="text" name="city" className="sp-input" placeholder="City" />
                                </div>
                                {errors.city && errors.city.map((msg, i) => <span key={i} className="sp-err-text">{msg}</span>)}
                            </div>
                            <div className="sp-input-block">
                                <label className="sp-label">State / Province</label>
                                <div className="sp-input-container">
                                    <input type="text" name="state" className="sp-input" placeholder="State" />
                                </div>
                                {errors.state && errors.state.map((msg, i) => <span key={i} className="sp-err-text">{msg}</span>)}
                            </div>
                            <div className="sp-input-block">
                                <label className="sp-label">ZIP Code</label>
                                <div className="sp-input-container">
                                    <input type="text" name="pincode" className="sp-input" placeholder="ZIP" />
                                </div>
                                {errors.pincode && errors.pincode.map((msg, i) => <span key={i} className="sp-err-text">{msg}</span>)}
                            </div>
                        </div>

                        <button className="sp-btn-submit" type="submit" disabled={isLoading} style={{marginTop: "20px"}}>
                            {isLoading ? (
                                <><i className="fa-solid fa-spinner fa-spin me-2"></i> Registering...</>
                            ) : (
                                "Create Account"
                            )}
                        </button>

                        <div className="sp-footer">
                            Already have an account? <Link to="/login" className="sp-link ms-1">Log in</Link>
                        </div>

                    </form>
                </div>
            </div>

            {/* Right Showcase side (Swapped for Sign Up) */}
            <div className="split-showcase" style={{ background: "linear-gradient(145deg, #0f172a 0%, #064e3b 100%)", alignItems: "flex-end", textAlign: "right" }}>
                <div className="split-brand" style={{ justifySelf: "flex-end" }}>
                    ecoRecycle
                    <i className="fa-solid fa-leaf"></i>
                </div>
                
                <div className="split-hero">
                    <h1>Green.<br />Clean.<br />Serene.</h1>
                    <p style={{marginLeft: "auto", marginRight: "0"}}>Take the first step towards a zero e-waste future. Your contributions help pave the way toward a cleaner, healthier Earth.</p>
                </div>

                {/* Additional decorations */}
                <span style={{
                    position: "absolute", top: "10%", left: "10%", opacity: 0.1, fontSize: "15rem"
                }}><i className="fa-solid fa-globe"></i></span>
            </div>

        </div>
    );
};

export default SignUp;
