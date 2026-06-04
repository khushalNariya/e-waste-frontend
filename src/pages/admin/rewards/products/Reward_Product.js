import React, { useEffect, useState, useRef } from "react";

import { Reward_Product_API, Reward_Category_API } from "./api";
import { Fatch_Reward_Product_Table } from "./Table";

import { calculatePagination } from "../../shared/Pagination/Pagination";
import { useNavigate } from "react-router-dom";

import Admin_List_Header from "../../shared/common/Admin_List_Header";
import Admin_Pagination_Buttons from "../../shared/common/Admin_Pagination_Buttons";
import Admin_Table from "../../shared/common/Admin_Table";

// Import Filter Components
import Category_Filter from "../../shared/FilterComponent/Category_Filter/Category_Filter";


export default function Reward_Product_admin() {
    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(5);
    const [searchText, setSearchText] = useState("");

    const [categories, setCategories] = useState([]);
    // Filter Category
    const [selectedCategory, setSelectedCategory] = useState("");

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


    // LOAD DATA
    const loadTable = async (page = 1, limit = 5, searchTerm = "", filters = {}) => {
        try {
            const res = await Reward_Product_API.fetchAll(page, limit, searchTerm, filters);
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

    // Load Categories for filter
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await Reward_Category_API.fetchAll(1, 100);
                setCategories(res.data.results || []);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        loadTable(currentPage, currentLimit, searchText, {
            category: selectedCategory
        });
    }, [currentPage, currentLimit, searchText, selectedCategory]);

    // TOGGLE STATUS
    const toggleStatus = async (id) => {
        try {
            const product = rows.find(r => r.id === id);
            const newStatus = !product.is_active;

            // Optimistic Update
            setRows(prev => prev.map(r => r.id === id ? { ...r, is_active: newStatus } : r));

            await Reward_Product_API.update_1(id, { is_active: newStatus });
        } catch (error) {
            console.error("Toggle Status Error:", error);
            // Rollback if failed
            loadTable(currentPage, currentLimit, searchText, {
                category: selectedCategory
            });
        }
    };

    // EDIT
    const edit_Product = (id) => {
        sessionStorage.setItem("edit_Reward_Product_id", id);
        navigate("/admin/Edit-Reward-Product");
    };

    // DELETE
    const deleteProduct = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this Reward Product?"
        );

        if (!confirmDelete) return;

        try {
            await Reward_Product_API.Delete(id);

            setDeletingId(id);

            setTimeout(() => {
                setRows(prevRows => {
                    const newRows = prevRows.filter(row => row.id !== id);
                    if (newRows.length === 0 && currentPage > 1) {
                        setCurrentPage(prev => prev - 1);
                    }
                    return newRows;
                });
                setDeletingId(null);
            }, 500);

            setSuccessMsg("Reward Product deleted successfully.");
        } catch (error) {
            console.error("Delete Error:", error);
        }
    };


    // Success Msg Handle
    useEffect(() => {
        const msg = sessionStorage.getItem("success_message");
        if (msg) {
            setSuccessMsg(msg);
            sessionStorage.removeItem("success_message");
        }
    }, []);


    // Hide success message on outside click
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
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [successRef]);



    return (
        <div className="admin-content p-3">
            <>
                {/* HEADER */}
                <Admin_List_Header
                    title="Reward Product List"
                    addButtonText="Add Reward Product"
                    addButtonLink="/admin/Add-Reward-Product"

                    searchText={searchText}
                    setSearchText={setSearchText}

                    currentLimit={currentLimit}
                    setCurrentLimit={setCurrentLimit}

                    setCurrentPage={setCurrentPage}

                    successMsg={successMsg}
                    fadeOut={fadeOut}
                    successRef={successRef}
                >
                    {/* CATEGORY FILTER */}
                    <Category_Filter 
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelect={(val) => {
                            setSelectedCategory(val);
                            setCurrentPage(1);
                        }}
                    />
                </Admin_List_Header>


                {/* TABLE */}
                <div className="table-responsive">
                    <form id="load-data" onSubmit={(e) => e.preventDefault()}>

                        <Admin_Table
                            columns={["ID", "Name", "Slug", "Category", "Points", "Stock", "Description", "Terms", "Tag", "Delivery Days", "Rating", "Redeemed", "Status", "Created At", "Updated At", "Action"]}
                        >
                            {Fatch_Reward_Product_Table(rows, edit_Product, deleteProduct, toggleStatus, deletingId)}
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
