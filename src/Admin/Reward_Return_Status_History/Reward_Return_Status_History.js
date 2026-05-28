import React, { useEffect, useState } from "react";
import { Reward_Return_Status_History_API } from "./api";
import { Fetch_Reward_Return_Status_History_Table } from "./Table";
import { calculatePagination } from "../Pagination/Pagination";
import Admin_List_Header from "../Common Files/Admin_List_Header";
import Admin_Pagination_Buttons from "../Common Files/Admin_Pagination_Buttons";
import Admin_Table from "../Common Files/Admin_Table";
import "../Common Files/Admin_Notifications.css";
import { useAdminNotifications } from "../Common Files/useAdminNotifications";

export default function Reward_Return_Status_History_Admin() {
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

    // Load Data
    const loadTable = async (page = 1, limit = 5, searchTerm = "") => {
        try {
            const res = await Reward_Return_Status_History_API.fetchAll(page, limit, searchTerm);
            const data = res.data.results || [];
            setRows(data);

            const stats = calculatePagination(
                res.data,
                page,
                limit,
                data.length
            );
            setPaginationStats(stats);
        }
        catch (err) {
            console.error("API ERROR", err);
        }
    };

    useEffect(() => {
        loadTable(currentPage, currentLimit, searchText);
    }, [currentPage, currentLimit, searchText]);

    const deleteHistory = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this status history record?");
        if (!confirmDelete) return;

        try {
            await Reward_Return_Status_History_API.Delete(id);
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
                title="Return Status History Audit Logs"
                searchText={searchText}
                setSearchText={setSearchText}
                currentLimit={currentLimit}
                setCurrentLimit={setCurrentLimit}
                setCurrentPage={setCurrentPage}
                successMsg={successMsg}
                errorMsg={errorMsg}
                fadeOut={fadeOut}
                successRef={successRef}
            />

            <div className="table-responsive">
                <form id="load-data" onSubmit={(e) => e.preventDefault()}>
                    <Admin_Table
                        columns={["ID", "Return Number", "User Name", "Transition Status", "System / Admin Remarks", "Action Done By", "Timestamp", "Action"]}
                    >
                        {Fetch_Reward_Return_Status_History_Table(rows, deleteHistory, deletingId)}
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
