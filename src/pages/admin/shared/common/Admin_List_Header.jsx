import React from "react";
import { useNavigate } from "react-router-dom";
import "./Admin_Header.css";
import "./Admin_Notifications.css";

export default function Admin_List_Header({
    title,
    addButtonText,
    addButtonLink,
    searchText,
    setSearchText,
    currentLimit,
    setCurrentLimit,
    setCurrentPage,
    successMsg,
    errorMsg,
    fadeOut,
    successRef,
    children
}) {
    const navigate = useNavigate();

    return (
        <>
            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold m-0" style={{ color: "#1e293b" }}>{title}</h4>

                {addButtonText && (
                    <button
                        className="btn btn-success btn-sm px-3 py-2 shadow-sm"
                        style={{ borderRadius: "10px", fontWeight: "600" }}
                        onClick={() => navigate(addButtonLink)}
                    >
                        <i className="fa fa-plus me-1"></i> {addButtonText}
                    </button>
                )}
            </div>

            {/* MODERN FLOATING TOAST MESSAGE */}
            {(successMsg || errorMsg) && (
                <div
                    ref={successRef}
                    className={`modern-toast ${errorMsg ? 'error' : 'success'} ${fadeOut ? "fade-out" : ""}`}
                >
                    <div className="toast-icon">
                        <i className={`fa ${errorMsg ? 'fa-times-circle' : 'fa-check-circle'}`}></i>
                    </div>
                    <div className="toast-content">
                        {successMsg || errorMsg}
                    </div>
                </div>
            )}

            {/* CONTROLS ROW */}
            <div className="admin-header-row">

                {/* LEFT: Entries */}
                <div className="d-flex align-items-center">
                    <label className="entries-label text-muted">Show</label>
                    <select
                        id="entries-dropdown"
                        className="form-select form-select-sm entries-select"
                        value={currentLimit}
                        onChange={(e) => {
                            setCurrentLimit(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>

                    {/* NEW: Additional Filters or Tools passed as children */}
                    {children}

                </div>

                {/* RIGHT: Search */}
                <div className="d-flex align-items-center">
                    <label className="search-label text-muted">Search</label>
                    <div className="search-wrapper">
                        <input
                            type="text"
                            id="live-search"
                            className="search-input"
                            autoComplete="off"
                            placeholder="Find entry..."
                            value={searchText}
                            onChange={(e) => {
                                setSearchText(e.target.value);
                                setCurrentPage(1);
                            }}
                        />

                        {searchText && (
                            <span
                                className="clear-search-icon"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    setSearchText("");
                                    setCurrentPage(1);
                                }}
                            >
                                <i className="fa fa-times-circle"></i>
                            </span>
                        )}
                    </div>
                </div>

            </div>
        </>
    );
}