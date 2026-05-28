import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Education_API } from "./api";

export default function Add_Education() {




  const [errorMsg, setErrorMsg] = useState("");

  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: null,
    category: "",
    author: "",
    date: "",
    readTime: "",
    isFeatured: false
  });

  const [errors, setErrors] = useState({});



  // ================= INPUT CHANGE =================
  const handleChange = (e) => {

    if (e.target.type === "file") {
      setForm({ ...form, image: e.target.files[0] });
    }

    else if (e.target.type === "checkbox") {
      setForm({ ...form, [e.target.name]: e.target.checked });
    }

    else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }

    setErrors(prev => ({ ...prev, [e.target.name]: "" }));
  };


  // const validate = () => {
  //   let newErrors = {};

  //   if (!form.first_name) newErrors.first_name = "Required";
  //   if (!form.last_name) newErrors.last_name = "Required";
  //   if (!form.email) newErrors.email = "Required";
  //   if (!form.password) newErrors.password = "Required";
  //   if (!form.confirmPassword) newErrors.confirmPassword = "Required";

  //   if (form.password !== form.confirmPassword)
  //     newErrors.confirmPassword = "Passwords do not match";

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };


  // ---------------- SUBMIT FORM ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMsg("");
    setErrorMsg("");
    setErrors({});


    try {
      await Education_API.create(form)
      // first_name: firstName,
      // last_name: lastName,
      // email,
      // password,
      // mobile_number: mobile,
      // address_line_1: address1,
      // address_line_2: address2,
      // city,
      // state,
      // pincode,
      // });

      sessionStorage.setItem("success_message", "Education added successfully!");
      navigate("/admin/Education");

    } catch (err) {
      if (err.response?.data) {
        console.log(err.response.data); // <- check yaha

        setErrors(err.response.data); // DRF errors show
      } else {
        setErrorMsg("Failed to add user. Try again!");
      }
    }
  };

  return (
    <div className="admin-content mt-4">

      {/* ===== PAGE HEADER ===== */}
      <div className="page-header d-flex justify-content-between align-items-center mb-3 flex-wrap">

        <div>
          <h4 className="fw-bold text-success mb-1">
            <i className="fa fa-user-plus me-2"></i> Add New Education
          </h4>

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb premium-breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/admin">
                  <i className="fa fa-home me-1"></i> Dashboard
                </Link>
              </li>

              <li className="breadcrumb-item">
                <Link to="/admin/Education">
                  <i className="fa fa-users me-1"></i> Education Management
                </Link>
              </li>

              <li className="breadcrumb-item active">Add Education</li>
            </ol>
          </nav>
        </div>

        <span className="badge eco-badge">Admin Panel</span>
      </div>

      {/* ===== ALERTS ===== */}
      {successMsg && <div className="alert alert-success shadow-sm">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger shadow-sm">{errorMsg}</div>}

      {/* ===== FORM CARD ===== */}
      <div className="row justify-content-center">
        <div className="col-lg-9 col-xl-8">

          <div className="card shadow-sm border-0">
            <div className="card-body">

              <form onSubmit={handleSubmit}>

                {/* Title */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Title"
                      value={form.title}
                      className={`form-control ${errors.title && "is-invalid"}`}
                      onChange={handleChange}
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                  </div>

                  {/* Description */}
                  <div className="col-md-6">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      placeholder="Description"
                      value={form.description}
                      className={`form-control ${errors.description && "is-invalid"}`}
                      onChange={handleChange}
                    />
                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                  </div>
                </div>

                {/* Image & Category */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Image</label>
                    <input
                      type="file"
                      name="image"
                      className={`form-control ${errors.image && "is-invalid"}`}
                      onChange={handleChange}
                    />
                    {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Category</label>
                    <input
                      type="text"
                      name="category"
                      placeholder="Category"
                      value={form.category}
                      className={`form-control ${errors.category && "is-invalid"}`}
                      onChange={handleChange}
                    />
                    {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                  </div>
                </div>

                {/* Author */}
                <div className="mb-3">
                  <label className="form-label">Author</label>
                  <input
                    type="text"
                    name="author"
                    placeholder="Author"
                    value={form.author}
                    className={`form-control ${errors.author && "is-invalid"}`}
                    onChange={handleChange}
                  />
                  {errors.author && <div className="invalid-feedback">{errors.author}</div>}
                </div>

                {/* Date */}
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    className={`form-control ${errors.date && "is-invalid"}`}
                    onChange={handleChange}
                  />
                  {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                </div>

                {/* ReadTime & Featured */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Read Time</label>
                    <input
                      type="text"
                      name="readTime"
                      placeholder="Read Time"
                      value={form.readTime}
                      className={`form-control ${errors.readTime && "is-invalid"}`}
                      onChange={handleChange}
                    />
                    {errors.readTime && <div className="invalid-feedback">{errors.readTime}</div>}
                  </div>

                  <div className="col-md-6 d-flex align-items-center mt-4">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={form.isFeatured}
                      className="form-check-input me-2"
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Is Featured</label>
                  </div>
                </div>

                <button type="submit" className="add-btn w-100 py-2">
                  <i className="fa fa-plus me-1"></i> Add Education
                </button>

              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


