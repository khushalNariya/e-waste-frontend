import React, { useEffect, useState, useRef } from "react";
import { Reward_Product_API, Reward_Product_Image_API } from "./api";
import { Fatch_Reward_Product_Image_Table } from "./Table";
import { calculatePagination } from "../../shared/Pagination/Pagination";
import { useNavigate } from "react-router-dom";
import Admin_List_Header from "../../shared/common/Admin_List_Header";
import Admin_Pagination_Buttons from "../../shared/common/Admin_Pagination_Buttons";
import Admin_Table from "../../shared/common/Admin_Table";
import Reward_Product_Filter from "../../shared/FilterComponent/Reward_Product_Filter/Reward_Product_Filter";
import Category_Filter from "../../shared/FilterComponent/Category_Filter/Category_Filter";
import { Reward_Category_API } from "../categories/api";

/**
 * Reward_Product_Image_admin Component
 * Is page par Reward Products ki images manage hoti hain.
 */
export default function Reward_Product_Image_admin() {
    const navigate = useNavigate();

    // --- BASIC STATES ---
    const [rows, setRows] = useState([]);             // Table data store karne ke liye
    const [currentPage, setCurrentPage] = useState(1); // Current page number tracking
    const [currentLimit, setCurrentLimit] = useState(5); // Records per page limit
    const [searchText, setSearchText] = useState("");   // Global search text state

    // --- PAGINATION STATS ---
    const [paginationStats, setPaginationStats] = useState({
        totalRecords: 0,
        startEntry: 0,
        endEntry: 0,
        totalPages: 1,
    });

    // --- UI/UX STATES ---
    const [successMsg, setSuccessMsg] = useState("");    // Success alert message
    const [fadeOut, setFadeOut] = useState(false);       // Alert hide animation control
    const [deletingId, setDeletingId] = useState(null);  // ID tracking for deletion animation
    const successRef = useRef(null);

    // --- PRODUCT FILTER STATES ---
    const [products, setProducts] = useState([]);        // API se fetched saare products
    const [selectedProduct, setSelectedProduct] = useState(
        sessionStorage.getItem("selected_Reward_Product_id") || "" // Session se saved product ID
    );

    // --- CATEGORY FILTER STATES ---
    const [categories, setCategories] = useState([]);    // API se fetched saari categories
    const [selectedCategory, setSelectedCategory] = useState(
        sessionStorage.getItem("selected_Reward_Category_id") || "" // Session se saved category ID
    );

    // --- FILTER HANDLERS ---

    // Jab user Category dropdown se koi category select kare
    const handleCategoryChange = (val) => {
        setSelectedCategory(val);
        sessionStorage.setItem("selected_Reward_Category_id", val);

        // Category change hone par selected product ko reset karte hain
        setSelectedProduct("");
        sessionStorage.removeItem("selected_Reward_Product_id");
        setCurrentPage(1); // Page reset to 1
    };

    // Jab user Product dropdown se koi product select kare
    const handleProductChange = (val) => {
        setSelectedProduct(val);
        sessionStorage.setItem("selected_Reward_Product_id", val);
        setCurrentPage(1);
    };

    // Saare filters (Category, Product, Search) clear karne ke liye
    const resetFilters = () => {
        setSelectedCategory("");
        setSelectedProduct("");
        setSearchText("");
        sessionStorage.removeItem("selected_Reward_Category_id");
        sessionStorage.removeItem("selected_Reward_Product_id");
        setCurrentPage(1);
    };

    // --- DATA FETCHING (API CALLS) ---

    // Images load karne ka main function
    const loadTable = async (page = 1, limit = 5, searchTerm = "", product_id = "") => {
        try {
            let query = "";
            if (product_id) query += `&product_id=${product_id}`;

            // API Fetch call
            const res = await Reward_Product_Image_API.fetchAll(page, limit, searchTerm + query);
            const data = res.data.results || [];
            setRows(data);

            // Pagination calculations
            const stats = calculatePagination(
                res.data,
                page,
                limit,
                data.length
            );
            setPaginationStats(stats);
        } catch (err) {
            console.error("API ERROR", err);
        }
    };

    // Filters ya Pagination badalne par data fetch trigger karna
    useEffect(() => {
        if (selectedProduct) {
            loadTable(currentPage, currentLimit, searchText, selectedProduct);
        } else {
            // Agar product select nahi hai toh rows khali rahegi
            setRows([]);
            setPaginationStats({
                totalRecords: 0,
                startEntry: 0,
                endEntry: 0,
                totalPages: 1,
            });
        }
    }, [currentPage, currentLimit, searchText, selectedProduct]);

    // --- TABLE ACTIONS ---

    // Edit page par navigate karna
    const edit_Image = (id) => {
        sessionStorage.setItem("edit_Reward_Product_Image_id", id);
        navigate("/admin/Edit-Reward-Product-Image");
    };

    // Active status toggle (Inline switch)
    const toggleStatus = async (id) => {
        try {
            const image = rows.find(r => r.id === id);
            const newStatus = !image.is_active;

            // Optimistic UI Update
            setRows(prev => prev.map(r => r.id === id ? { ...r, is_active: newStatus } : r));

            await Reward_Product_Image_API.update_1(id, { is_active: newStatus });

            // Backend se sync rehne ke liye load
            loadTable(currentPage, currentLimit, searchText, selectedProduct);

            setSuccessMsg(`Status updated to ${newStatus ? 'Active' : 'Inactive'} successfully.`);
        } catch (error) {
            console.error("Toggle Status Error:", error);
            loadTable(currentPage, currentLimit, searchText, selectedProduct);
        }
    };

    // Primary Image set karna (Golden Star action)
    const togglePrimary = async (id) => {
        try {
            const image = rows.find(r => r.id === id);
            if (image.is_primary) return;

            setSuccessMsg("Setting as primary...");
            await Reward_Product_Image_API.update_1(id, { is_primary: true });

            // Re-load table to see primary switch effects
            loadTable(currentPage, currentLimit, searchText, selectedProduct);
            setSuccessMsg("Primary image updated successfully.");
        } catch (error) {
            console.error("Primary Toggle Error:", error);
            loadTable(currentPage, currentLimit, searchText, selectedProduct);
        }
    };

    // Image Delete action
    const deleteImage = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product image?");
        if (!confirmDelete) return;

        try {
            await Reward_Product_Image_API.Delete(id);
            setDeletingId(id);
            setTimeout(() => {
                setRows(prev => prev.filter(r => r.id !== id));
                setDeletingId(null);
            }, 500);
            setSuccessMsg("Product image deleted successfully.");
        } catch (err) {
            console.error("Delete Error:", err);
        }
    };

    // --- MESSAGES HANDLING ---

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

    // --- COMPONENT DID MOUNT: FETCH LISTS ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Dropdowns populate karne ke liye data fetching
                const catRes = await Reward_Category_API.fetchAll(1, 1000);
                setCategories(catRes.data.results || []);

                const prodRes = await Reward_Product_API.fetchAll(1, 1000);
                setProducts(prodRes.data.results || []);
            } catch (error) {
                console.error("Fetch Data Error:", error);
            }
        };
        fetchData();
    }, []);

    // Derived State: Selected Category ke base par products filter karna
    const filteredProducts = selectedCategory
        ? products.filter(p => p.category && p.category.id == selectedCategory)
        : products;

    // Display order inline update handler
    const handleOrderChange = async (id, newOrder) => {
        try {
            setRows(prev => prev.map(r => r.id === id ? { ...r, display_order: newOrder } : r));
            await Reward_Product_Image_API.update_1(id, { display_order: newOrder });
            loadTable(currentPage, currentLimit, searchText, selectedProduct);
            setSuccessMsg("Order updated successfully.");
        } catch (error) {
            console.error("Order Update Error:", error);
            loadTable(currentPage, currentLimit, searchText, selectedProduct);
        }
    };

    return (
        <div className="admin-content p-3">
            {/* Header section with Page Title and Filters */}
            <Admin_List_Header
                title="Reward Product Images"
                addButtonText="Add Product Image"
                addButtonLink="/admin/Add-Reward-Product-Image"
                searchText={searchText}
                setSearchText={setSearchText}
                currentLimit={currentLimit}
                setCurrentLimit={setCurrentLimit}
                setCurrentPage={setCurrentPage}
                successMsg={successMsg}
                fadeOut={fadeOut}
                successRef={successRef}
            >
                <div className="d-flex align-items-center flex-wrap gap-2">
                    {/* Category Selection Filter */}
                    <Category_Filter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelect={handleCategoryChange}
                    />

                    {/* Product Selection Filter (Filtered by Category) */}
                    <Reward_Product_Filter
                        products={filteredProducts}
                        selectedProduct={selectedProduct}
                        onSelect={handleProductChange}
                        placeholder={selectedCategory ? "All in Category" : "All Products"}
                    />

                    {/* Filters Reset Button */}
                    {(selectedCategory || selectedProduct || searchText) && (
                        <button
                            className="btn btn-light btn-sm rounded-pill shadow-sm px-3 fw-bold text-danger"
                            onClick={resetFilters}
                            title="Reset All Filters"
                            style={{ height: "38px", border: "1px solid #fee2e2" }}
                        >
                            <i className="fa fa-refresh me-1"></i> Reset
                        </button>
                    )}
                </div>
            </Admin_List_Header>


            {/* Main Table for Data Display */}
            <div className="table-responsive mt-3">
                <form id="load-data" onSubmit={(e) => e.preventDefault()}>
                    <Admin_Table
                        columns={["ID", "Preview", "Product Info", "Type", "Order", "Status", "Created At", "Updated At", "Action"]}
                    >
                        {/* Table data filling via helper function */}
                        {Fatch_Reward_Product_Image_Table(rows, edit_Image, deleteImage, toggleStatus, deletingId, handleOrderChange, togglePrimary)}
                    </Admin_Table>

                    {/* Bottom Pagination Buttons */}
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