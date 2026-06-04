

// ---------------- Pagination Buttons ----------------

export function generatePaginationButtons(currentPage, totalPages) {
    let html = "";

    if (currentPage > 1) {
        html += `<a class="page-link" href="#" id="${currentPage - 1}">« Previous</a>`;
    }

    for (let i = 1; i <= totalPages; i++) {
        const active = currentPage === i ? "active" : "";
        html += `<a class="page-link ${active}" href="#" id="${i}">${i}</a>`;
    }

    if (currentPage < totalPages) {
        html += `<a class="page-link" href="#" id="${currentPage + 1}">Next »</a>`;
    }

    return html;
};

// ---------------- Pagination Stats ----------------
export function calculatePagination(store_data, page, limit, dataLength) {
    let totalRecords = store_data.count || 0;
    let start = totalRecords === 0 ? 0 : (page - 1) * limit + 1;
    let end = totalRecords === 0 ? 0 : Math.min(start + dataLength - 1, totalRecords);
    let totalPages = Math.ceil(totalRecords / limit) || 1;
    return { totalRecords, startEntry: start, endEntry: end, totalPages };
};