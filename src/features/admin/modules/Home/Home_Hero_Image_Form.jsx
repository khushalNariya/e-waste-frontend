import React from "react";
import { Link } from "react-router-dom";

export default function Home_Hero_Image_Form({
    headingText,
    headingIcon,
    breadcrumbText,
    form,
    errors,
    preview,
    handleChange,
    handleSubmit,
    submitButtonText,
    submitButtonIcon,

}) {
    return (
        <div className="admin-content mt-4">

            {/* ===== HEADER ===== */}
            <div className="page-header d-flex justify-content-between align-items-center mb-3 flex-wrap">

                <div>
                    <h4 className="fw-bold text-success mb-1">
                        <i className={`fa ${headingIcon} me-2`}></i> {headingText}
                    </h4>

                    {/* <div>
                        <h4 className="fw-bold text-success mb-1">
                            <i className={`fa ${headingIcon} me-2`}></i> {headingText}
                        </h4> */}

                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb premium-breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="/admin">
                                    <i className="fa fa-home  me-1"></i> Dashboard
                                </Link>
                            </li>

                            <li className="breadcrumb-item">
                                <Link to="/admin/Home-Hero-Image">
                                    <i className="fa fa-image me-1"></i> Hero Image
                                </Link>
                            </li>

                            <li className="breadcrumb-item active">{breadcrumbText}</li>
                        </ol>
                    </nav>
                </div>

                <span className="badge eco-badge">Admin Panel</span>
            </div>

            {/* ===== ALERTS =====
            {successMsg && <div className="alert alert-success shadow-sm">{successMsg}</div>}
            {errorMsg && <div className="alert alert-danger shadow-sm">{errorMsg}</div>} */}

            {/* ===== FORM CARD ===== */}
            <div className="row justify-content-center">
                <div className="col-lg-9 col-xl-8">

                    <div className="card shadow-sm border-0">
                        <div className="card-body">

                            <form onSubmit={handleSubmit}>



                                {/* Image & Category */}
                                <div className="row mb-3">
                                    {/* <div className="col-md-6">
                                        <label className="form-label">Image</label>
                                        <input
                                            type="file"
                                            name="image"
                                            className={`form-control ${errors.image && "is-invalid"}`}
                                            onChange={handleChange}
                                        />
                                        {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                                    </div> */}
                                    <div className="col-md-12">
                                        <label className="form-label">Image</label>

                                        {/* Image Preview */}
                                        {preview && (
                                            <div className="mb-3 text-center">
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="img-fluid rounded shadow-sm"
                                                    style={{ maxHeight: "350px", width: "100%", objectFit: "cover" }} />
                                            </div>
                                        )}

                                        {/* File Input Always Visible */}
                                        <input
                                            type="file"
                                            name="image"
                                            className={`form-control ${errors.image && "is-invalid"}`}
                                            onChange={handleChange}
                                        />

                                        {errors.image && <div className="invalid-feedback d-block">{errors.image}</div>}
                                    </div>
                                </div>



                                {/* ReadTime & Featured */}
                                <div className="row mb-3">


                                    {/* Is Featured */}
                                    <div className="col-12">
                                        <label className="form-label">Active Status</label>

                                        <select
                                            name="is_active"
                                            value={form.is_active ? "true" : "false"}
                                            className="form-select"
                                            onChange={handleChange}
                                        >
                                            <option value="false">No</option>
                                            <option value="true">Yes</option>
                                        </select>
                                    </div>

                                </div>

                                <button type="submit" className="add-btn w-100 py-2">
                                    <i className={`fa ${submitButtonIcon} me-1`}></i>
                                    {submitButtonText}
                                </button>

                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
