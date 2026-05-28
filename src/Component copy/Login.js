import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { loginUser } from "../Admin/Register Users/api";


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [generalErrors, setGeneralErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralErrors([]);

    try {
      // const res = await axios.post(
      //   "http://127.0.0.1:1000/login__2/",
      //   { email, password },
      //   { headers: { "Content-Type": "application/json" } }
      // );


      const res = await loginUser(email, password);

      // ✅ Login success → save tokens in localStorage
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      // Optional: save user info
      localStorage.setItem("user_id", res.data.user_id);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("is_staff", res.data.is_staff);
      localStorage.setItem("is_superuser", res.data.is_superuser);

      // Redirect
      window.location.href = "/";

    } catch (err) {
      
      // DRF validation errors
      if (err.response && err.response.data) {
        const data = err.response.data;

        // non_field_errors -> generalErrors
        if (data.non_field_errors) {
          setGeneralErrors(data.non_field_errors);
        }

        // field-specific errors
        const fieldErrors = { ...data };
        delete fieldErrors.non_field_errors;
        setErrors(fieldErrors);
      } else {
        setGeneralErrors(["Something went wrong. Try again."]);
      }
    }
  };

  return (
    <section className="auth-section">
      <div className="container">
        <div className="row justify-content-center align-items-center ">
          <div className="col-md-5">
            <div className="auth-card">
              <h3 className="text-center fw-bold mb-3">Welcome Back</h3>
              <p className="text-center text-muted mb-4">
                Login to continue using E-Waste
              </p>

              {/* General Errors */}
              {generalErrors.length > 0 && (
                <div className="alert alert-danger">
                  {generalErrors.map((err, i) => (
                    <div key={i}>⚠️ {err}</div>
                  ))}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email &&
                    errors.email.map((msg, i) => (
                      <small key={i} className="text-danger">
                        {msg}
                      </small>
                    ))}
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password &&
                    errors.password.map((msg, i) => (
                      <small key={i} className="text-danger">
                        {msg}
                      </small>
                    ))}
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="showLoginPassword"
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                    />
                    <label className="form-check-label" htmlFor="showLoginPassword">
                      Show Password
                    </label>
                  </div>
                  <Link to="#" className="auth-link">
                    Forgot Password?
                  </Link>
                </div>

                <button className="btn btn-success w-100 mb-3" type="submit">
                  Sign in
                </button>

                <p className="text-center text-muted">
                  Don’t have an account?{" "}
                  <Link to="/sign-up" className="auth-link fw-bold">
                    Sign Up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
