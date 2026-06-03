import React from "react";

const statusMap = {
    requested:               { bg: "bg-warning",   text: "Requested" },
    approved:                { bg: "bg-info",      text: "Approved" },
    replacement_dispatched:  { bg: "bg-primary",   text: "Replacement Dispatched" },
    replacement_delivered:   { bg: "bg-secondary", text: "Replacement Delivered" },
    rejected:                { bg: "bg-danger",    text: "Rejected" },
};

export function Fetch_Reward_Replace_Status_History_Table(rows, deleteHistory, deletingId) {
    if (!rows || rows.length === 0) {
        return (
            <tr>
                <td colSpan="8" className="text-center text-muted">
                    No Status History Found
                </td>
            </tr>
        );
    }

    return rows.map((u) => {
        const status = statusMap[u.status] || { bg: "bg-secondary", text: u.status };
        
        // Safely extract the administrator/changed_by name
        const changedByName = u.changed_by 
            ? `${u.changed_by.first_name || ""} ${u.changed_by.last_name || ""}`.trim() || "Admin" 
            : "System";

        return (
            <tr key={u.id} className={deletingId === u.id ? "fade-row" : ""}>
                <td>{u.id}</td>
                <td>
                    <span className="badge bg-light text-primary border" style={{ fontSize: "11px", letterSpacing: "1px" }}>
                        {u.replace_number || `REQ-${u.replace_request}`}
                    </span>
                </td>
                <td>
                    {u.user ? (
                        <div className="d-flex align-items-center">
                            <div className="avatar-sm me-2 bg-warning text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "30px", height: "30px", fontSize: "12px", fontWeight: "bold" }}>
                                {(u.user.first_name || "U")[0].toUpperCase()}
                            </div>
                            <div className="fw-bold" style={{ fontSize: "13px" }}>
                                {u.user.first_name} {u.user.last_name}
                            </div>
                        </div>
                    ) : (
                        <span className="text-muted">---</span>
                    )}
                </td>
                <td>
                    <span className={`badge ${status.bg}`} style={{ textTransform: "capitalize" }}>
                        {status.text}
                    </span>
                </td>
                <td>
                    <div className="Home-description-col text-muted" style={{ fontSize: "12px" }}>
                        {u.remarks || "No remarks entered"}
                    </div>
                </td>
                <td>
                    <div className="d-flex align-items-center">
                        <i className="fa fa-user-circle me-1 text-primary"></i>
                        <span className="fw-bold" style={{ fontSize: "12px" }}>{changedByName}</span>
                    </div>
                </td>
                <td className="Home_Date-col">{u.created_at || u.changed_at}</td>
                <td className="text-center">
                    <div className="action-btn-group">
                        <button
                            type="button"
                            className="btn btn-danger btn-sm action-btn"
                            onClick={() => deleteHistory(u.id)}
                            disabled={deletingId === u.id}
                            title="Delete History Record"
                        >
                            {deletingId === u.id ? (
                                <i className="fa fa-spinner fa-spin"></i>
                            ) : (
                                <i className="fa fa-trash"></i>
                            )}
                        </button>
                    </div>
                </td>
            </tr>
        );
    });
}
