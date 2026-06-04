import React, { useEffect, useState } from "react";
import { Reward_Return_Item_API } from "./api";
import { Fetch_Reward_Return_Item_Table } from "./Table";
import { calculatePagination } from "../Pagination/Pagination";
import Admin_List_Header from "../Common Files/Admin_List_Header";
import Admin_Pagination_Buttons from "../Common Files/Admin_Pagination_Buttons";
import Admin_Table from "../Common Files/Admin_Table";

export default function Reward_Return_Items_Admin() {
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

    // Load Data
    const loadTable = async (page = 1, limit = 5, searchTerm = "") => {
        try {
            const res = await Reward_Return_Item_API.fetchAll(page, limit, searchTerm);
            const data = res.data.results || [];
            setRows(data);

            const stats = calculatePagination(
                res.data,
                page,
                limit,
                data.length
            );
            setPaginationStats(stats);
        }
        catch (err) {
            console.error("API ERROR", err);
        }
    };

    useEffect(() => {
        loadTable(currentPage, currentLimit, searchText);
    }, [currentPage, currentLimit, searchText]);

    return (
        <div className="admin-content p-3">
            <Admin_List_Header
                title="Returned Item Details"
                searchText={searchText}
                setSearchText={setSearchText}
                currentLimit={currentLimit}
                setCurrentLimit={setCurrentLimit}
                setCurrentPage={setCurrentPage}
            />

            <div className="table-responsive">
                <form id="load-data" onSubmit={(e) => e.preventDefault()}>
                    <Admin_Table
                        columns={["ID", "Return Number", "Order Number", "Product Details", "Quantity", "Points/Item", "Total Refund Points", "Item Condition"]}
                    >
                        {Fetch_Reward_Return_Item_Table(rows)}
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
