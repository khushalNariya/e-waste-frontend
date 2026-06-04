import React from 'react';

const fieldError = (errors, name) => {
    const value = errors?.[name];
    if (Array.isArray(value)) return value[0];
    return value || '';
};

const EWasteSubmissionForm = ({
    formData,
    handleChange,
    handleRemoveImage,
    handleSubmit,
    categories,
    brands,
    models,
    conditions,
    facilities,
    errors,
    errorMsg,
    isSubmitting,
    selectedUnit
}) => {
    return (
        <form onSubmit={handleSubmit}>
            {errorMsg && (
                <div className="ew-alert ew-alert-danger">
                    <i className="fa-solid fa-triangle-exclamation me-2"></i>
                    {errorMsg}
                </div>
            )}

            {errors?.non_field_errors && (
                <div className="ew-alert ew-alert-danger">
                    {fieldError(errors, 'non_field_errors')}
                </div>
            )}

            <div className="ew-form-section">
                <h3 className="ew-section-title">
                    <i className="fa-solid fa-laptop-code"></i>
                    1. Product Details
                </h3>
                <div className="ew-grid">
                    <div className="ew-input-group">
                        <label className="ew-label">Category</label>
                        <select
                            name="category_id"
                            className={`ew-select ${fieldError(errors, 'category_id') ? 'is-invalid' : ''}`}
                            value={formData.category_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.title}
                                </option>
                            ))}
                        </select>
                        {fieldError(errors, 'category_id') && <div className="ew-error">{fieldError(errors, 'category_id')}</div>}
                    </div>

                    <div className="ew-input-group">
                        <label className="ew-label">Brand</label>
                        <select
                            name="category_brand_mapping_id"
                            className={`ew-select ${fieldError(errors, 'category_brand_mapping_id') ? 'is-invalid' : ''}`}
                            value={formData.category_brand_mapping_id}
                            onChange={handleChange}
                            disabled={!formData.category_id}
                            required
                        >
                            <option value="">Select Brand</option>
                            {brands.map((mapping) => (
                                <option key={mapping.id} value={mapping.id}>
                                    {mapping.brand?.name || mapping.name}
                                </option>
                            ))}
                        </select>
                        {fieldError(errors, 'category_brand_mapping_id') && (
                            <div className="ew-error">{fieldError(errors, 'category_brand_mapping_id')}</div>
                        )}
                    </div>

                    <div className="ew-input-group">
                        <label className="ew-label">Model Name / Number</label>
                        <select
                            name="model_id"
                            className={`ew-select ${fieldError(errors, 'model_id') ? 'is-invalid' : ''}`}
                            value={formData.model_id}
                            onChange={handleChange}
                            disabled={!formData.category_brand_mapping_id}
                            required
                        >
                            <option value="">Select Model</option>
                            {models.map((model) => (
                                <option key={model.id} value={model.id}>
                                    {model.model_name}
                                </option>
                            ))}
                        </select>
                        {fieldError(errors, 'model_id') && <div className="ew-error">{fieldError(errors, 'model_id')}</div>}
                    </div>
                </div>

                <div className="ew-input-group mt-4">
                    <label className="ew-label">Condition</label>
                    <div className="ew-condition-grid">
                        {conditions.map((condition) => (
                            <label key={condition.id} className="ew-radio-card">
                                <input
                                    type="radio"
                                    name="user_condition_id"
                                    value={condition.id}
                                    checked={String(formData.user_condition_id) === String(condition.id)}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="ew-radio-content">
                                    <i className="fa-solid fa-circle-check"></i>
                                    <span className="ew-radio-label">{condition.display_name}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                    {fieldError(errors, 'user_condition_id') && <div className="ew-error">{fieldError(errors, 'user_condition_id')}</div>}
                </div>

                {selectedUnit === 'kg' && (
                    <div className="ew-input-group mt-4">
                        <label className="ew-label">Estimated Weight (kg)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="weight"
                            className={`ew-input ${fieldError(errors, 'weight') ? 'is-invalid' : ''}`}
                            placeholder="e.g., 5.5"
                            value={formData.weight}
                            onChange={handleChange}
                        />
                        {fieldError(errors, 'weight') && <div className="ew-error">{fieldError(errors, 'weight')}</div>}
                    </div>
                )}

                <div className="ew-input-group mt-4">
                    <label className="ew-label">Product Images (Min 3, Max 5)</label>
                    <div className="ew-image-preview-grid">
                        {formData.images.map((image, index) => (
                            <div className="ew-image-preview" key={`${image.name}-${index}`}>
                                <img src={URL.createObjectURL(image)} alt={`Selected product ${index + 1}`} />
                                <button type="button" onClick={() => handleRemoveImage(index)} aria-label="Remove image">
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                    {formData.images.length < 5 && (
                        <div className="ew-upload-area">
                            <input
                                type="file"
                                id="imageUpload"
                                name="images"
                                className="d-none"
                                multiple
                                accept="image/*"
                                onChange={handleChange}
                            />
                            <label htmlFor="imageUpload" style={{ cursor: 'pointer', width: '100%' }}>
                                <i className="fa-solid fa-camera-retro ew-upload-icon"></i>
                                <div className="ew-upload-text">
                                    <h4>Click to Upload Product Images</h4>
                                    <p>Clear photos help us evaluate the value better.</p>
                                </div>
                            </label>
                        </div>
                    )}
                    {(fieldError(errors, 'images') || fieldError(errors, 'error')) && (
                        <div className="ew-error">{fieldError(errors, 'error') || fieldError(errors, 'images')}</div>
                    )}
                </div>
            </div>

            <div className="ew-form-section">
                <h3 className="ew-section-title">
                    <i className="fa-solid fa-truck-fast"></i>
                    2. Pickup & Logistics
                </h3>
                <div className="ew-grid">
                    <div className="ew-input-group">
                        <label className="ew-label">Pickup Type</label>
                        <div className="ew-pickup-tabs">
                            <label className={`ew-tab ${formData.pickup_type === 'pickup' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="pickup_type"
                                    value="pickup"
                                    checked={formData.pickup_type === 'pickup'}
                                    onChange={handleChange}
                                />
                                <i className="fa-solid fa-house-chimney"></i> Doorstep Pickup
                            </label>
                            <label className={`ew-tab ${formData.pickup_type === 'dropoff' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="pickup_type"
                                    value="dropoff"
                                    checked={formData.pickup_type === 'dropoff'}
                                    onChange={handleChange}
                                />
                                <i className="fa-solid fa-store"></i> Self Drop-off
                            </label>
                        </div>
                        {fieldError(errors, 'pickup_type') && <div className="ew-error">{fieldError(errors, 'pickup_type')}</div>}
                    </div>

                    <div className="ew-input-group">
                        <label className="ew-label">Select Facility</label>
                        <select
                            name="facility_id"
                            className={`ew-select ${fieldError(errors, 'facility_id') ? 'is-invalid' : ''}`}
                            value={formData.facility_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Choose Nearest Center</option>
                            {facilities.map((facility) => (
                                <option key={facility.id} value={facility.id}>
                                    {facility.name}
                                </option>
                            ))}
                        </select>
                        {fieldError(errors, 'facility_id') && <div className="ew-error">{fieldError(errors, 'facility_id')}</div>}
                    </div>

                    <div className="ew-input-group ew-full">
                        <label className="ew-label">Pickup Address</label>
                        <textarea
                            name="address"
                            className={`ew-textarea ${fieldError(errors, 'address') ? 'is-invalid' : ''}`}
                            rows="3"
                            placeholder="Enter your full detailed address..."
                            value={formData.address}
                            onChange={handleChange}
                            required
                        ></textarea>
                        {fieldError(errors, 'address') && <div className="ew-error">{fieldError(errors, 'address')}</div>}
                    </div>

                    <div className="ew-input-group">
                        <label className="ew-label">Pickup Date</label>
                        <input
                            type="date"
                            name="pickup_date"
                            className={`ew-input ${fieldError(errors, 'pickup_date') ? 'is-invalid' : ''}`}
                            value={formData.pickup_date}
                            onChange={handleChange}
                            required
                        />
                        {fieldError(errors, 'pickup_date') && <div className="ew-error">{fieldError(errors, 'pickup_date')}</div>}
                    </div>

                    <div className="ew-input-group">
                        <label className="ew-label">Pickup Time</label>
                        <input
                            type="time"
                            name="pickup_time"
                            className={`ew-input ${fieldError(errors, 'pickup_time') ? 'is-invalid' : ''}`}
                            value={formData.pickup_time}
                            onChange={handleChange}
                            required
                        />
                        {fieldError(errors, 'pickup_time') && <div className="ew-error">{fieldError(errors, 'pickup_time')}</div>}
                    </div>

                    <div className="ew-input-group">
                        <label className="ew-label">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            className={`ew-input ${fieldError(errors, 'phone') ? 'is-invalid' : ''}`}
                            placeholder="10 digit phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                        {fieldError(errors, 'phone') && <div className="ew-error">{fieldError(errors, 'phone')}</div>}
                    </div>
                </div>
            </div>

            <div className="ew-form-section">
                <h3 className="ew-section-title">
                    <i className="fa-solid fa-comment-dots"></i>
                    3. Additional Information
                </h3>
                <div className="ew-input-group ew-full">
                    <label className="ew-label">Notes / Description</label>
                    <textarea
                        name="notes"
                        className={`ew-textarea ${fieldError(errors, 'notes') ? 'is-invalid' : ''}`}
                        rows="4"
                        placeholder="Mention any extra details, accessories, or pickup instructions..."
                        value={formData.notes}
                        onChange={handleChange}
                        required
                    ></textarea>
                    {fieldError(errors, 'notes') && <div className="ew-error">{fieldError(errors, 'notes')}</div>}
                </div>
            </div>

            <div className="ew-form-footer">
                <button type="submit" className="ew-btn ew-btn-primary w-100" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <i className="fa-solid fa-spinner fa-spin me-2"></i>
                            Submitting...
                        </>
                    ) : (
                        <>
                            <i className="fa-solid fa-circle-check me-2"></i>
                            Submit Recycling Request
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default EWasteSubmissionForm;
