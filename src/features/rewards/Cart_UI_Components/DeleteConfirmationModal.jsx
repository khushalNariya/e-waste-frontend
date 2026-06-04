import React from 'react';
import '../Styles/ModernModal.css';

const DeleteConfirmationModal = ({ show, onConfirm, onCancel, itemName }) => {
    if (!show) return null;

    return (
        <div className="modern-modal-overlay">
            <div className="modern-modal-card animate-zoom">
                <div className="modal-icon-wrapper bg-danger bg-opacity-10">
                    <i className="fa-solid fa-trash-can text-danger"></i>
                </div>
                <h4 className="fw-black text-dark mb-2">Remove Reward?</h4>
                <p className="text-muted small mb-4 px-3">
                    Are you sure you want to remove <span className="fw-bold text-dark">"{itemName}"</span> from your reward collection?
                </p>
                <div className="d-flex gap-2 w-100">
                    <button onClick={onCancel} className="btn btn-light flex-grow-1 fw-bold py-2 rounded-3 border-0">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="btn btn-danger flex-grow-1 fw-bold py-2 rounded-3 shadow-sm">
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
