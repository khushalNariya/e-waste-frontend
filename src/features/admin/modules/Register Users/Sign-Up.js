import React, { useState } from "react";
import { Link } from "react-router-dom";

import axios from "axios";



const AdminSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
    // const [showConfirm, setShowConfirm] = useState(false);
  
  const [errors, setErrors] = useState({});
  const [generalErrors, setGeneralErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setGeneralErrors([]);

    const form = new FormData(e.target);

    const data = {
      first_name: form.get("first_name"),
      last_name: form.get("last_name"),
      email: form.get("email"),
      password: form.get("password"),
      confirmPassword: form.get("confirmPassword"),
      mobile_number: form.get("mobile_number"),
      address_line_1: form.get("address_line_1"),
      address_line_2: form.get("address_line_2"),
      city: form.get("city"),
      state: form.get("state"),
      pincode: form.get("pincode"),
    };

    // if (data.password !== data.passwordConfirm) {
    //   setErrors({ passwordConfirm: ["Passwords do not match"] });
    //   return;
    // }

    // delete data.passwordConfirm;

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || "http://127.0.0.1:1000/"}api/1___3___API__app__1__Admin_User_Register/`,
        data
      );

      if (res.status === 200 || res.status === 201) {
        window.location.href = "/admin/";
      }

    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setGeneralErrors(["Something went wrong"]);
      }
    }
  };

  return (
    <section className="admin-bg">

      <div className="admin-card">

        <div className="auth-header">
          <div className="eco-icon">♻️</div>
          <h2>Admin Registration</h2>
          <p>Create Admin Account</p>
        </div>

        {generalErrors.length > 0 && (
          <div className="admin-error">
            {generalErrors.map((e, i) => (
              <div key={i}>⚠️ {e}</div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="row">
            <div className="col-md-6 input-box">
              <label>First Name</label>
              <input name="first_name" />
              {errors.first_name && <small className="text-danger">{errors.first_name}</small>}
            </div>

            <div className="col-md-6 input-box">
              <label>Last Name</label>
              <input name="last_name" />
              {errors.last_name && <small className="text-danger">{errors.last_name}</small>}
            </div>
          </div>

          <div className="input-box">
            <label>Email</label>
            <input name="email" />
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </div>

          <div className="input-box">
            <label>Mobile</label>
            <input name="mobile_number" />
            {errors.mobile_number && <small className="text-danger">{errors.mobile_number}</small>}
          </div>

          <div className="row">
            <div className="col-md-6 input-box">
              <label>Password</label>
              <input type={showPassword ? "text" : "password"} name="password" />
                        {errors.password && <small className="text-danger">{errors.password}</small>}

            </div>

            <div className="col-md-6 input-box">
              <label>Confirm Password</label>
              <input type={showPassword ? "text" : "password"} name="confirmPassword" />
            {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword[0]}</small>}

            </div>
          </div>

          <div className="password-box mb-3">
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🙈 Hide" : "👁 Show"}
            </span>
          </div>

          <div className="input-box">
            <label>Address Line 1</label>
            <input name="address_line_1" />
            {errors.address_line_1 && <small className="text-danger">{errors.address_line_1}</small>}

          </div>

          <div className="input-box">
            <label>Address Line 2</label>
            <input name="address_line_2" />

          </div>

          <div className="row">
            <div className="col-md-4 input-box">
              <label>City</label>
              <input name="city" />
              {errors.city && <small className="text-danger">{errors.city}</small>}

            </div>

            <div className="col-md-4 input-box">
              <label>State</label>
              <input name="state" />
              {errors.state && <small className="text-danger">{errors.state[0]}</small>}

            </div>

            <div className="col-md-4 input-box">
              <label>Pincode</label>
              <input name="pincode" />
              {errors.pincode && <small className="text-danger">{errors.pincode[0]}</small>}

            </div>
          </div>

          <button className="admin-login-btn mt-2">
            Register Admin →
          </button>

        </form>
        <div className="auth-switch">
          Already have an account ?
          <Link to="/admin/"> Login here</Link>
        </div>

        <div className="admin-footer">
          Secure Admin Registration Only
        </div>

      </div>

    </section>
  );
};

export default AdminSignup;
