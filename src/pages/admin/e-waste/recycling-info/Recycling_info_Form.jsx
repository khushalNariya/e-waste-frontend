import React from "react";
import { Link } from "react-router-dom";
import Page_Header_Edit_or_Add from "../../shared/common/Page_Header_Edit__or__Add";

export default function Brand_Form({
    headingText,
    headingIcon,
    breadcrumbText,

    form,
    errors,
    handleChange,
    handleSubmit,

    steps,
    handleStepChange,
    addStep,

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

                breadIcon="fa-recycle"
                listLink="/admin/Recycling-info"
                listName="Recycling Info List"
            />

            {/* ===== FORM CARD ===== */}
            <div className="row justify-content-center">
                <div className="col-lg-8">

                    <div className="card shadow-sm border-0">
                        <div className="card-body">

                            <form onSubmit={handleSubmit}>

                                {/* Category / Title */}
                                <div className="mb-3">
                                    <label className="form-label">Category / Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={form.title}
                                        className={`form-control ${errors.title ? "is-invalid" : ""}`}
                                        onChange={handleChange}
                                    />
                                    {errors.title && (
                                        <div className="invalid-feedback">
                                            {errors.title}
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        className={`form-control ${errors.description ? "is-invalid" : ""}`}
                                        onChange={handleChange}
                                    />
                                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                </div>

                                {/* Process */}
                                <div className="mb-3">
                                    <label className="form-label">Process</label>
                                    {/* <textarea
                                        name="process"
                                        value={form.process}
                                        className={`form-control ${errors.process ? "is-invalid" : ""}`}
                                        onChange={handleChange}
                                    />
                                    {errors.process && <div className="invalid-feedback">{errors.process}</div>} */}


                                    {steps.map((step, index) => (
                                        <div key={index} className="d-flex mb-2 align-items-center">

                                            <input
                                                type="text"
                                                value={step}
                                                onChange={(e) => handleStepChange(index, e.target.value)}
                                                className={`form-control ${errors.process ? "is-invalid" : ""}`}
                                                placeholder={`Step ${index + 1}`}
                                            />

                                            {index !== steps.length - 1 && (
                                                <span className="mx-2">→</span>
                                            )}
                                        </div>
                                    ))}

                                    {errors.process && <div className="invalid-feedback d-block">{errors.process}</div>}

                                    <button
                                        type="button"
                                        onClick={addStep}
                                        className="btn btn-sm btn-primary"
                                    >
                                        + Add Step
                                    </button>


                                </div>

                                {/* Instruction */}
                                <div className="mb-3">
                                    <label className="form-label">Instruction</label>
                                    <textarea
                                        name="instruction"
                                        value={form.instruction}
                                        className={`form-control ${errors.instruction ? "is-invalid" : ""}`}
                                        onChange={handleChange}
                                    />
                                    {errors.instruction && <div className="invalid-feedback">{errors.instruction}</div>}
                                </div>

                                {/* Benefits */}
                                <div className="mb-3">
                                    <label className="form-label">Benefits</label>
                                    <textarea
                                        name="benefits"
                                        value={form.benefits}
                                        className={`form-control ${errors.benefits ? "is-invalid" : ""}`}
                                        onChange={handleChange}
                                    />
                                    {errors.benefits && <div className="invalid-feedback">{errors.benefits}</div>}
                                </div>

                                {/* Button Text */}
                                <div className="mb-3">
                                    <label className="form-label">Button Text</label>
                                    <input
                                        type="text"
                                        name="button_text"
                                        value={form.button_text}
                                        className={`form-control ${errors.button_text ? "is-invalid" : ""}`}
                                        onChange={handleChange}
                                    />
                                    {errors.button_text && <div className="invalid-feedback">{errors.button_text}</div>}
                                </div>

                                {/* Icon */}
                                <div className="mb-3">
                                    <label className="form-label">Icon</label>
                                    <input
                                        type="text"
                                        name="icon"
                                        value={form.icon}
                                        className={`form-control ${errors.icon ? "is-invalid" : ""}`}
                                        onChange={handleChange}
                                    />
                                    {errors.icon && <div className="invalid-feedback">{errors.icon}</div>}
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