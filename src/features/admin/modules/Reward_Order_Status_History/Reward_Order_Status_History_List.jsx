/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { Reward_Order_Status_History_API } from "./Reward_Order_Status_History_api";
import { Fetch_Reward_Order_Status_History_Table } from "./Reward_Order_Status_History_Table";

import { calculatePagination } from "../Pagination/Pagination";
import Admin_List_Header from "../Common Files/Admin_List_Header";
import Admin_Pagination_Buttons from "../Common Files/Admin_Pagination_Buttons";
import Admin_Table from "../Common Files/Admin_Table";
import { fetch_Users } from "../E-waste users/api";
import User_Filter from "../Filter_Component/User_Filter/User_Filter";
import "../Common Files/Admin_Notifications.css";
import { useAdminNotifications } from "../Common Files/useAdminNotifications";

// eslint-disable-next-line no-unused-vars
export default function Reward_Order_Status_History_Admin() {
    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(5);
    const [searchText, setSearchText] = useState("");
    
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

    // ✅ FILTER STATES
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(
        sessionStorage.getItem("selected_Reward_History_User_id") || ""
    );

    const handleUserChange = (val) => {
        setSelectedUser(val);
        sessionStorage.setItem("selected_Reward_History_User_id", val);
        setCurrentPage(1);
    };

    // LOAD DATA
    const loadTable = async (page = 1, limit = 5, searchTerm = "", userId = "") => {
        try {
            let query = "";
            if (userId) query += `&order__user=${userId}`;

            const res = await Reward_Order_Status_History_API.fetchAll(page, limit, searchTerm + query);
            const data_2 = res.data.results || [];

            setRows(data_2);

            const stats = calculatePagination(res.data, page, limit, data_2.length);
            setPaginationStats(stats);
        }
        catch (err) {
            console.log("API ERROR", err);
        }
    };

    useEffect(() => {
        loadTable(currentPage, currentLimit, searchText, selectedUser);
    }, [currentPage, currentLimit, searchText, selectedUser]);

    // FETCH USERS for Filter
    useEffect(() => {
        fetch_Users(1, 1000, "")
            .then(res => setUsers(res.data.results || res.data))
            .catch(err => console.log("User Fetch Error:", err));
    }, []);

    // EDIT (Placeholder for now as user didn't ask for edit UI yet)
    const edit_History = (id) => {
        // sessionStorage.setItem("edit_Reward_Order_Status_History_id", id);
        // navigate("/admin/Edit-Reward-Order-Status-History");
        alert("Edit functionality can be added if needed.");
    };

    // DELETE
    const deleteHistory = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this history record?");
        if (!confirmDelete) return;
        try {
            await Reward_Order_Status_History_API.Delete(id);
            setDeletingId(id);
            setTimeout(() => {
                setRows(prev => prev.filter(row => row.id !== id));
                setDeletingId(null);
            }, 500);
            showSuccess("Record Deleted Successfully.");
        } catch (error) { 
            console.error(error); 
            showError("Failed to delete record.");
        }
    };

    return (
        <div className="admin-content p-3" style={{ minHeight: "800px" }}>

            <div style={{ position: "relative", zIndex: 1060 }}>
                <Admin_List_Header
                    title="Reward Order Status History"
                    addButtonText=""
                    addButtonLink=""
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
                    {/* ✅ FILTER: USER */}
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
                        columns={["ID", "Order", "User", "Status", "Remarks", "Changed By", "Created At", "Action"]}
                    >
                        {Fetch_Reward_Order_Status_History_Table(rows, edit_History, deleteHistory, deletingId)}
                    </Admin_Table>

                    <Admin_Pagination_Buttons
                        paginationStats={paginationStats}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </form>
            </div>
            <div style={{ height: "150px" }}></div>
        </div>
    );
}
