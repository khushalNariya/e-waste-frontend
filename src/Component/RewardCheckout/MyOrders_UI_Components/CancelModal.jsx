import React from 'react';

const CancelModal = ({ cancelModal, closeCancelModal, cancelReason, setCancelReason, cancelReasons, confirmCancel }) => {
    return (
        <div className="cancel-modal-overlay" onClick={closeCancelModal}>
            <div className="cancel-modal-box" onClick={e => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="cancel-modal-header">
                    <div className="cancel-modal-icon">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <div>
                        <h5 className="fw-bold mb-1 text-dark">Cancel Order?</h5>
                        <p className="text-muted small mb-0">This action cannot be undone.</p>
                    </div>
                    <button className="btn-close ms-auto" onClick={closeCancelModal}></button>
                </div>

                {/* Order info */}
                <div className="cancel-modal-body">
                    <div className="cancel-order-preview">
                        <i className="fa-solid fa-box text-muted me-2"></i>
                        <span className="small text-dark fw-semibold">{cancelModal.orderName}</span>
                    </div>

                    <div className="cancel-info-banner">
                        <i className="fa-solid fa-coins text-success me-2"></i>
                        <span>Your redeemed points will be <strong>refunded within 24 hours</strong> of cancellation.</span>
                    </div>

                    {/* Reason Selection */}
                    <div className="mt-3">
                        <label className="form-label checkout-label">Select Cancellation Reason *</label>
                        <div className="cancel-reasons">
                            {cancelReasons.map(reason => (
                                <label key={reason} className={`cancel-reason-option ${cancelReason === reason ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="cancelReason"
                                        value={reason}
                                        checked={cancelReason === reason}
                                        onChange={() => setCancelReason(reason)}
                                        hidden
                                    />
                                    <i className={`fa-solid ${cancelReason === reason ? 'fa-circle-check text-danger' : 'fa-circle text-muted'} me-2`}></i>
                                    {reason}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="cancel-modal-footer">
                    <button className="btn checkout-btn-secondary px-4 py-2 fw-semibold" onClick={closeCancelModal}>
                        Keep Order
                    </button>
                    <button
                        className="btn cancel-confirm-btn px-4 py-2 fw-bold"
                        onClick={confirmCancel}
                        disabled={!cancelReason}
                    >
                        <i className="fa-solid fa-ban me-2"></i>
                        Confirm Cancellation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelModal;
