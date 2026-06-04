import React from "react";

const formateStatusBadge = (status) => {
  const statusMap = {
    pending: { bg: "bg-warning", text: "Pending" },
    confirmed: { bg: "bg-info", text: "Confirmed" },
    processing: { bg: "bg-primary", text: "Processing" },
    packed: { bg: "bg-secondary", text: "Packed" },
    shipped: { bg: "bg-dark", text: "Shipped" },
    out_for_delivery: { bg: "bg-info", text: "Out for Delivery" },
    delivered: { bg: "bg-success", text: "Delivered" },
    cancelled: { bg: "bg-danger", text: "Cancelled" },
    returned: { bg: "bg-danger", text: "Returned" },
    failed: { bg: "bg-danger", text: "Failed" },
  };

  const config = statusMap[status] || { bg: "bg-secondary", text: status };
  return <span className={`badge ${config.bg}`}>{config.text}</span>;
};

export function Fetch_Reward_Order_Status_History_Table(rows, edit_History, deleteHistory, deletingId) {

  if (!rows || rows.length === 0) {
    return (
      <tr>
        <td colSpan="8" className="text-center text-muted">
          No Status History Found
        </td>
      </tr>
    );
  }

  return rows.map((u) => (
    <tr key={u.id} className={deletingId === u.id ? "fade-row" : ""}>
      <td>{u.id}</td>
      <td>
        <div className="fw-bold" style={{ fontSize: "12px" }}>ID: #{u.order}</div>
        <div className="text-muted" style={{ fontSize: "11px" }}>{u.order_number}</div>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <div className="avatar-sm me-2 bg-info text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "30px", height: "30px", fontSize: "12px", fontWeight: "bold" }}>
            {u.user_name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="fw-bold" style={{ fontSize: "13px" }}>{u.user_name}</div>
        </div>
      </td>
      <td>
        {formateStatusBadge(u.status)}
      </td>
      <td>
        <div className="Home-description-col" style={{ color: "#f30c0c" }}>
          {u.remarks || "---"}
        </div>
      </td>
      <td>
        {u.changed_by ? (
          <div>
            <div className="d-flex align-items-center">
              <i className="fa fa-user-circle me-1 text-primary"></i>
              <span className="fw-bold" style={{ fontSize: "12px" }}>{u.changed_by.first_name || u.changed_by.username}</span>
            </div>
            <div className="text-muted" style={{ fontSize: "11px", marginLeft: "18px" }}>{u.changed_by.email}</div>
          </div>
        ) : (
          <span className="text-muted small">System</span>
        )}
      </td>
      <td className="Home_Date-col">{u.created_at}</td>

      <td className="text-center">
        <div className="action-btn-group">
          <button
            type="button"
            className="btn btn-primary btn-sm action-btn"
            onClick={() => edit_History(u.id)}
            title="Update Remarks"
          >
            <i className="fa fa-edit"></i>
          </button>
        </div>
      </td>
    </tr>
  ));
}
