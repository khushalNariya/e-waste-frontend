import React, { useEffect, useState, useRef } from "react";
import { Reward_Transactions_API } from "./api";
import { Fatch_Reward_Transactions_Table } from "./Table";
import { calculatePagination } from "../../shared/Pagination/Pagination";
import Admin_List_Header from "../../shared/common/Admin_List_Header";
import Admin_Pagination_Buttons from "../../shared/common/Admin_Pagination_Buttons";
import Admin_Table from "../../shared/common/Admin_Table";

export default function Reward_Transactions_Admin() {
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
    const successRef = useRef(null);

    // LOAD DATA
    const loadTable = async (page = 1, limit = 10, searchTerm = "") => {
        try {
            const res = await Reward_Transactions_API.fetchAll(page, limit, searchTerm);
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
                <Admin_List_Header
                    title="Reward Transactions List"
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
                />

                <div className="table-responsive">
                    <form id="load-data" onSubmit={(e) => e.preventDefault()}>
                        <Admin_Table
                            columns={["ID", "User", "Submission ID", "Points", "Type", "Description", "Created At"]}
                        >
                            {Fatch_Reward_Transactions_Table(rows, null, null)}
                        </Admin_Table>

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
