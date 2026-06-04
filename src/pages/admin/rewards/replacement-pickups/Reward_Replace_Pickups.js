import React, { useEffect, useState } from "react";
import { Reward_Replace_Pickup_API } from "./api";
import { Fetch_Reward_Replace_Pickup_Table } from "./Table";
import { calculatePagination } from "../../shared/Pagination/Pagination";
import Admin_List_Header from "../../shared/common/Admin_List_Header";
import Admin_Pagination_Buttons from "../../shared/common/Admin_Pagination_Buttons";
import Admin_Table from "../../shared/common/Admin_Table";

export default function Reward_Replace_Pickups_Admin() {
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

    // Load Data
    const loadTable = async (page = 1, limit = 5, searchTerm = "", filters = {}) => {
        try {
            const res = await Reward_Replace_Pickup_API.fetchAll(page, limit, searchTerm, filters);
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
            pickup_status: selectedStatus
        });
    }, [currentPage, currentLimit, searchText, selectedStatus]);

    return (
        <div className="admin-content p-3">
            <Admin_List_Header
                title="Replace Pickups & Courier Schedule"
                searchText={searchText}
                setSearchText={setSearchText}
                currentLimit={currentLimit}
                setCurrentLimit={setCurrentLimit}
                setCurrentPage={setCurrentPage}
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
                    <option value="">All Courier Status</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="delivered">Delivered</option>
                    <option value="failed">Failed</option>
                    <option value="rescheduled">Rescheduled</option>
                </select>
            </Admin_List_Header>

            <div className="table-responsive">
                <form id="load-data" onSubmit={(e) => e.preventDefault()}>
                    <Admin_Table
                        columns={["ID", "Replace Number", "Order Number", "User Name", "Address Details", "Courier Status"]}
                    >
                        {Fetch_Reward_Replace_Pickup_Table(rows)}
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
