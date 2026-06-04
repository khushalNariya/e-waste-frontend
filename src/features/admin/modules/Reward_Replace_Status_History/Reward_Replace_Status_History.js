import React, { useEffect, useState } from "react";
import { Reward_Replace_Status_History_API } from "./api";
import { Fetch_Reward_Replace_Status_History_Table } from "./Table";
import { calculatePagination } from "../Pagination/Pagination";
import Admin_List_Header from "../Common Files/Admin_List_Header";
import Admin_Pagination_Buttons from "../Common Files/Admin_Pagination_Buttons";
import Admin_Table from "../Common Files/Admin_Table";
import "../Common Files/Admin_Notifications.css";
import { useAdminNotifications } from "../Common Files/useAdminNotifications";

export default function Reward_Replace_Status_History_Admin() {
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

    const [selectedStatus, setSelectedStatus] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const {
        successMsg,
        errorMsg,
        fadeOut,
        successRef,
        showSuccess,
        showError
    } = useAdminNotifications();

    // Load Data
    const loadTable = async (page = 1, limit = 5, searchTerm = "", filters = {}) => {
        try {
            const res = await Reward_Replace_Status_History_API.fetchAll(page, limit, searchTerm, filters);
            const data = res.data.results || [];
            setRows(data);

            const stats = calculatePagination(res.data, page, limit, data.length);
            setPaginationStats(stats);
        } catch (err) {
            console.error("API ERROR", err);
        }
    };

    useEffect(() => {
        loadTable(currentPage, currentLimit, searchText, {
            status: selectedStatus
        });
    }, [currentPage, currentLimit, searchText, selectedStatus]);

    const deleteHistory = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this status history record?");
        if (!confirmDelete) return;

        try {
            await Reward_Replace_Status_History_API.Delete(id);
            setDeletingId(id);

            setTimeout(() => {
                setRows(prevRows => prevRows.filter(row => row.id !== id));
                setDeletingId(null);
            }, 500);

            showSuccess("History record deleted successfully.");
        } catch (error) {
            console.error("Delete Error:", error);
            showError("Failed to delete history record.");
        }
    };

    return (
        <div className="admin-content p-3">
            <Admin_List_Header
                title="Replace Status History Audit Logs"
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
                    <option value="">All Replace Statuses</option>
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
                        columns={["ID", "Replace Number", "User Name", "Transition Status", "System / Admin Remarks", "Action Done By", "Timestamp", "Action"]}
                    >
                        {Fetch_Reward_Replace_Status_History_Table(rows, deleteHistory, deletingId)}
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
