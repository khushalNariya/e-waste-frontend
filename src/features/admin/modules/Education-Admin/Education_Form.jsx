import React from "react";
import { Link } from "react-router-dom";

export default function EducationForm({
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
                                    <i className="fa fa-home me-1"></i> Dashboard
                                </Link>
                            </li>

                            <li className="breadcrumb-item">
                                <Link to="/admin/Education">
                                    <i className="fa fa-book me-1"></i> Education
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

                                {/* Title & Description*/}
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
                                        {errors.title && <div className="invalid-feedback">{errors.title[0]}</div>}
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
                                    <div className="col-md-6">
                                        <label className="form-label">Image</label>

                                        {/* Image Preview */}
                                        {preview && (
                                            <div className="mb-3 text-center">
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="img-fluid rounded shadow-sm"
                                                    style={{ height: "300px", objectFit: "cover" }}
                                                />
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

                                    {/* Category */}
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

                                    {/* Is Featured */}
                                    {/* <div className="col-md-6 d-flex align-items-center mt-4">
                                        <input
                                            type="checkbox"
                                            name="isFeatured"
                                            checked={form.isFeatured}
                                            className="form-check-input me-2"
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label">Is Featured</label>
                                    </div> */}

                                    {/* Is Featured */}
                                    <div className="col-md-6">
                                        <label className="form-label">Is Featured</label>

                                        <select
                                            name="isFeatured"
                                            value={form.isFeatured ? "true" : "false"}
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
