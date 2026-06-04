import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [generalErrors, setGeneralErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setGeneralErrors([]);
        setIsLoading(true);

        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL || "http://127.0.0.1:1000/"}user/login/`,
                { email, password },
                { headers: { "Content-Type": "application/json" } }
            );

            if (!res.data.is_active) {
                setGeneralErrors("Account is inactive ❌");
                setIsLoading(false);
                return;
            }

            localStorage.setItem("user_access_token", res.data.access);
            localStorage.setItem("user_refresh_token", res.data.refresh);
            localStorage.setItem("user_first_name", res.data.first_name);
            localStorage.setItem("user_id", res.data.user_id);
            localStorage.setItem("email", res.data.email);
            localStorage.setItem("is_staff", res.data.is_staff);
            localStorage.setItem("is_superuser", res.data.is_superuser);

            window.location.href = "/";
        } catch (err) {
            if (err.response && err.response.data) {
                const data = err.response.data;
                if (data.non_field_errors) {
                    setGeneralErrors(data.non_field_errors);
                }
                const fieldErrors = { ...data };
                delete fieldErrors.non_field_errors;
                setErrors(fieldErrors);
            } else {
                setGeneralErrors(["Something went wrong. Try again."]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="split-layout">

            {/* Left Showcase side */}
            <div className="split-showcase">
                <div className="split-brand">
                    <i className="fa-solid fa-recycle"></i>
                    ecoRecycle
                </div>

                <div className="split-hero">
                    <h1>Recycle smart.<br />Earn rewards.</h1>
                    <p>Join thousands of environmental stewards using our robust logistics portal to convert e-waste into sustainable value.</p>
                </div>
            </div>

            {/* Right Form side */}
            <div className="split-form-area">
                <div className="split-form-wrapper">

                    <div className="form-title-group">
                        <h2>Welcome back</h2>
                        <p>Please enter your details to sign in.</p>
                    </div>

                    {/* ✅ PRESERVED: Backend Error LOGIC */}
                    {generalErrors.length > 0 && (
                        <div className="sp-alert">
                            <i className="fa-solid fa-circle-exclamation"></i>
                            <div>{Array.isArray(generalErrors) ? generalErrors.map((err, i) => <div key={i}>{err}</div>) : generalErrors}</div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="sp-input-block">
                            <label className="sp-label">Email Address</label>
                            <div className="sp-input-container">
                                <input
                                    type="email"
                                    className="sp-input"
                                    placeholder="e.g., alex@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            {errors.email && errors.email.map((msg, i) => (
                                <span key={i} className="sp-err-text">{msg}</span>
                            ))}
                        </div>

                        <div className="sp-input-block">
                            <label className="sp-label">Password</label>
                            <div className="sp-input-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="sp-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <i
                                    className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} sp-pass-toggle`}
                                    onClick={() => setShowPassword(!showPassword)}
                                ></i>
                            </div>
                            {errors.password && errors.password.map((msg, i) => (
                                <span key={i} className="sp-err-text">{msg}</span>
                            ))}
                        </div>

                        <div className="sp-options">
                            <label className="sp-check">
                                <input type="checkbox" />
                                Remember for 30 days
                            </label>
                            <Link to="#" className="sp-link">Forgot password?</Link>
                        </div>

                        <button className="sp-btn-submit" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <><i className="fa-solid fa-spinner fa-spin me-2"></i> Signing in...</>
                            ) : (
                                "Sign in"
                            )}
                        </button>

                        <div className="sp-footer">
                            Don't have an account? <Link to="/sign-up" className="sp-link ms-1">Sign up</Link>
                        </div>

                    </form>
                </div>
            </div>

        </div>
    );
};

export default Login;
