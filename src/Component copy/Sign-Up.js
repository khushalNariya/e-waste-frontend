// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// // import "./Auth.css";

// const SignUp = () => {
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <section className="auth-section">
//       <div className="container">
//         <div className="row justify-content-center align-items-center ">
//           <div className="col-lg-8">
//             <div className="auth-card">

//               <h3 className="text-center fw-bold mb-2">Create Account</h3>
//               <p className="text-center text-muted mb-4">
//                 Register to start recycling responsibly with E-Waste
//               </p>

//               <form>
//                 {/* Name */}
//                 <div className="row">
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">First Name</label>
//                     <input type="text" className="form-control" placeholder="First name" />
//                   </div>

//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Last Name</label>
//                     <input type="text" className="form-control" placeholder="Last name" />
//                   </div>
//                 </div>

//                 {/* Contact */}
//                 <div className="row">
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Mobile Number</label>
//                     <input type="text" className="form-control" placeholder="Mobile number" />
//                   </div>

//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Email</label>
//                     <input type="email" className="form-control" placeholder="Email address" />
//                   </div>
//                 </div>

//                 {/* Password */}
//                 <div className="row">
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Password</label>
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       className="form-control"
//                       placeholder="Create password"
//                     />
//                   </div>

//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Confirm Password</label>
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       className="form-control"
//                       placeholder="Confirm password"
//                     />
//                   </div>
//                 </div>

//                 <div className="password-toggle form-check mb-3">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     id="showPassword"
//                     checked={showPassword}
//                     onChange={() => setShowPassword(!showPassword)}
//                   />
//                   <label className="form-check-label" htmlFor="showPassword">
//                     Show Password
//                   </label>
//                 </div>

//                 {/* Address */}
//                 <h6 className="fw-bold mt-3 mb-2">Address Details</h6>

//                 <div className="mb-3">
//                   <label className="form-label">Address Line 1</label>
//                   <input type="text" className="form-control" placeholder="House no, building, street" />
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label">Address Line 2</label>
//                   <input type="text" className="form-control" placeholder="Landmark (optional)" />
//                 </div>

//                 <div className="row mb-4">
//                   <div className="col-md-4 mb-3">
//                     <label className="form-label">City</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="City"
//                     />
//                   </div>

//                   <div className="col-md-4 mb-3">
//                     <label className="form-label">State</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="State"
//                     />
//                   </div>

//                   <div className="col-md-4 mb-3">
//                     <label className="form-label">Pincode</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="Pincode"
//                     />
//                   </div>
//                 </div>



//                 <button className="btn btn-success w-100 mt-6 mb-3">
//                   Register
//                 </button>

//                 <p className="text-center text-muted">
//                   Already have an account?{" "}
//                   <Link to="/login" className="auth-link fw-bold">
//                     Login
//                   </Link>
//                 </p>

//               </form>

//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default SignUp;


import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalErrors, setGeneralErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setGeneralErrors([]);

    const form = new FormData(e.target);

    const data = {
      first_name: form.get("first_name")?.trim(),
      last_name: form.get("last_name")?.trim(),
      email: form.get("email")?.trim(),
      password: form.get("password"),
      confirmPassword: form.get("confirmPassword"),
      mobile_number: form.get("mobile_number"),
      address_line_1: form.get("address_line_1"),
      address_line_2: form.get("address_line_2"),
      city: form.get("city"),
      state: form.get("state"),
      pincode: form.get("pincode"),
    };

    // Password Confirm Validation
    // if (data.password !== data.passwordConfirm) {
    //   setErrors({ passwordConfirm: ["Password and Confirm Password do not match"] });
    //   return;
    // }

    // Remove confirm before sending
    // delete data.passwordConfirm;

    try {
      const res = await axios.post(
        "http://127.0.0.1:1000/api/1___2___API__app__1__User_Register/",
        data,
        // { headers: { "Content-Type": "application/json" } }
      );

      if (res.status === 201 || res.status === 200) {
        window.location.href = "/login";
      }

    } catch (err) {
      if (err.response && err.response.data) {
        setErrors(err.response.data); // DRF serializer errors
      } else {
        setGeneralErrors(["Something went wrong. Try again"]);
      }
    }
  };

  return (
    <section className="auth-section">
      <div className="container">
        <div className="row justify-content-center align-items-center ">
          <div className="col-lg-8">
            <div className="auth-card">

              <h3 className="text-center fw-bold mb-2">Create Account</h3>
              <p className="text-center text-muted mb-4">
                Register to start recycling responsibly with E-Waste
              </p>

              {/* General Errors */}
              {generalErrors.length > 0 && (
                <div className="alert alert-danger">
                  {generalErrors.map((er, i) => (
                    <div key={i}>⚠️ {er}</div>
                  ))}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                {/* Name */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">First Name</label>
                    <input type="text" name="first_name" className="form-control" />
                    {errors.first_name && errors.first_name.map((msg, i) => (
                      <small key={i} className="text-danger">{msg}</small>
                    ))}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Last Name</label>
                    <input type="text" name="last_name" className="form-control" />
                    {errors.last_name && errors.last_name.map((msg, i) => (
                      <small key={i} className="text-danger">{msg}</small>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Mobile Number</label>
                    <input type="text" name="mobile_number" className="form-control" />
                    {errors.mobile_number && errors.mobile_number.map((msg, i) => (
                      <small key={i} className="text-danger">{msg}</small>
                    ))}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" name="email" className="form-control" />
                    {errors.email && errors.email.map((msg, i) => (
                      <small key={i} className="text-danger">{msg}</small>
                    ))}
                  </div>
                </div>

                {/* Password */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="form-control"
                    />
                    {errors.password && errors.password.map((msg, i) => (
                      <small key={i} className="text-danger">{msg}</small>
                    ))}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="passwordConfirm"
                      className="form-control"
                    />
                    {errors.passwordConfirm && errors.passwordConfirm.map((msg, i) => (
                      <small key={i} className="text-danger">{msg}</small>
                    ))}
                  </div>
                </div>

                {/* Show Password */}
                <div className="password-toggle form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  <label className="form-check-label" htmlFor="showPassword">
                    Show Password
                  </label>
                </div>

                {/* Address */}
                <h6 className="fw-bold mt-3 mb-2">Address Details</h6>

                <div className="mb-3">
                  <label className="form-label">Address Line 1</label>
                  <input type="text" name="address_line_1" className="form-control" />
                  {errors.address_line_1 && errors.address_line_1.map((msg, i) => (
                    <small key={i} className="text-danger">{msg}</small>
                  ))}
                </div>

                <div className="mb-3">
                  <label className="form-label">Address Line 2</label>
                  <input type="text" name="address_line_2" className="form-control" />
                </div>

                <div className="row mb-4">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">City</label>
                    <input type="text" name="city" className="form-control" />
                    {errors.city && errors.city.map((msg, i) => (
                      <small key={i} className="text-danger">{msg}</small>
                    ))}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">State</label>
                    <input type="text" name="state" className="form-control" />
                    {errors.state && errors.state.map((msg, i) => (
                      <small key={i} className="text-danger">{msg}</small>
                    ))}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Pincode</label>
                    <input type="text" name="pincode" className="form-control" />
                    {errors.pincode && errors.pincode.map((msg, i) => (
                      <small key={i} className="text-danger">{msg}</small>
                    ))}
                  </div>
                </div>

                <button className="btn btn-success w-100 mt-6 mb-3">
                  Register
                </button>

                <p className="text-center text-muted">
                  Already have an account?{" "}
                  <Link to="/login" className="auth-link fw-bold">
                    Login
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

export default SignUp;
