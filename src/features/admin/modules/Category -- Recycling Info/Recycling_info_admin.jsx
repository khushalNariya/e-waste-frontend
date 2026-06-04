import React, { useEffect, useState, useRef } from "react";
import { Recycling_info_API } from "./api";
import { Fatch_Recycling_info_Table } from "./Table";
import { calculatePagination, generatePaginationButtons } from "../Pagination/Pagination";
import { useNavigate } from "react-router-dom";


export default function Recycling_info_admin() {
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
            const res = await Recycling_info_API.fetchAll(page, limit, searchTerm);

            const data_2 = res.data.results || [];

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
        sessionStorage.setItem("edit_user_id", id);
        navigate("/admin/Edit-Category-Recycling-Info");
    };

    // ---------------- DELETE ----------------
    const deleteUsers = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this Brand - Name ?"
        );

        if (!confirmDelete) return;

        try {
            await Recycling_info_API.Delete(id);   // ✅ API call

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


            setSuccessMsg("Category / Recycling - Info deleted successfully.");

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
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="fw-bold">Category / Recycling - Info List</h4>

                    <button
                        className="btn btn-success btn-sm"
                        onClick={() => navigate("/admin/Add-Category-Recycling-Info")}
                    >
                        <i className="fa fa-plus me-1"></i> Add Category / Recycling - Info
                    </button>
                </div>
                {/* <!-- Flash message after Parking_Duration (Add , Edit) --> */}
                {successMsg && (
                    <div ref={successRef} id="success-alert" className={`alert alert-success ${fadeOut ? "fade-out" : ""
                        }`}>
                        {successMsg}
                    </div>
                )
                }

                {/* SEARCH + PAGE SIZE */}
                <div className="d-flex justify-content-between align-items-center mb-2">

                    {/* LEFT: ENTRIES DROPDOWN */}
                    <div className="d-flex align-items-center">
                        <label className="me-2">Show:</label>

                        <select
                            id="entries-dropdown"
                            className="form-select form-select-sm me-3"
                            value={currentLimit}
                            onChange={(e) => {
                                setCurrentLimit(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    {/* RIGHT: LIVE SEARCH */}
                    <div className="d-flex align-items-center" style={{ position: "relative" }}>
                        <label className="me-2">Search :</label>

                        <div className="search-wrapper">
                            <input
                                type="text"
                                id="live-search"
                                autoComplete="off"
                                placeholder="Search User..."
                                value={searchText}
                                onChange={(e) => {
                                    setSearchText(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />

                            {/* CLEAR BUTTON */}
                            {searchText && (
                                <span
                                    id="clear-search"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        setSearchText("");
                                        setCurrentPage(1);
                                    }}
                                >
                                    X
                                </span>
                            )}
                        </div>

                    </div>

                </div>

                {/* TABLE */}
                {/* https://icons.getbootstrap.com/ */}
                <div className="table-responsive">
                    <form id="load-data" onSubmit={(e) => e.preventDefault()}>

                        <table className="Home-table table table-bordered table-hover ">

                            <thead className="table-success">
                                <tr>

                                    <th>Id</th>
                                    <th>Category / Title</th>
                                    <th>Description</th>
                                    <th>Process</th>
                                    <th>Instruction</th>
                                    <th>Benefits</th>
                                    <th>Button Text</th>
                                    <th>Icon</th>
                                    <th>Created Date</th>
                                    <th>Updated Date</th>
                                    <th>Action</th>

                                    {/* <th>Creat At</th>
                                    <th>Update At</th>
                                    {/* {user_type === "Master" && <th>Action</th>} */}
                                </tr>
                            </thead>

                            <tbody>
                                {Fatch_Recycling_info_Table(rows, edit_Users, deleteUsers, deletingId)}
                            </tbody>

                        </table>
                        {/* PAGINATION */}
                        <div className="pagination-container_2 d-flex justify-content-between align-items-center mt-3">

                            {/* LEFT SIDE — Showing Entries Info */}
                            <div className="entries-info">
                                {paginationStats.totalRecords > 0 &&
                                    `Showing ${paginationStats.startEntry} to ${paginationStats.endEntry} of ${paginationStats.totalRecords} entries`}
                            </div>

                            {/* RIGHT SIDE — Page Buttons */}
                            <div
                                id="pagination_2"
                                dangerouslySetInnerHTML={{
                                    __html: generatePaginationButtons(
                                        currentPage,
                                        paginationStats.totalPages
                                    )
                                }}
                                onClick={(e) => {
                                    e.preventDefault(); // stop # in URL

                                    if (e.target.id) {
                                        setCurrentPage(Number(e.target.id));
                                    }
                                }}
                            >
                                {/* buttons injected here */}
                            </div>
                        </div>

                    </form>
                </div>
            </>



        </div>

    );

}
