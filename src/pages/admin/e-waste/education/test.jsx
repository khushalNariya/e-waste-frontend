import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Education_API } from "./api";

export default function Add_Education() {

  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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


  // ---------------- SUBMIT FORM ----------------
  const handleSubmit = async (e) => {

    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    setErrors({});

    const formData = new FormData();

    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });

    try {

      await Education_API.create(formData);

      sessionStorage.setItem(
        "success_message",
        "Education added successfully!"
      );

      navigate("/admin/Education_List");

    } catch (err) {

      if (err.response?.data) {
        console.log(err.response.data);
        setErrors(err.response.data);
      }
      else {
        setErrorMsg("Failed to add education. Try again!");
      }
    }
  };

  return (
    <div className="admin-content mt-4">

      {/* ===== PAGE HEADER ===== */}
      <div className="page-header d-flex justify-content-between align-items-center mt-4 mb-3 flex-wrap">

        <div>
          <h4 className="fw-bold text-success mb-1">
            <i className="fa fa-book me-2"></i> Add Education Article
          </h4>

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb premium-breadcrumb">

              <li className="breadcrumb-item">
                <Link to="/admin">
                  <i className="fa fa-home me-1"></i> Dashboard
                </Link>
              </li>

              <li className="breadcrumb-item active">
                Add Education
              </li>

            </ol>
          </nav>
        </div>

        <span className="badge eco-badge">
          Admin Panel
        </span>
      </div>

      {/* ===== ALERTS ===== */}
      {successMsg && (
        <div className="alert alert-success shadow-sm">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-danger shadow-sm">
          {errorMsg}
        </div>
      )}

      {/* ===== FORM CARD ===== */}
      <div className="row justify-content-center">
        <div className="col-lg-9 col-xl-8">

          <div className="card shadow-sm border-0">
            <div className="card-body">

              <form onSubmit={handleSubmit}>

                <input
                  name="title"
                  placeholder="Title"
                  className={`form-control mb-3 ${errors.title && "is-invalid"}`}
                  onChange={handleChange}
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}

                <textarea
                  name="description"
                  placeholder="Description"
                  className={`form-control mb-3 ${errors.description && "is-invalid"}`}
                  onChange={handleChange}
                />
                {errors.description && <div className="invalid-feedback">{errors.description}</div>}

                <input
                  type="file"
                  name="image"
                  className={`form-control mb-3 ${errors.image && "is-invalid"}`}
                  onChange={handleChange}
                />
                {errors.image && <div className="invalid-feedback">{errors.image}</div>}

                <input
                  name="category"
                  placeholder="Category"
                  className={`form-control mb-3 ${errors.category && "is-invalid"}`}
                  onChange={handleChange}
                />

                <input
                  name="author"
                  placeholder="Author"
                  className={`form-control mb-3 ${errors.author && "is-invalid"}`}
                  onChange={handleChange}
                />

                <input
                  type="date"
                  name="date"
                  className={`form-control mb-3 ${errors.date && "is-invalid"}`}
                  onChange={handleChange}
                />

                <input
                  name="readTime"
                  placeholder="Read Time"
                  className={`form-control mb-3 ${errors.readTime && "is-invalid"}`}
                  onChange={handleChange}
                />

                <div className="form-check mb-4">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    className="form-check-input"
                    onChange={handleChange}
                  />
                  <label className="form-check-label">
                    Is Featured
                  </label>
                </div>

                <button
                  type="submit"
                  className="add-btn w-100 py-2"
                >
                  <i className="fa fa-plus me-1"></i>
                  Add Education
                </button>

              </form>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
