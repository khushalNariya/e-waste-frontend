import React from "react";
import { generatePaginationButtons } from "../Pagination/Pagination";

export default function Admin_Pagination_Buttons({
    paginationStats,
    currentPage,
    setCurrentPage
}) {
    return (
        <div className="pagination-container_2 d-flex justify-content-between align-items-center mt-3">

            {/* LEFT SIDE */}
            <div className="entries-info">
                {paginationStats.totalRecords > 0 &&
                    `Showing ${paginationStats.startEntry} to ${paginationStats.endEntry} of ${paginationStats.totalRecords} entries`}
            </div>

            {/* RIGHT SIDE */}
            <div
                id="pagination_2"
                dangerouslySetInnerHTML={{
                    __html: generatePaginationButtons(
                        currentPage,
                        paginationStats.totalPages
                    )
                }}
                onClick={(e) => {
                    e.preventDefault();

                    if (e.target.id) {
                        setCurrentPage(Number(e.target.id));
                    }
                }}
            />
        </div>
    );
}