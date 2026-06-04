import React from "react";
import Page_Header_Edit_or_Add from "../../shared/common/Page_Header_Edit__or__Add";

export default function Reward_Product_Form({
    headingText,
    headingIcon,
    breadcrumbText,

    isEdit,

    form,
    errors,
    categories, // List of categories for dropdown
    handleChange,
    handleSubmit,
    submitButtonText,
    submitButtonIcon,
}) {
    return (
        <div className="admin-content mt-4">

            {/* ===== HEADER ===== */}
            <Page_Header_Edit_or_Add
                headingText={headingText}
                headingIcon={headingIcon}
                breadcrumbText={breadcrumbText}
                breadIcon="fa-gift"
                listLink="/admin/Reward-Product"
                listName="Reward Product List"
            />

            {/* ===== FORM CARD ===== */}
            <div className="row justify-content-center">
                <div className="col-lg-8">

                    <div className="card shadow-sm border-0">
                        <div className="card-body">

                            <form onSubmit={handleSubmit}>

                                {/* Other Error */}
                                {errors.non_field_errors && (
                                    <div className="alert alert-danger">
                                        {errors.non_field_errors[0]}
                                    </div>
                                )}

                                {isEdit && (
                                    <div className="mb-3">
                                        <label className="form-label">ID</label>
                                        <input
                                            type="text"
                                            value={form.id}
                                            className="form-control"
                                            readOnly
                                        />
                                    </div>
                                )}

                                <div className="row">
                                    {/* Product Name */}
                                    <div className="col-md-8 mb-3">
                                        <label className="form-label">Product Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                            onChange={handleChange}
                                        />
                                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                    </div>

                                    {/* Category */}
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label">Category</label>
                                        <select
                                            name="category_id"
                                            value={form.category_id}
                                            className="form-select"
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category_id && <div className="invalid-feedback">{errors.category_id}</div>}
                                    </div>
                                </div>

                                <div className="row">
                                    {/* Points */}
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label">Reward Points</label>
                                        <input
                                            type="number"
                                            name="points"
                                            value={form.points}
                                            className={`form-control ${errors.points ? "is-invalid" : ""}`}
                                            onChange={handleChange}
                                        />
                                        {errors.points && <div className="invalid-feedback">{errors.points}</div>}
                                    </div>

                                    {/* Stock */}
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label">Stock</label>
                                        <input
                                            type="number"
                                            name="stock"
                                            value={form.stock}
                                            className={`form-control ${errors.stock ? "is-invalid" : ""}`}
                                            onChange={handleChange}
                                        />
                                        {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
                                    </div>

                                    {/* Tag */}
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label">Tag (e.g. New, Popular)</label>
                                        <input
                                            type="text"
                                            name="tag"
                                            value={form.tag}
                                            className="form-control"
                                            onChange={handleChange}
                                        />
                                    </div>

                                   
                                </div>

                                <div className="row">
                                     {/* Delivery Days */}
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label">Delivery Days</label>
                                        <input
                                            type="text"
                                            name="delivery_days"
                                            value={form.delivery_days}
                                            className="form-control"
                                            onChange={handleChange}
                                            placeholder="e.g. 3-5 days"
                                        />
                                    </div>
                                    {/* Rating */}
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label">Rating</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="rating"
                                            value={form.rating}
                                            className="form-control"
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Total Redeemed */}
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label">Total Redeemed</label>
                                        <input
                                            type="number"
                                            name="total_redeemed"
                                            value={form.total_redeemed}
                                            className="form-control"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        className={`form-control ${errors.description ? "is-invalid" : ""}`}
                                        onChange={handleChange}
                                        rows="3"
                                    ></textarea>
                                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                </div>

                                {/* Terms and Conditions */}
                                <div className="mb-3">
                                    <label className="form-label">Terms and Conditions</label>
                                    <textarea
                                        name="terms"
                                        value={form.terms}
                                        className="form-control"
                                        onChange={handleChange}
                                        rows="2"
                                    ></textarea>
                                </div>

                                <div className="row align-items-center mb-4">
                                    {/* Status */}
                                    <div className="col-md-4">
                                        <label className="form-label d-block">Status</label>
                                        <div className="form-check form-switch custom-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="is_active"
                                                checked={form.is_active}
                                                onChange={(e) => handleChange({
                                                    target: {
                                                        name: 'is_active',
                                                        value: e.target.checked
                                                    }
                                                })}
                                                id="activeSwitch"
                                            />
                                            <label className="form-check-label" htmlFor="activeSwitch">
                                                {form.is_active ? "Active" : "Inactive"}
                                            </label>
                                        </div>
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