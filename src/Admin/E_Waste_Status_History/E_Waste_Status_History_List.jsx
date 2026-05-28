import React, { useEffect, useState, useRef } from "react";

import { E_Waste_Status_History_API } from "./E_Waste_Status_History_api";
import { Fatch_E_Waste_Status_History_Table } from "./E_Waste_Status_History_Table";


import { calculatePagination } from "../Pagination/Pagination";
import { useNavigate } from "react-router-dom";

import Admin_List_Header from "../Common Files/Admin_List_Header";
import Admin_Pagination_Buttons from "../Common Files/Admin_Pagination_Buttons";
import Admin_Table from "../Common Files/Admin_Table";
import { Recycling_info_API } from "../Category -- Recycling Info/api";
import { fetch_Users } from "../E-waste users/api";
import Category_Filter from "../Filter_Component/Category_Filter/Category_Filter";
import User_Filter from "../Filter_Component/User_Filter/User_Filter";



export default function E_Waste_Status_History_Admin() {
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

    const [successMsg, setSuccessMsg] = useState("");
    const [fadeOut, setFadeOut] = useState(false);

    const [deletingId, setDeletingId] = useState(null);
    const successRef = useRef(null);

    // ✅ FILTER STATES
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(
        sessionStorage.getItem("selected_History_Category_id") || ""
    );

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(
        sessionStorage.getItem("selected_History_User_id") || ""
    );

    const handleCategoryChange = (val) => {
        setSelectedCategory(val);
        sessionStorage.setItem("selected_History_Category_id", val);
        setCurrentPage(1);
    };

    const handleUserChange = (val) => {
        setSelectedUser(val);
        sessionStorage.setItem("selected_History_User_id", val);
        setCurrentPage(1);
    };

    // LOAD DATA
    const loadTable = async (page = 1, limit = 5, searchTerm = "", categoryId = "", userId = "") => {
        try {
            let query = "";
            if (categoryId) query += `&submission__category=${categoryId}`;
            if (userId) query += `&submission__user=${userId}`;

            const res = await E_Waste_Status_History_API.fetchAll(page, limit, searchTerm + query);
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
    const edit_History = (id) => {
        sessionStorage.setItem("edit_E_Waste_Status_History_id", id);
        navigate("/admin/Edit-E-Waste-Status-History");
    };

    // DELETE
    const deleteHistory = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this history record?");
        if (!confirmDelete) return;
        try {
            await E_Waste_Status_History_API.Delete(id);
            setDeletingId(id);
            setTimeout(() => {
                setRows(prev => prev.filter(row => row.id !== id));
                setTotalRecords(prev => prev - 1);
                setDeletingId(null);
            }, 500);
            setSuccessMsg("Record Deleted.");
        } catch (error) { console.error(error); }
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
        <div className="admin-content p-3" style={{ minHeight: "800px" }}>

            <div style={{ position: "relative", zIndex: 1060 }}>
                <Admin_List_Header
                    title="E-Waste Status History"
                    addButtonText=""
                    addButtonLink=""
                    searchText={searchText}
                    setSearchText={setSearchText}
                    currentLimit={currentLimit}
                    setCurrentLimit={setCurrentLimit}
                    setCurrentPage={setCurrentPage}
                    successMsg={successMsg}
                    fadeOut={fadeOut}
                    successRef={successRef}
                    showFilter={false}
                >
                    {/* ✅ FILTER 1: CATEGORY */}
                    <Category_Filter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelect={handleCategoryChange}
                    />

                    {/* ✅ FILTER 2: USER */}
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
                        columns={["ID", "Submission", "User", "Category", "Brand", "Model Name", "Status", "Remarks", "Image", "Changed By", "Time", "Action"]}
                    >
                        {Fatch_E_Waste_Status_History_Table(rows, edit_History, deleteHistory, deletingId)}
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

