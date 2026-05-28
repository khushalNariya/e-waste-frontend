import React, { useState } from "react";
// import axios from "axios";
import { Link } from "react-router-dom";
import { loginUser } from "./api";



// import "./AdminLogin.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // const res = await axios.post("http://127.0.0.1:1000/login__2/", {
      //   email,
      //   password,
      // });


      const data = await loginUser(email, password);


      // if (!res.data.is_staff && !res.data.is_superuser && !res.data.is_active) {
      //   setError("Admin access only ❌");
      //   return;
      // }


      if (!data.is_staff && !data.is_active) {
        setError("Admin access only ❌");
        return;
      }

      // && !data.is_superuser
      // localStorage.setItem("access_token", res.data.access);
      // localStorage.setItem("refresh_token", res.data.refresh);
      // localStorage.setItem("first_name", res.data.first_name);


      // localStorage.setItem("access_token", data.access);
      // localStorage.setItem("refresh_token", data.refresh);
      // localStorage.setItem("first_name", data.first_name);

      localStorage.setItem("admin_access_token", data.access);
      localStorage.setItem("admin_refresh_token", data.refresh);
      localStorage.setItem("admin_first_name", data.first_name);

      window.location.href = "/admin/Users_2";

    } catch {
      setError("Invalid Admin Credentials ❌");
    }
  };

  return (
    <section className="admin-bg">

      <div className="admin-card">

        <div className="auth-header">
          <div className="eco-icon">♻️</div>
          <h2>E-Waste Admin Portal</h2>
          <p>Secure Recycling & Drop Point Management</p>
        </div>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={handleSubmit}>

          <div className="input-box">
            <label>Admin Email</label>
            <input
              type="email"
              placeholder="admin@ewaste.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-box">
            <label>Admin Password</label>
            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          <button className="admin-login-btn">
            Secure Login →
          </button>

        </form>

        {/* ✅ SIGNUP LINK */}
        <div className="auth-switch">
          Don't have an admin account?{" "}
          <Link to="/admin/Sign-up">Sign-Up</Link>
        </div>

        <div className="admin-footer">
          Authorized Personnel Only
        </div>

      </div>

    </section>
  );
};

export default AdminLogin;
