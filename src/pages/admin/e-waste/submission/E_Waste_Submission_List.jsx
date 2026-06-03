import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { E_Waste_Submission_API } from "./E_Waste_Submission_api";
import { Fatch_E_Waste_Submission_Table } from "./E_Waste_Submission_Table";

import { calculatePagination } from "../../shared/Pagination/Pagination";
import Admin_List_Header from "../../shared/common/Admin_List_Header";
import "../../shared/common/Admin_Notifications.css";
import { useAdminNotifications } from "../../shared/common/useAdminNotifications";
import Admin_Pagination_Buttons from "../../shared/common/Admin_Pagination_Buttons";
import Admin_Table from "../../shared/common/Admin_Table";
import { Recycling_info_API } from "../recycling-info/api";
import { fetch_Users } from "../../users/users-list/api";
import Category_Filter from "../../shared/FilterComponent/Category_Filter/Category_Filter";
import User_Filter from "../../shared/FilterComponent/User_Filter/User_Filter";

export default function E_Waste_Submission_Admin() {
    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(5);
    const [searchText, setSearchText] = useState("");
    const [totalRecords, setTotalRecords] = useState(0);

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

    // ✅ FILTER STATES
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(
        sessionStorage.getItem("selected_E_Waste_Category_id") || ""
    );

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(
        sessionStorage.getItem("selected_E_Waste_User_id") || ""
    );

    const handleCategoryChange = (val) => {
        setSelectedCategory(val);
        sessionStorage.setItem("selected_E_Waste_Category_id", val);
        setCurrentPage(1);
    };

    const handleUserChange = (val) => {
        setSelectedUser(val);
        sessionStorage.setItem("selected_E_Waste_User_id", val);
        setCurrentPage(1);
    };

    // LOAD USERS
    const loadTable = async (page = 1, limit = 5, searchTerm = "", categoryId = "", userId = "") => {
        try {
            let query = "";
            if (categoryId) query += `&category=${categoryId}`;
            if (userId) query += `&user=${userId}`;

            const res = await E_Waste_Submission_API.fetchAll(page, limit, searchTerm + query);
            const data_2 = res.data.results || [];

            setRows(data_2);
            setTotalRecords(res.data.count);

            const stats = calculatePagination(res.data, page, limit, data_2.length);
            setPaginationStats(stats);
        }
        catch (err) {
            console.log("API ERROR", err);
        }
    };

    useEffect(() => {
        loadTable(currentPage, currentLimit, searchText, selectedCategory, selectedUser);
    }, [currentPage, currentLimit, searchText, selectedCategory, selectedUser]);

    // FETCH CATEGORIES & USERS
    useEffect(() => {
        Recycling_info_API.fetchAll(1, 1000)
            .then(res => setCategories(res.data.results || res.data))
            .catch(err => console.log("Category Fetch Error:", err));

        fetch_Users(1, 1000, "")
            .then(res => setUsers(res.data.results || res.data))
            .catch(err => console.log("User Fetch Error:", err));
    }, []);

    // EDIT
    const edit_Users = (id) => {
        sessionStorage.setItem("edit_E_Waste_Submission_id", id);
        navigate("/admin/Edit-E-Waste-Submission");
    };

    // DELETE
    const deleteUsers = async (id) => {
        const confirmDelete = window.confirm("Are you sure?");
        if (!confirmDelete) return;
        try {
            await E_Waste_Submission_API.Delete(id);
            setDeletingId(id);
            setTimeout(() => {
                setRows(prev => prev.filter(row => row.id !== id));
                setTotalRecords(prev => prev - 1);
                setDeletingId(null);
            }, 500);
            showSuccess("Submission deleted successfully.");
        } catch (error) { 
            console.error(error);
            showError("Failed to delete submission.");
        }
    };

    // STATUS UPDATE
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const res = await E_Waste_Submission_API.patch(id, { status: newStatus });
            setRows(prev => prev.map(row => row.id === id ? { ...row, ...res.data } : row));
            showSuccess("Status updated successfully.");
        } catch (error) {
            console.error("Status Update Error:", error);
            let errorMessage = "Failed to update status.";
            if (error.response && error.response.data) {
                const data = error.response.data;
                errorMessage = typeof data === "string" ? data : (data.detail || data.message || data.error || Object.values(data).flat().join(" "));
            }
            showError(errorMessage);
        }
    };

    // MODERN CONFIRMATION HANDLER
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

    useEffect(() => {
        const msg = sessionStorage.getItem("success_message");
        if (msg) {
            showSuccess(msg);
            sessionStorage.removeItem("success_message");
        }
    }, []);

    return (
        <div className="admin-content p-3" style={{ minHeight: "800px" }}>
            <div style={{ position: "relative", zIndex: 1060 }}>
                <Admin_List_Header
                    title="E-Waste Submission List"
                    addButtonText="Add Submission"
                    addButtonLink="/admin/Add-E-Waste-Submission"
                    searchText={searchText}
                    setSearchText={setSearchText}
                    currentLimit={currentLimit}
                    setCurrentLimit={setCurrentLimit}
                    setCurrentPage={setCurrentPage}
                    successMsg={successMsg}
                    errorMsg={errorMsg}
                    fadeOut={fadeOut}
                    successRef={successRef}
                    showFilter={false}
                >
                    <Category_Filter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelect={handleCategoryChange}
                    />
                    <User_Filter
                        users={users}
                        selectedUser={selectedUser}
                        onSelect={handleUserChange}
                    />
                </Admin_List_Header>
            </div>

            <div className="table-responsive">
                <form id="load-data" onSubmit={(e) => e.preventDefault()}>
                    <Admin_Table
                        columns={["ID", "User", "Category", "Brand", "Model", "Images", "Weight (kg)", "User Condition", "Final Condition", "Type", "Facility", "Address", "Date/Time", "Phone", "Notes", "Status", "Created At", "Updated At", "Action"]}
                    >
                        {Fatch_E_Waste_Submission_Table(rows, edit_Users, deleteUsers, deletingId, handleStatusUpdateWithConfirm)}
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
                        <p>Do you really want to <b>Reject</b> this submission? This action will be logged in the history.</p>
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
            <div style={{ height: "150px" }}></div>
        </div>
    );
}
