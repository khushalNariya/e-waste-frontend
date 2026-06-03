import React, { useEffect, useState, useRef } from "react";
import { Reward_Product_API, Reward_Product_Image_API } from "./api";
import { Fatch_Reward_Product_Image_Table } from "./Table";
import { calculatePagination } from "../../shared/Pagination/Pagination";
import { useNavigate } from "react-router-dom";
import Admin_List_Header from "../../shared/common/Admin_List_Header";
import Admin_Pagination_Buttons from "../../shared/common/Admin_Pagination_Buttons";
import Admin_Table from "../../shared/common/Admin_Table";

export default function Reward_Product_Image_admin() {
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

    const [successMsg, setSuccessMsg] = useState("");
    const [fadeOut, setFadeOut] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const successRef = useRef(null);

    // PRODUCT DROPDOWN
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(
        sessionStorage.getItem("selected_Reward_Product_id") || ""
    );

    const handleProductChange = (val) => {
        setSelectedProduct(val);
        sessionStorage.setItem("selected_Reward_Product_id", val);
        setCurrentPage(1);
    };



    // LOAD DATA
    const loadTable = async (page = 1, limit = 5, searchTerm = "", product_id = "") => {
        try {
            let query = "";
            if (product_id) {
                query = `&product_id=${product_id}`;
            }
            const res = await Reward_Product_Image_API.fetchAll(page, limit, searchTerm + query);
            const data = res.data.results || [];
            setRows(data);

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

    useEffect(() => {
        if (selectedProduct) {
            loadTable(currentPage, currentLimit, searchText, selectedProduct);
        } else {
            setRows([]); 
        }
    }, [currentPage, currentLimit, searchText, selectedProduct]);

    // EDIT
    const edit_Image = (id) => {
        sessionStorage.setItem("edit_Reward_Product_Image_id", id);
        navigate("/admin/Edit-Reward-Product-Image");
    };

    // TOGGLE STATUS
    const toggleStatus = async (id) => {
        try {
            const image = rows.find(r => r.id === id);
            const newStatus = !image.is_active;

            // Optimistic Update
            setRows(prev => prev.map(r => r.id === id ? { ...r, is_active: newStatus } : r));

            await Reward_Product_Image_API.update_1(id, { is_active: newStatus });

            // Reload to reflect updated_at from backend
            loadTable(currentPage, currentLimit, searchText, selectedProduct);

            setSuccessMsg(`Status updated to ${newStatus ? 'Active' : 'Inactive'} successfully.`);
        } catch (error) {
            console.error("Toggle Status Error:", error);
            loadTable(currentPage, currentLimit, searchText, selectedProduct);
        }
    };

    // TOGGLE PRIMARY (INLINE)
    const togglePrimary = async (id) => {
        try {
            const image = rows.find(r => r.id === id);

            // If already primary, no need to do anything (there must be one primary)
            if (image.is_primary) return;

            setSuccessMsg("Setting as primary...");

            await Reward_Product_Image_API.update_1(id, { is_primary: true });

            // Must reload because this affects OTHER rows (primary switches to this one)
            loadTable(currentPage, currentLimit, searchText, selectedProduct);

            setSuccessMsg("Primary image updated successfully.");
        } catch (error) {
            console.error("Primary Toggle Error:", error);
            loadTable(currentPage, currentLimit, searchText, selectedProduct);
        }
    };

    // DELETE
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

    // Messages
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




    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await Reward_Product_API.fetchAll(1, 1000);
                setProducts(res.data.results || []);
            } catch (error) {
                console.error("Fetch Products Error:", error);
            }
        };
        fetchProducts();
    }, []);



    // HANDLE ORDER CHANGE (INLINE)
    const handleOrderChange = async (id, newOrder) => {
        try {
            // Optimistic Update
            setRows(prev => prev.map(r => r.id === id ? { ...r, display_order: newOrder } : r));

            await Reward_Product_Image_API.update_1(id, { display_order: newOrder });

            // Reload to reflect shifting side-effects from backend
            loadTable(currentPage, currentLimit, searchText, selectedProduct);

            setSuccessMsg("Order updated successfully.");
        } catch (error) {
            console.error("Order Update Error:", error);
            loadTable(currentPage, currentLimit, searchText, selectedProduct);
        }
    };

    return (
        <div className="admin-content p-3">
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
            />



            {/* 🚀 PREMIUM FILTER SECTION */}
            <div className="filter-card mt-4 mb-4 p-3 shadow-sm" style={{
                background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                gap: "20px",
                flexWrap: "wrap"
            }}>
                <div className="filter-icon" style={{
                    width: "45px",
                    height: "45px",
                    background: "#eff6ff",
                    borderRadius: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#3b82f6",
                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)"
                }}>
                    <i className="fa fa-filter fs-5"></i>
                </div>
                
                <div style={{ flex: 1, minWidth: "200px" }}>
                    <h6 className="mb-0 fw-bold text-dark">Filter by Product</h6>
                    <small className="text-muted">Your selection is saved even after editing!</small>
                </div>

                <div className="filter-select-wrapper" style={{ minWidth: "280px", position: "relative" }}>
                    <select
                        className="form-select border-0 shadow-sm ps-4"
                        style={{
                            height: "48px",
                            borderRadius: "14px",
                            background: "#ffffff",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#475569",
                            cursor: "pointer",
                            appearance: "none",
                            transition: "all 0.3s ease",
                            border: "1px solid #f1f5f9"
                        }}
                        value={selectedProduct}
                        onChange={(e) => handleProductChange(e.target.value)}
                        onFocus={(e) => e.target.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.1)"}
                        onBlur={(e) => e.target.style.boxShadow = "none"}
                    >
                        <option value="">✨ Select Product</option>
                        {products.map((p) => (
                            <option key={p.id} value={p.id}>📦 {p.name}</option>
                        ))}
                    </select>
                    <i className="fa fa-chevron-down position-absolute" style={{
                        right: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                        fontSize: "12px",
                        color: "#94a3b8"
                    }}></i>
                </div>
            </div>

            <div className="table-responsive mt-3">
                <form id="load-data" onSubmit={(e) => e.preventDefault()}>
                    <Admin_Table
                        columns={["ID", "Preview", "Product Info", "Type", "Order", "Status", "Created At", "Updated At", "Action"]}
                    >
                        {Fatch_Reward_Product_Image_Table(rows, edit_Image, deleteImage, toggleStatus, deletingId, handleOrderChange, togglePrimary)}
                    </Admin_Table>

                    <Admin_Pagination_Buttons
                        paginationStats={paginationStats}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </form>
            </div>
        </div>
    );
}
