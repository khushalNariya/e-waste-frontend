import React from "react";
import { Link } from "react-router-dom";
import Page_Header_Edit_or_Add from "../Common Files/Page_Header_Edit__or__Add";

export default function E_Waste_Submission_Form({
    headingText,
    headingIcon,
    breadcrumbText,

    isEdit,

    categories,
    brands,
    models,
    conditions,
    facilities,

    form,
    errors,
    errorMsg,
    isSubmitting,
    handleChange,
    handleRemoveImage,
    handleSubmit,
    submitButtonText,
    submitButtonIcon,
    selectedUnit
}) {
    return (
        <div className="admin-content mt-4">
            {/* ===== HEADER ===== */}

            <Page_Header_Edit_or_Add
                headingText={headingText}
                headingIcon={headingIcon}
                breadcrumbText={breadcrumbText}

                breadIcon="fa-list"
                listLink="/admin/E-Waste-Submission"
                listName="E-Waste Submission List"
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

                                {errors.non_field_errors && (
                                    <div className="alert alert-danger">
                                        {errors.non_field_errors[0]}
                                    </div>
                                )}

                                <div className="row">
                                    {/* ID FIELD (ONLY EDIT MODE) */}
                                    {isEdit && (
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label fw-bold">Submission ID</label>
                                            <input
                                                type="text"
                                                value={form.id}
                                                className="form-control bg-light"
                                                readOnly
                                            />
                                        </div>
                                    )}

                                    {/* 1. PRODUCT DETAILS SECTION */}
                                    <h5 className="mb-3 text-primary border-bottom pb-2">1. Product Details</h5>

                                    <div className="col-md-4 mb-3">
                                        <label className="form-label fw-bold">Category</label>
                                        <select
                                            name="category_id"
                                            value={form.category_id}
                                            className={`form-select ${errors.category_id ? "is-invalid" : ""}`}
                                            onChange={handleChange}
                                            disabled={isEdit}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.title}</option>
                                            ))}
                                        </select>
                                        {errors.category_id && <div className="invalid-feedback">{errors.category_id}</div>}
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className="form-label fw-bold">Brand</label>
                                        <select
                                            name="category_brand_mapping_id"
                                            value={form.category_brand_mapping_id}
                                            className={`form-select ${errors.category_brand_mapping_id ? "is-invalid" : ""}`}
                                            onChange={handleChange}
                                            disabled={isEdit || !form.category_id}
                                        >
                                            <option value="">Select Brand</option>
                                            {brands.map(b => (
                                                <option key={b.id} value={b.id}>{b.brand?.name}</option>
                                            ))}
                                        </select>
                                        {errors.category_brand_mapping_id && <div className="invalid-feedback">{errors.category_brand_mapping_id}</div>}
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className="form-label fw-bold">Model</label>
                                        <select
                                            name="model_id"
                                            value={form.model_id}
                                            className={`form-select ${errors.model_id ? "is-invalid" : ""}`}
                                            onChange={handleChange}
                                            disabled={isEdit || !form.category_brand_mapping_id}
                                        >
                                            <option value="">Select Model</option>
                                            {models.map(m => (
                                                <option key={m.id} value={m.id}>{m.model_name}</option>
                                            ))}
                                        </select>
                                        {errors.model_id && <div className="invalid-feedback">{errors.model_id}</div>}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">User Condition</label>
                                        <select
                                            name="user_condition_id"
                                            value={form.user_condition_id}
                                            className={`form-select ${errors.user_condition_id ? "is-invalid" : ""}`}
                                            onChange={handleChange}
                                            disabled={isEdit}
                                        >
                                            <option value="">Select Condition</option>
                                            {conditions.map(cond => (
                                                <option key={cond.id} value={cond.id}>{cond.display_name}</option>
                                            ))}
                                        </select>
                                        {errors.user_condition_id && <div className="invalid-feedback">{errors.user_condition_id}</div>}
                                    </div>

                                    {selectedUnit === "kg" && (
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">Estimated Weight (kg)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                name="weight"
                                                value={form.weight}
                                                className={`form-control ${errors.weight ? "is-invalid" : ""}`}
                                                onChange={handleChange}
                                                placeholder="e.g. 5.5"
                                            />
                                            {errors.weight && <div className="invalid-feedback">{errors.weight}</div>}
                                        </div>
                                    )}


                                    {isEdit && (
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">Final Condition (Admin)</label>
                                            <select
                                                name="final_condition_id"
                                                value={form.final_condition_id || ""}
                                                className={`form-select ${errors.final_condition_id ? "is-invalid" : ""}`}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Final Condition</option>
                                                {conditions.map(cond => (
                                                    <option key={cond.id} value={cond.id}>{cond.display_name}</option>
                                                ))}
                                            </select>
                                            {errors.final_condition_id && <div className="invalid-feedback">{errors.final_condition_id}</div>}
                                        </div>
                                    )}

                                    {/* 2. PICKUP & LOGISTICS SECTION */}
                                    <h5 className="mt-4 mb-3 text-primary border-bottom pb-2">2. Pickup & Logistics</h5>

                                    <div className="col-md-4 mb-3">
                                        <label className="form-label fw-bold">Pickup Type</label>
                                        <select
                                            name="pickup_type"
                                            value={form.pickup_type}
                                            className={`form-select ${errors.pickup_type ? "is-invalid" : ""}`}
                                            onChange={handleChange}
                                            disabled={isEdit}
                                        >
                                            <option value="pickup">Pickup</option>
                                            <option value="dropoff">Dropoff</option>
                                        </select>
                                        {errors.pickup_type && <div className="invalid-feedback">{errors.pickup_type}</div>}
                                    </div>

                                    <div className="col-md-8 mb-3">
                                        <label className="form-label fw-bold">Facility</label>
                                        <select
                                            name="facility_id"
                                            value={form.facility_id}
                                            className={`form-select ${errors.facility_id ? "is-invalid" : ""}`}
                                            onChange={handleChange}
                                            disabled={isEdit}
                                        >
                                            <option value="">Select Facility</option>
                                            {facilities.map(f => (
                                                <option key={f.id} value={f.id}>{f.name}</option>
                                            ))}
                                        </select>
                                        {errors.facility_id && <div className="invalid-feedback">{errors.facility_id}</div>}
                                    </div>

                                    <div className="col-md-12 mb-3">
                                        <label className="form-label fw-bold">Address</label>
                                        <textarea
                                            name="address"
                                            value={form.address}
                                            className={`form-control ${errors.address ? "is-invalid" : ""}`}
                                            onChange={handleChange}
                                            rows="2"
                                            placeholder="Full Pickup Address"
                                            disabled={isEdit}
                                        />
                                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className="form-label fw-bold">Pickup Date</label>
                                        <input
                                            type="date"
                                            name="pickup_date"
                                            value={form.pickup_date}
                                            className={`form-control ${errors.pickup_date ? "is-invalid" : ""}`}
                                            onChange={handleChange}
                                            disabled={isEdit}
                                        />
                                        {errors.pickup_date && <div className="invalid-feedback">{errors.pickup_date}</div>}
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className="form-label fw-bold">Pickup Time</label>
                                        <input
                                            type="time"
                                            name="pickup_time"
                                            value={form.pickup_time}
                                            className={`form-control ${errors.pickup_time ? "is-invalid" : ""}`}
                                            onChange={handleChange}
                                            disabled={isEdit}
                                        />
                                        {errors.pickup_time && <div className="invalid-feedback">{errors.pickup_time}</div>}
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className="form-label fw-bold">Phone</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={form.phone}
                                            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                                            onChange={handleChange}
                                            placeholder="10 digit phone number"
                                            disabled={isEdit}
                                        />
                                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                                    </div>

                                    <div className="col-md-8 mb-3">
                                        <label className="form-label fw-bold">Notes</label>
                                        <textarea
                                            name="notes"
                                            value={form.notes}
                                            className={`form-control ${errors.notes ? "is-invalid" : ""}`}
                                            onChange={handleChange}
                                            rows="2"
                                            placeholder="Optional notes"
                                            disabled={isEdit}
                                        />
                                        {errors.notes && <div className="invalid-feedback">{errors.notes}</div>}
                                    </div>

                                    <div className="col-md-12 mb-4">
                                        <label className="form-label fw-bold d-block mb-3">Product Images (Min 3, Max 5)</label>

                                        <div className="image-gallery-grid d-flex flex-wrap gap-3">
                                            {/* Render Selected Images Previews */}
                                            {Array.isArray(form.images) && form.images.map((img, index) => {
                                                let previewUrl = "";
                                                if (img instanceof File) {
                                                    previewUrl = URL.createObjectURL(img);
                                                } else if (img && typeof img === 'object' && img.image) {
                                                    previewUrl = img.image;
                                                } else if (typeof img === 'string') {
                                                    previewUrl = img;
                                                }

                                                return (
                                                    <div key={index} className="image-slot position-relative" style={{ width: "120px", height: "120px" }}>
                                                        <img
                                                            src={previewUrl}
                                                            alt={`preview-${index}`}
                                                            className="rounded-3 shadow-sm w-100 h-100"
                                                            style={{ objectFit: "cover", border: "2px solid #ddd" }}
                                                        />
                                                        {!isEdit && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-sm position-absolute"
                                                                style={{ top: "-10px", right: "-10px", borderRadius: "50%", padding: "2px 6px" }}
                                                                onClick={() => handleRemoveImage(index)}
                                                            >
                                                                <i className="fa fa-times"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}

                                            {/* Add Image Placeholder (+) (Hide in Edit) */}
                                            {!isEdit && (!form.images || form.images.length < 5) && (
                                                <label
                                                    htmlFor="hidden-file-input"
                                                    className="image-slot-plus d-flex flex-column align-items-center justify-content-center rounded-3 border-2 border-dashed border-primary bg-light"
                                                    style={{ width: "120px", height: "120px", cursor: "pointer" }}
                                                >
                                                    <i className="fa fa-plus fa-2x text-primary mb-1"></i>
                                                    <span className="small fw-bold text-primary">Add Image</span>
                                                </label>
                                            )}
                                        </div>

                                        <input
                                            id="hidden-file-input"
                                            type="file"
                                            name="images"
                                            multiple
                                            accept="image/*"
                                            className="d-none"
                                            onChange={(e) => {
                                                if (e.target.files.length > 0) {
                                                    handleChange({
                                                        target: {
                                                            name: "images",
                                                            value: e.target.files
                                                        }
                                                    });
                                                }
                                                e.target.value = "";
                                            }}
                                        />

                                        {(errors.images || errors.error) && (
                                            <div className="text-danger small mt-2 d-block fw-bold">
                                                <i className="fa fa-exclamation-circle me-1"></i>
                                                {errors.error || (Array.isArray(errors.images) ? errors.images[0] : errors.images)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className="form-label fw-bold">Status</label>
                                        <select
                                            name="status"
                                            value={form.status}
                                            className={`form-select ${errors.status ? "is-invalid" : ""}`}
                                            onChange={handleChange}
                                        >
                                            <option value="requested">Requested</option>
                                            <option value="picked_up_dropped_off">Picked Up/Dropped Off</option>
                                            <option value="evaluating">Evaluating</option>
                                            <option value="recycled">Recycled</option>
                                            <option value="rewarded">Rewarded</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                        {errors.status && <div className="invalid-feedback">{errors.status}</div>}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="add-btn w-100 py-2 mt-3 shadow-sm rounded-3"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <i className="fa fa-spinner fa-spin me-2"></i>
                                            Submitting...
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