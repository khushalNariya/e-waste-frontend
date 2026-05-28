import React, { useEffect, useState } from "react";
import { Reward_Replace_Request_API } from "./api";
import { Fetch_Reward_Replace_Request_Table } from "./Table";
import { calculatePagination } from "../Pagination/Pagination";
import Admin_List_Header from "../Common Files/Admin_List_Header";
import Admin_Pagination_Buttons from "../Common Files/Admin_Pagination_Buttons";
import Admin_Table from "../Common Files/Admin_Table";
import "../Common Files/Admin_Notifications.css";
import { useAdminNotifications } from "../Common Files/useAdminNotifications";

// Import Filter Components
import User_Filter from "../Filter_Component/User_Filter/User_Filter";
import { fetch_Users } from "../E-waste users/api";

export default function Reward_Replace_Requests_Admin() {
    const [rows, setRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(5);
    const [searchText, setSearchText] = useState("");

    // Filters
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");

    // Modal State
    const [detailModal, setDetailModal] = useState({ show: false, data: null });
    const [confirmModal, setConfirmModal] = useState({ show: false, id: null, status: null });

    const [paginationStats, setPaginationStats] = useState({
        totalRecords: 0,
        startEntry: 0,
        endEntry: 0,
        totalPages: 1,
    });

    const {
        successMsg,
        errorMsg,
        fadeOut,
        successRef,
        showSuccess,
        showError
    } = useAdminNotifications();

    const [deletingId, setDeletingId] = useState(null);

    // Load Data
    const loadTable = async (page = 1, limit = 5, searchTerm = "", filters = {}) => {
        try {
            const res = await Reward_Replace_Request_API.fetchAll(page, limit, searchTerm, filters);
            const data_2 = res.data.results || [];
            setRows(data_2);

            const stats = calculatePagination(res.data, page, limit, data_2.length);
            setPaginationStats(stats);
        } catch (err) {
            console.error("API ERROR", err);
        }
    };

    // Load Users for filter
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const res = await fetch_Users(1, 100, "");
                setUsers(res.data.results || []);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };
        loadUsers();
    }, []);

    useEffect(() => {
        loadTable(currentPage, currentLimit, searchText, {
            user: selectedUser,
            status: selectedStatus
        });
    }, [currentPage, currentLimit, searchText, selectedUser, selectedStatus]);

    const deleteRequest = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Replace Request?");
        if (!confirmDelete) return;

        try {
            await Reward_Replace_Request_API.Delete(id);
            setDeletingId(id);
            setTimeout(() => {
                setRows(prevRows => prevRows.filter(row => row.id !== id));
                setDeletingId(null);
            }, 500);
            showSuccess("Replace request deleted successfully.");
        } catch (error) {
            console.error("Delete Error:", error);
            showError("Failed to delete replace request.");
        }
    };

    useEffect(() => {
        const msg = sessionStorage.getItem("success_message");
        if (msg) {
            showSuccess(msg);
            sessionStorage.removeItem("success_message");
        }
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const res = await Reward_Replace_Request_API.patch(id, { replace_status: newStatus });
            setRows(prev => prev.map(row => row.id === id ? { ...row, ...res.data } : row));
            showSuccess(`Replace status updated to ${newStatus.replace(/_/g, ' ').toUpperCase()} successfully.`);
        } catch (err) {
            console.error("Error updating replace status:", err);
            let errorMessage = "Failed to update replace status.";
            if (err.response && err.response.data) {
                const data = err.response.data;
                errorMessage = typeof data === "string"
                    ? data
                    : (data.replace_status || data.detail || data.message || data.error || Object.values(data).flat().join(" "));
            }
            showError(errorMessage);
        }
    };

    const handleStatusUpdateWithConfirm = (id, newStatus) => {
        if (newStatus === "rejected") {
            setConfirmModal({ show: true, id, status: newStatus });
        } else {
            handleStatusUpdate(id, newStatus);
        }
    };

    const confirmReject = () => {
        handleStatusUpdate(confirmModal.id, confirmModal.status);
        setConfirmModal({ show: false, id: null, status: null });
    };

    const viewDetails = (request) => {
        setDetailModal({ show: true, data: request });
    };

    return (
        <div className="admin-content p-3">
            <Admin_List_Header
                title="Reward Replace Requests"
                searchText={searchText}
                setSearchText={setSearchText}
                currentLimit={currentLimit}
                setCurrentLimit={setCurrentLimit}
                setCurrentPage={setCurrentPage}
                successMsg={successMsg}
                errorMsg={errorMsg}
                fadeOut={fadeOut}
                successRef={successRef}
            >
                {/* USER FILTER */}
                <User_Filter
                    users={users}
                    selectedUser={selectedUser}
                    onSelect={(val) => {
                        setSelectedUser(val);
                        setCurrentPage(1);
                    }}
                />

                {/* STATUS FILTER */}
                <select
                    className="form-select ms-2"
                    style={{ width: "auto", display: "inline-block" }}
                    value={selectedStatus}
                    onChange={(e) => {
                        setSelectedStatus(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="">All Replace Status</option>
                    <option value="requested">Requested</option>
                    <option value="approved">Approved</option>
                    <option value="replacement_dispatched">Replacement Dispatched</option>
                    <option value="replacement_delivered">Replacement Delivered</option>
                    <option value="rejected">Rejected</option>
                </select>
            </Admin_List_Header>

            <div className="table-responsive">
                <form id="load-data" onSubmit={(e) => e.preventDefault()}>
                    <Admin_Table
                        columns={["ID", "Replace Number", "Order", "User", "Replace Type", "Status", "Created At", "Action"]}
                    >
                        {Fetch_Reward_Replace_Request_Table(rows, deleteRequest, deletingId, handleStatusUpdateWithConfirm, viewDetails)}
                    </Admin_Table>

                    <Admin_Pagination_Buttons
                        paginationStats={paginationStats}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </form>
            </div>

            {/* REJECT CONFIRMATION MODAL */}
            {confirmModal.show && (
                <div className="modern-modal-overlay">
                    <div className="modern-modal">
                        <div className="modal-icon-wrapper">
                            <i className="fa fa-exclamation-triangle"></i>
                        </div>
                        <h3>Are you sure?</h3>
                        <p>Do you really want to <b>Reject</b> this replace request? This action will be logged in the status history.</p>
                        <div className="modal-actions">
                            <button className="modal-btn cancel" onClick={() => setConfirmModal({ show: false, id: null, status: null })}>
                                No, Cancel
                            </button>
                            <button className="modal-btn confirm" onClick={confirmReject}>
                                Yes, Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DETAIL POPUP MODAL */}
            {detailModal.show && detailModal.data && (
                <div className="modern-modal-overlay" style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1100, overflowY: "auto", padding: "20px" }}>
                    <div className="modern-modal" style={{ background: "white", padding: "25px", borderRadius: "15px", width: "100%", maxWidth: "800px", position: "relative", margin: "auto", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="m-0" style={{ color: "#333", fontWeight: "700" }}>Replace Request Details</h3>
                            <button
                                className="btn btn-close btn-sm"
                                onClick={() => setDetailModal({ show: false, data: null })}
                                style={{ border: "none", fontSize: "20px", cursor: "pointer", background: "none" }}
                            >
                                &times;
                            </button>
                        </div>

                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="text-muted small d-block">REPLACE ID / NUMBER</label>
                                <span className="fw-bold fs-5 text-warning">{detailModal.data.replace_number} (ID: {detailModal.data.id})</span>
                            </div>
                            <div className="col-md-6">
                                <label className="text-muted small d-block">ORIGINAL ORDER</label>
                                <span className="fw-bold fs-5">#{detailModal.data.order_number}</span>
                            </div>

                            <div className="col-md-6">
                                <label className="text-muted small d-block">USER</label>
                                <span className="fw-bold">{detailModal.data.user_name}</span>
                            </div>
                            <div className="col-md-6">
                                <label className="text-muted small d-block">REPLACE TYPE</label>
                                <span className="badge bg-secondary text-white">{detailModal.data.replace_type?.replace("_", " ").toUpperCase()}</span>
                            </div>

                            <div className="col-12 border-top pt-3">
                                <label className="text-muted small d-block">REPLACE REASON</label>
                                <div className="p-2 bg-light rounded mt-1 border">{detailModal.data.replace_reason}</div>
                            </div>

                            {detailModal.data.replace_note && (
                                <div className="col-12 pt-1">
                                    <label className="text-muted small d-block">USER NOTES</label>
                                    <div className="p-2 bg-light rounded mt-1 border text-muted" style={{ whiteSpace: "pre-line" }}>{detailModal.data.replace_note}</div>
                                </div>
                            )}

                            {/* Replace Items Section */}
                            <div className="col-12 border-top pt-3">
                                <h5 className="mb-2" style={{ fontWeight: "600" }}><i className="fa fa-boxes me-2"></i>Items to Replace</h5>
                                <div className="table-responsive border rounded bg-light">
                                    <table className="table table-sm table-borderless m-0" style={{ fontSize: "13px" }}>
                                        <thead>
                                            <tr className="bg-secondary-subtle">
                                                <th className="p-2">Original Product</th>
                                                <th className="p-2">Replacement Product</th>
                                                <th className="p-2 text-center">Qty</th>
                                                <th className="p-2 text-end">Points</th>
                                                <th className="p-2 text-center">Condition</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {detailModal.data.items_data && detailModal.data.items_data.length > 0 ? (
                                                detailModal.data.items_data.map((item, index) => (
                                                    <tr key={index} className="border-bottom">
                                                        <td className="p-2 fw-bold">{item.product_name}</td>
                                                        <td className="p-2 text-success">{item.replacement_product_name || "Same item"}</td>
                                                        <td className="p-2 text-center">{item.quantity}</td>
                                                        <td className="p-2 text-end text-muted">{item.subtotal_points} Pts</td>
                                                        <td className="p-2 text-center"><span className="badge bg-secondary text-white">{item.item_condition || "N/A"}</span></td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center p-2 text-muted">No items configured</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Proof Images Section */}
                            <div className="col-12 border-top pt-3">
                                <h5 className="mb-2" style={{ fontWeight: "600" }}><i className="fa fa-images me-2"></i>Proof Images</h5>
                                <div className="d-flex flex-wrap gap-2">
                                    {detailModal.data.images_data && detailModal.data.images_data.length > 0 ? (
                                        detailModal.data.images_data.map((imgObj, index) => (
                                            <a key={index} href={imgObj.image} target="_blank" rel="noopener noreferrer" className="p-1 border rounded bg-light shadow-sm" style={{ display: "inline-block" }}>
                                                <img src={imgObj.image} alt="Proof detail" width="100" height="100" style={{ objectFit: "cover", borderRadius: "4px" }} />
                                            </a>
                                        ))
                                    ) : (
                                        <span className="text-muted">No proof images uploaded.</span>
                                    )}
                                </div>
                            </div>

                            {/* Pickup details */}
                            {detailModal.data.pickup_data && detailModal.data.pickup_data.length > 0 && (
                                <div className="col-12 border-top pt-3">
                                    <h5 className="mb-2" style={{ fontWeight: "600" }}><i className="fa fa-truck me-2"></i>Pickup & Delivery Schedule</h5>
                                    {detailModal.data.pickup_data.map((pickup, idx) => (
                                        <div key={idx} className="p-3 bg-light rounded border mb-2">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="fw-bold text-dark">Courier Status:</span>
                                                <span className="badge bg-warning text-dark">{pickup.pickup_status?.toUpperCase()}</span>
                                            </div>
                                            {pickup.courier_name && (
                                                <div className="text-muted small mb-2">
                                                    <b>Courier:</b> {pickup.courier_name} &nbsp;|&nbsp; <b>Tracking:</b> {pickup.tracking_number}
                                                </div>
                                            )}
                                            {pickup.address_details && (
                                                <div style={{ fontSize: "13px" }} className="text-muted">
                                                    <div><b>Name:</b> {pickup.address_details.full_name}</div>
                                                    <div><b>Phone:</b> {pickup.address_details.phone}</div>
                                                    <div><b>Address:</b> {pickup.address_details.address}, {pickup.address_details.landmark ? `Near ${pickup.address_details.landmark}, ` : ""}{pickup.address_details.city}, {pickup.address_details.state} - {pickup.address_details.pincode}</div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="modal-actions mt-4 text-end">
                            <button className="btn btn-secondary px-4 py-2 border rounded" onClick={() => setDetailModal({ show: false, data: null })}>
                                Close Window
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div style={{ height: "150px" }}></div>
        </div>
    );
}
