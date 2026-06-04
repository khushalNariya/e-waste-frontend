import React, { useEffect, useState, useRef } from "react";
import { Reward_Order_Payment_API } from "./api";
import { Fetch_Reward_Order_Payment_Table } from "./Table";
import { calculatePagination } from "../Pagination/Pagination";
import Admin_List_Header from "../Common Files/Admin_List_Header";
import Admin_Pagination_Buttons from "../Common Files/Admin_Pagination_Buttons";
import Admin_Table from "../Common Files/Admin_Table";

export default function Reward_Order_Payment_admin() {
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

    const loadTable = async (page = 1, limit = 5, searchTerm = "") => {
        try {
            const res = await Reward_Order_Payment_API.fetchAll(page, limit, searchTerm);
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

    useEffect(() => {
        loadTable(currentPage, currentLimit, searchText);
    }, [currentPage, currentLimit, searchText]);

    const deletePayment = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Payment record?");
        if (!confirmDelete) return;

        try {
            await Reward_Order_Payment_API.Delete(id);
            setDeletingId(id);

            setTimeout(() => {
                setRows(prevRows => prevRows.filter(row => row.id !== id));
                setDeletingId(null);
            }, 500);

            setSuccessMsg("Payment record deleted successfully.");
        } catch (error) {
            console.error("Delete Error:", error);
        }
    };

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
                title="Reward Order Payment List"
                searchText={searchText}
                setSearchText={setSearchText}
                currentLimit={currentLimit}
                setCurrentLimit={setCurrentLimit}
                setCurrentPage={setCurrentPage}
                successMsg={successMsg}
                fadeOut={fadeOut}
                successRef={successRef}
            />

            <div className="table-responsive">
                <form id="load-data" onSubmit={(e) => e.preventDefault()}>
                    <Admin_Table
                        columns={["ID", "Order ID", "Method", "Status", "Points", "Money", "Action"]}
                    >
                        {Fetch_Reward_Order_Payment_Table(rows, null, deletePayment, deletingId)}
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
