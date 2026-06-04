import React, { useEffect, useState, useRef } from "react";

import { Reward_Category_API } from "./api";
import { Fatch_Reward_Category_Table } from "./Table";

import { calculatePagination } from "../Pagination/Pagination";
import { useNavigate } from "react-router-dom";

import Admin_List_Header from "../Common Files/Admin_List_Header";
import Admin_Pagination_Buttons from "../Common Files/Admin_Pagination_Buttons";
import Admin_Table from "../Common Files/Admin_Table";


export default function Reward_Category_admin() {
    const navigate = useNavigate();

    // const [activeTab, setActiveTab] = useState("Brand List"); // Default selection

    const [rows, setRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(5);
    const [searchText, setSearchText] = useState("");
    // eslint-disable-next-line no-unused-vars
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


    // LOAD USERS
    const loadTable = async (page = 1, limit = 5, searchTerm = "") => {
        try {
            const res = await Reward_Category_API.fetchAll(page, limit, searchTerm);
            // console.log("API Response:", res.data);  // <- Add this

            const data_2 = res.data.results || [];
            // console.log("Table Rows:", data_2);      // <- Add this

            
            setRows(data_2);
            setTotalRecords(res.data.count);

            // ✅ YAHI PART AAP ADD KARNA CHAHTE THE
            const stats = calculatePagination(
                res.data,        // store_data
                page,            // currentPage
                limit,           // pageSize
                data_2.length    // current page records
            );

            setPaginationStats(stats);

        }

        catch (err) {
            console.log("API ERROR", err);
        }
    };

    useEffect(() => {
        // if (activeTab === "Brand List") {
        loadTable(currentPage, currentLimit, searchText);
        // }
    }, [currentPage, currentLimit, searchText]);

    // EDIT
    const edit_Users = (id) => {
        sessionStorage.setItem("edit_Reward_Category_id", id);
        navigate("/admin/Edit-Reward-Category");
    };

    // ---------------- DELETE ----------------
    const deleteUsers = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this Reward Category ?"
        );

        if (!confirmDelete) return;

        try {
            await Reward_Category_API.Delete(id);   // ✅ API call

            // 🔥 fade start
            setDeletingId(id);

            // 🔥 animation ke baad row remove
            setTimeout(() => {

                setRows(prevRows => {

                    const newRows = prevRows.filter(row => row.id !== id);

                    if (newRows.length === 0 && currentPage > 1) {
                        setCurrentPage(prev => prev - 1);
                    }

                    return newRows;
                });

                setTotalRecords(prev => prev - 1);

                setDeletingId(null);

            }, 500);


            setSuccessMsg("Reward Category deleted successfully.");

        } catch (error) {
            console.error("Delete Error:", error);
        }
    };


    // ✅ Success - Msg (Session Hanndle) Page load par success message show karne ke liye
    useEffect(() => {
        const msg = sessionStorage.getItem("success_message");
        if (msg) {
            setSuccessMsg(msg); // React alert show karega
            sessionStorage.removeItem("success_message"); // ek baar show hone ke baad remove
        }
    }, []);


    // Hide success message on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (successRef.current && !successRef.current.contains(event.target)) {
                // 🔴 fadeOut start
                setFadeOut(true);

                // fade animation ke baad remove
                setTimeout(() => {
                    setSuccessMsg("");
                    setFadeOut(false);
                }, 500); // CSS transition time
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [successRef]);



    return (
        <div className="admin-content p-3">



            <>
                {/* HEADER */}

                <Admin_List_Header
                    title="Reward Category List"
                    addButtonText="Add Reward Category"
                    addButtonLink="/admin/Add-Reward-Category"

                    searchText={searchText}
                    setSearchText={setSearchText}

                    currentLimit={currentLimit}
                    setCurrentLimit={setCurrentLimit}

                    setCurrentPage={setCurrentPage}

                    successMsg={successMsg}
                    fadeOut={fadeOut}
                    successRef={successRef}
                />

                {/* TABLE */}
                {/* https://icons.getbootstrap.com/ */}
                <div className="table-responsive">
                    <form id="load-data" onSubmit={(e) => e.preventDefault()}>

                        <Admin_Table
                            columns={["ID", "Title", "Slug", "Status", "Created At", "Updated At", "Action"]}
                        >
                            {Fatch_Reward_Category_Table(rows, edit_Users, deleteUsers, deletingId)}
                        </Admin_Table>



                        {/* PAGINATION */}
                        <Admin_Pagination_Buttons
                            paginationStats={paginationStats}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />

                    </form>
                </div>
            </>



        </div>

    );

}
