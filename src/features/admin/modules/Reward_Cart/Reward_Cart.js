import React, { useEffect, useState, useRef } from "react";
import { Reward_Cart_API } from "./api";
import { Fetch_Reward_Cart_Table } from "./Table";
import { calculatePagination } from "../Pagination/Pagination";
import { useNavigate } from "react-router-dom";
import Admin_List_Header from "../Common Files/Admin_List_Header";
import Admin_Pagination_Buttons from "../Common Files/Admin_Pagination_Buttons";
import Admin_Table from "../Common Files/Admin_Table";

// Import Filter Components
import User_Filter from "../Filter_Component/User_Filter/User_Filter";
import { fetch_Users } from "../E-waste users/api";

export default function Reward_Cart_admin() {
    // eslint-disable-next-line no-unused-vars
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

    const [successMsg, setSuccessMsg] = useState("");
    const [fadeOut, setFadeOut] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const successRef = useRef(null);

    // Load Data
    const loadTable = async (page = 1, limit = 5, searchTerm = "", filters = {}) => {
        try {
            const res = await Reward_Cart_API.fetchAll(page, limit, searchTerm, filters);
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

    const deleteCart = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Cart?");
        if (!confirmDelete) return;

        try {
            await Reward_Cart_API.Delete(id);
            setDeletingId(id);

            setTimeout(() => {
                setRows(prevRows => prevRows.filter(row => row.id !== id));
                setDeletingId(null);
            }, 500);

            setSuccessMsg("Cart deleted successfully.");
        } catch (error) {
            console.error("Delete Error:", error);
        }
    };

    useEffect(() => {
        const msg = sessionStorage.getItem("success_message");
        if (msg) {
            setSuccessMsg(msg);
            sessionStorage.removeItem("success_message");
        }
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (successRef.current && !successRef.current.contains(event.target)) {
                setFadeOut(true);
                setTimeout(() => {
                    setSuccessMsg("");
                    setFadeOut(false);
                }, 500);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [successRef]);

    return (
        <div className="admin-content p-3">
            <Admin_List_Header
                title="Reward Cart List"
                searchText={searchText}
                setSearchText={setSearchText}
                currentLimit={currentLimit}
                setCurrentLimit={setCurrentLimit}
                setCurrentPage={setCurrentPage}
                successMsg={successMsg}
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

                {/* STATUS FILTER (Simplified select for now) */}
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
                    <option value="active">Active</option>
                    <option value="checked_out">Checked Out</option>
                    <option value="abandoned">Abandoned</option>
                </select>
            </Admin_List_Header>

            <div className="table-responsive">
                <form id="load-data" onSubmit={(e) => e.preventDefault()}>
                    <Admin_Table
                        columns={["ID", "User", "Status", "Total Points", "Created At", "Updated At", "Action"]}
                    >
                        {Fetch_Reward_Cart_Table(rows, null, deleteCart, deletingId)}
                    </Admin_Table>

                    <Admin_Pagination_Buttons
                        paginationStats={paginationStats}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </form>
            </div>
            {/* Safe spacing for fixed sidebars/footers */}
            <div style={{ height: "150px" }}></div>
        </div>
    );
}
