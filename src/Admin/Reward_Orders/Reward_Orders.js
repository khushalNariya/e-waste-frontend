import React, { useEffect, useState, useRef } from "react";
import { Reward_Order_API } from "./api";
import { Fetch_Reward_Order_Table } from "./Table";
import { calculatePagination } from "../Pagination/Pagination";
import { useNavigate } from "react-router-dom";
import Admin_List_Header from "../Common Files/Admin_List_Header";
import Admin_Pagination_Buttons from "../Common Files/Admin_Pagination_Buttons";
import Admin_Table from "../Common Files/Admin_Table";
import "../Common Files/Admin_Notifications.css";
import { useAdminNotifications } from "../Common Files/useAdminNotifications";

// Import Filter Components
import User_Filter from "../Filter_Component/User_Filter/User_Filter";
import { fetch_Users } from "../E-waste users/api";

export default function Reward_Orders_admin() {
    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(5);
    const [searchText, setSearchText] = useState("");

    // Filters
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");

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
    const [confirmModal, setConfirmModal] = useState({ show: false, id: null, status: null });

    // Load Data
    const loadTable = async (page = 1, limit = 5, searchTerm = "", filters = {}) => {
        try {
            const res = await Reward_Order_API.fetchAll(page, limit, searchTerm, filters);
            const data_2 = res.data.results || [];
            setRows(data_2);

            const stats = calculatePagination(
                res.data,
                page,
                limit,
                data_2.length
            );
            setPaginationStats(stats);
        }
        catch (err) {
            console.log("API ERROR", err);
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

    const deleteOrder = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Order?");
        if (!confirmDelete) return;

        try {
            await Reward_Order_API.Delete(id);
            setDeletingId(id);

            setTimeout(() => {
                setRows(prevRows => prevRows.filter(row => row.id !== id));
                setDeletingId(null);
            }, 500);

            showSuccess("Order deleted successfully.");
        } catch (error) {
            console.error("Delete Error:", error);
            showError("Failed to delete order.");
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
            const res = await Reward_Order_API.patch(id, { order_status: newStatus });
            // Update row data locally to show changes immediately
            setRows(prev => prev.map(row => row.id === id ? { ...row, ...res.data } : row));
            showSuccess("Order status updated successfully.");
        } catch (err) {
            console.error("Error updating status:", err);
            let errorMessage = "Failed to update status.";
            if (err.response && err.response.data) {
                const data = err.response.data;
                errorMessage = typeof data === "string" ? data : (data.detail || data.message || data.error || Object.values(data).flat().join(" "));
            }
            showError(errorMessage);
        }
    };

    // MODERN CONFIRMATION HANDLER
    const handleStatusUpdateWithConfirm = (id, newStatus) => {
        if (newStatus === "cancelled") {
            setConfirmModal({ show: true, id, status: newStatus });
        } else {
            handleStatusUpdate(id, newStatus);
        }
    };

    const confirmCancelAction = () => {
        handleStatusUpdate(confirmModal.id, confirmModal.status);
        setConfirmModal({ show: false, id: null, status: null });
    };

    return (
        <div className="admin-content p-3">
            <Admin_List_Header
                title="Reward Order List"
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
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="packed">Packed</option>
                    <option value="shipped">Shipped</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="returned">Returned</option>
                    <option value="failed">Failed</option>
                </select>
            </Admin_List_Header>

            <div className="table-responsive">
                <form id="load-data" onSubmit={(e) => e.preventDefault()}>
                    <Admin_Table
                        columns={["ID", "Order Number", "User", "Status", "Total Points", "Cart ID", "Delivered At", "Created At", "Action"]}
                    >
                        {Fetch_Reward_Order_Table(rows, null, deleteOrder, deletingId, handleStatusUpdateWithConfirm)}
                    </Admin_Table>

                    <Admin_Pagination_Buttons
                        paginationStats={paginationStats}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </form>
            </div>

            {/* MODERN CONFIRMATION MODAL */}
            {confirmModal.show && (
                <div className="modern-modal-overlay">
                    <div className="modern-modal">
                        <div className="modal-icon-wrapper">
                            <i className="fa fa-exclamation-triangle"></i>
                        </div>
                        <h3>Are you sure?</h3>
                        <p>Do you really want to <b>Cancel</b> this order? This will refund the points to the user's wallet automatically.</p>
                        <div className="modal-actions">
                            <button className="modal-btn cancel" onClick={() => setConfirmModal({ show: false, id: null, status: null })}>
                                No, Keep Order
                            </button>
                            <button className="modal-btn confirm" onClick={confirmCancelAction}>
                                Yes, Cancel Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div style={{ height: "150px" }}></div>
        </div>
    );
}
