import React from "react";
import Page_Header_Edit_or_Add from "../Common Files/Page_Header_Edit__or__Add";

export default function Reward_Product_Image_Form({
    headingText,
    headingIcon,
    breadcrumbText,
    isEdit,
    form,
    errors,

    products,
    handleChange,
    handleFileChange,
    handleSubmit,
    submitButtonText,
    submitButtonIcon,
    preview,
}) {
    return (
        <div className="admin-content mt-4">
            <Page_Header_Edit_or_Add
                headingText={headingText}
                headingIcon={headingIcon}
                breadcrumbText={breadcrumbText}
                breadIcon="fa-images"
                listLink="/admin/Reward-Product-Image"
                listName="Image List"
            />

            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                {errors.non_field_errors && (
                                    <div className="alert alert-danger">
                                        {errors.non_field_errors[0]}
                                    </div>
                                )}

                                {isEdit && (
                                    <div className="mb-3">
                                        <label className="form-label text-muted small">IMAGE ID</label>
                                        <input
                                            type="text"
                                            value={form.id}
                                            className="form-control bg-light"
                                            readOnly
                                        />
                                    </div>
                                )}

                                <div className="row">
                                    {/* Product Selection */}
                                    <div className="col-md-8 mb-3">
                                        <label className="form-label">Reward Product {isEdit && <small className="text-muted">(Product cannot be changed during edit)</small>}</label>
                                        <select
                                            name="product_id"
                                            className={`form-select ${errors.product_id ? "is-invalid" : ""} ${isEdit ? "bg-light" : ""}`}
                                            value={form.product_id}
                                            onChange={handleChange}
                                            // Feature(Enable - Disable ) Product Selection During (Edit)
                                            disabled={isEdit}
                                        >
                                            <option value="">Select Product</option>
                                            {products.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} (ID: {p.id})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.product_id && <div className="invalid-feedback">{errors.product_id}</div>}
                                    </div>

                                    {/* Display Order */}
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label">Display Order</label>
                                        <input
                                            type="number"
                                            name="display_order"
                                            className={`form-control ${errors.display_order ? "is-invalid" : ""}`}
                                            value={form.display_order}
                                            onChange={handleChange}
                                        />
                                        {errors.display_order && <div className="invalid-feedback">{errors.display_order}</div>}
                                    </div>
                                </div>

                                <div className="row align-items-end">
                                    {/* Image Upload */}
                                    <div className="col-md-12 mb-3">
                                        <label className="form-label">Product Image</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-end-0">
                                                <i className="fa fa-image text-muted"></i>
                                            </span>
                                            <input
                                                type="file"
                                                name="image"
                                                className={`form-control border-start-0 ${errors.image ? "is-invalid" : ""}`}
                                                onChange={handleFileChange}
                                                accept="image/*"
                                            />
                                            {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                                        </div>

                                        {/* Image Preview Logic */}
                                        {preview ? (
                                            <div className="mt-3 text-center p-3 border rounded-4 bg-light shadow-sm position-relative overflow-hidden" style={{ maxWidth: '200px' }}>
                                                <div className="badge bg-primary position-absolute top-0 start-0 m-2" style={{ zIndex: 2 }}>New Preview</div>
                                                <img src={preview} alt="New Preview" className="img-fluid rounded-3" style={{ maxHeight: '150px', objectFit: 'contain' }} />
                                            </div>
                                        ) : (
                                            isEdit && form.image && typeof form.image === 'string' && (
                                                <div className="mt-3 text-center p-3 border rounded-4 bg-light shadow-sm position-relative overflow-hidden" style={{ maxWidth: '200px' }}>
                                                    <div className="badge bg-secondary position-absolute top-0 start-0 m-2" style={{ zIndex: 2 }}>Current Image</div>
                                                    <img src={form.image} alt="Current" className="img-fluid rounded-3" style={{ maxHeight: '150px', objectFit: 'contain' }} />
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="row mt-3">
                                    {/* Is Primary */}
                                    <div className="col-md-6 mb-3">
                                        <div className="form-check form-switch p-2 border rounded bg-light-subtle">
                                            <label className="form-check-label ms-2" htmlFor="primarySwitch">
                                                <strong>Is Primary Image?</strong>
                                                <br />
                                                <small className="text-muted">Primary image will be shown as main thumbnail</small>
                                            </label>
                                            <input
                                                className="form-check-input float-end me-2"
                                                type="checkbox"
                                                id="primarySwitch"
                                                checked={form.is_primary}
                                                onChange={(e) => handleChange({
                                                    target: { name: 'is_primary', value: e.target.checked }
                                                })}
                                            />
                                        </div>
                                    </div>

                                    {/* Is Active */}
                                    <div className="col-md-6 mb-3">
                                        <div className="form-check form-switch p-2 border rounded bg-light-subtle text-end">
                                            <input
                                                className="form-check-input float-start ms-2"
                                                type="checkbox"
                                                id="activeSwitch"
                                                checked={form.is_active}
                                                onChange={(e) => handleChange({
                                                    target: { name: 'is_active', value: e.target.checked }
                                                })}
                                            />
                                            <label className="form-check-label me-2" htmlFor="activeSwitch">
                                                <strong>Status: {form.is_active ? "Active" : "Inactive"}</strong>
                                                <br />
                                                <small className="text-muted">Visibility of this image</small>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="add-btn w-100 py-3 mt-4">
                                    <i className={`fa ${submitButtonIcon} me-2`}></i>
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
