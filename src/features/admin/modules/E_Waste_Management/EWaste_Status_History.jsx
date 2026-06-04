import React, { useEffect, useState } from "react";
import { EWaste_Status_History_API } from "./api";
import { Fetch_EWaste_Status_History_Table } from "./Table";
import { calculatePagination, generatePaginationButtons } from "../Pagination/Pagination";

export default function EWaste_Status_History() {
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
    const [deletingId, setDeletingId] = useState(null);

    const loadTable = async (page = 1, limit = 5, searchTerm = "") => {
        try {
            const res = await EWaste_Status_History_API.fetchAll(page, limit, searchTerm);
            const data = res.data.results || [];
            setRows(data);
            const stats = calculatePagination(res.data, page, limit, data.length);
            setPaginationStats(stats);
        } catch (err) {
            console.log("API ERROR", err);
        }
    };

    useEffect(() => {
        loadTable(currentPage, currentLimit, searchText);
    }, [currentPage, currentLimit, searchText]);

    const handleEdit = (id) => {
        sessionStorage.setItem("edit_history_id", id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this history record?")) return;
        try {
            await EWaste_Status_History_API.Delete(id);
            setDeletingId(id);
            setTimeout(() => {
                setRows(prev => prev.filter(row => row.id !== id));
                setDeletingId(null);
            }, 500);
        } catch (err) {
            console.error("Delete Error", err);
        }
    };

    return (
        <div className="admin-content p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold">E-Waste Status History</h4>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center">
                    <label className="me-2">Show:</label>
                    <select className="form-select form-select-sm" value={currentLimit} onChange={(e) => { setCurrentLimit(Number(e.target.value)); setCurrentPage(1); }}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </div>
                <div className="d-flex align-items-center">
                    <label className="me-2">Search:</label>
                    <input type="text" className="form-control form-control-sm" placeholder="Search..." value={searchText} onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }} />
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="table-success">
                        <tr>
                            <th>ID</th>
                            <th>Submission ID</th>
                            <th>Status Label</th>
                            <th>Update Date</th>
                            <th>Update Time</th>
                            <th>Remarks</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Fetch_EWaste_Status_History_Table(rows, handleEdit, handleDelete, deletingId)}
                    </tbody>
                </table>

                <div className="pagination-container_2 d-flex justify-content-between align-items-center mt-3">
                    <div className="entries-info">
                        {paginationStats.totalRecords > 0 && `Showing ${paginationStats.startEntry} to ${paginationStats.endEntry} of ${paginationStats.totalRecords} entries`}
                    </div>
                    <div id="pagination_2" dangerouslySetInnerHTML={{ __html: generatePaginationButtons(currentPage, paginationStats.totalPages) }} onClick={(e) => { if (e.target.id) setCurrentPage(Number(e.target.id)); }}></div>
                </div>
            </div>
        </div>
    );
}
