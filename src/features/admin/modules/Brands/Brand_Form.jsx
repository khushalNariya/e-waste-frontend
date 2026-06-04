import React from "react";
// eslint-disable-next-line no-unused-vars
import { Link } from "react-router-dom";
import Page_Header_Edit_or_Add from "../Common Files/Page_Header_Edit__or__Add";

export default function Brand_Form({
    headingText,
    headingIcon,
    breadcrumbText,

    form,
    errors,
    handleChange,
    handleSubmit,
    submitButtonText,
    submitButtonIcon,
}) {
    return (
        <div className="admin-content mt-4">

            {/* ===== HEADER ===== */}
            {/* <div className="page-header d-flex justify-content-between align-items-center mt-4 mb-3 flex-wrap">
                <div>
                    <h4 className="fw-bold text-success mb-1">
                        <i className={`fa ${headingIcon} me-2`}></i> {headingText}
                    </h4>

                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb premium-breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="/admin">
                                    <i className="fa fa-home me-1"></i> Dashboard
                                </Link>
                            </li>

                            <li className="breadcrumb-item">
                                <Link to="/admin/Brand">
                                    <i className={`fa ${breadIcon} me-1`}></i> Brand Name List
                                </Link>
                            </li>

                            <li className="breadcrumb-item active">
                                {breadcrumbText}
                            </li>
                        </ol>
                    </nav>
                </div>

                <span className="badge eco-badge">Admin Panel</span>
            </div> */}

            <Page_Header_Edit_or_Add
                headingText={headingText}
                headingIcon={headingIcon}
                breadcrumbText={breadcrumbText}
                
                breadIcon="fa-tags"
                listLink="/admin/Brand"
                listName="Brand Name List"
            />

            {/* ===== FORM CARD ===== */}
            <div className="row justify-content-center">
                <div className="col-lg-8">

                    <div className="card shadow-sm border-0">
                        <div className="card-body">

                            <form onSubmit={handleSubmit}>

                                {/* Title */}
                                <div className="mb-3">
                                    <label className="form-label">Brand Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                        onChange={handleChange}
                                    />
                                    {errors.name && (
                                        <div className="invalid-feedback">
                                            {errors.name}
                                        </div>
                                    )}
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
