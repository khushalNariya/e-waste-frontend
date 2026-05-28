import React from "react";
import { Link } from "react-router-dom";
import Page_Header_Edit_or_Add from "../Common Files/Page_Header_Edit__or__Add";

export default function E_Waste_Status_History_Form({
    headingText,
    headingIcon,
    breadcrumbText,

    isEdit,

    form,
    errors,
    errorMsg,
    isSubmitting,
    handleChange,
    handleSubmit,
    submitButtonText,
    submitButtonIcon,
}) {
    // Helper to render read-only fields in the old UI style
    const ReadOnlyField = ({ label, value, col = "col-md-4" }) => (
        <div className={`${col} mb-3`}>
            <label className="form-label fw-bold">{label}</label>
            <input
                type="text"
                value={value || "---"}
                className="form-control bg-light"
                readOnly
            />
        </div>
    );

    return (
        <div className="admin-content mt-4">

            {/* ===== HEADER ===== */}
            <Page_Header_Edit_or_Add
                headingText={headingText}
                headingIcon={headingIcon}
                breadcrumbText={breadcrumbText}

                breadIcon="fa-list"
                listLink="/admin/E-Waste-Status-History"
                listName="Status History List"
            />

            {/* ===== FORM CARD ===== */}
            <div className="row justify-content-center">
                <div className="col-lg-10">

                    <div className="card shadow-sm border-0">
                        <div className="card-body">

                            <form onSubmit={handleSubmit}>

                                {errorMsg && (
                                    <div className="alert alert-danger">
                                        <i className="fa fa-exclamation-triangle me-2"></i>
                                        {errorMsg}
                                    </div>
                                )}

                                <div className="row">
                                    {/* ID FIELD */}
                                    <div className="col-md-12 mb-3">
                                        <label className="form-label fw-bold">History Record ID</label>
                                        <input
                                            type="text"
                                            value={form.id}
                                            className="form-control bg-light"
                                            readOnly
                                        />
                                    </div>

                                    {/* 1. SUBMISSION DETAILS SECTION */}
                                    <h5 className="mb-3 text-primary border-bottom pb-2">1. Submission Details</h5>

                                    <ReadOnlyField label="Submission ID" value={`#${form.submission}`} />
                                    <ReadOnlyField label="User" value={`${form.user?.first_name} ${form.user?.last_name}`} />
                                    <ReadOnlyField label="Status Changed To" value={form.status?.replace(/_/g, ' ').toUpperCase()} />

                                    {/* 2. PRODUCT DETAILS SECTION */}
                                    <h5 className="mt-4 mb-3 text-primary border-bottom pb-2">2. Product Information</h5>

                                    <ReadOnlyField label="Category" value={form.product?.category} />
                                    <ReadOnlyField label="Brand" value={form.product?.brand} />
                                    <ReadOnlyField label="Model" value={form.product?.name} />

                                    {/* 3. IMAGES SECTION */}
                                    <h5 className="mt-4 mb-3 text-primary border-bottom pb-2">3. Product Image</h5>
                                    <div className="col-md-12 mb-4">
                                        <div className="image-gallery-grid d-flex flex-wrap gap-3">
                                            {form.image ? (
                                                <div className="image-slot position-relative" style={{ width: "150px", height: "150px" }}>
                                                    <img
                                                        src={form.image}
                                                        alt="Submission"
                                                        className="rounded-3 shadow-sm w-100 h-100"
                                                        style={{ objectFit: "cover", border: "2px solid #ddd" }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="text-muted small">No Image Available</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 4. REMARKS SECTION (EDITABLE) */}
                                    <h5 className="mt-4 mb-3 text-primary border-bottom pb-2">4. Admin Action</h5>
                                    
                                    <div className="col-md-12 mb-3">
                                        <label className="form-label fw-bold">Remarks</label>
                                        <textarea
                                            name="remarks"
                                            value={form.remarks || ""}
                                            className={`form-control ${errors.remarks ? "is-invalid" : ""}`}
                                            onChange={handleChange}
                                            rows="4"
                                            placeholder="Enter remarks for this status history record..."
                                        />
                                        {errors.remarks && <div className="invalid-feedback">{errors.remarks}</div>}
                                    </div>

                                    <ReadOnlyField label="Changed By" value={form.changed_by ? `${form.changed_by.first_name} ${form.changed_by.last_name}` : "System"} />
                                    <ReadOnlyField label="Time" value={form.created_at} />
                                </div>

                                <button
                                    type="submit"
                                    className="add-btn w-100 py-2 mt-3 shadow-sm rounded-3"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <i className="fa fa-spinner fa-spin me-2"></i>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <i className={`fa ${submitButtonIcon} me-2`}></i>
                                            {submitButtonText}
                                        </>
                                    )}
                                </button>

                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
