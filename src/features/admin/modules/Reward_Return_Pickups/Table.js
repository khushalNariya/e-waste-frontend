import React from "react";

const statusMap = {
  scheduled: { bg: "bg-info", text: "Scheduled" },
  picked_up: { bg: "bg-success", text: "Picked Up" },
  failed: { bg: "bg-danger", text: "Failed" },
  rescheduled: { bg: "bg-warning", text: "Rescheduled" }
};

export function Fetch_Reward_Return_Pickup_Table(rows) {
  if (!rows || rows.length === 0) {
    return (
      <tr>
        <td colSpan="7" className="text-center text-muted">
          No Return Pickups Scheduled
        </td>
      </tr>
    );
  }

  return rows.map((u) => {
    const status = statusMap[u.pickup_status] || { bg: "bg-secondary", text: u.pickup_status };
    const addr = u.address_details || {};

    return (
      <tr key={u.id}>
        <td>{u.id}</td>
        <td>
          <span className="badge bg-light text-primary border" style={{ fontSize: "11px", letterSpacing: "1px" }}>
            {u.return_number || `RET-${u.return_request}`}
          </span>
        </td>
        <td>
          <span className="badge bg-light text-dark border" style={{ fontSize: "11px" }}>
            #{u.order_number || "N/A"}
          </span>
        </td>
        <td>
          <div className="fw-bold" style={{ fontSize: "13px" }}>{u.user_name}</div>
        </td>
        <td>
          <div style={{ fontSize: "12px" }}>
            <div className="fw-bold">{addr.full_name} ({addr.phone})</div>
            <div className="text-muted">
              {addr.address}, {addr.landmark ? `Near ${addr.landmark}, ` : ""}{addr.city}, {addr.state} - {addr.pincode}
            </div>
          </div>
        </td>
        <td>
          <span className={`badge ${status.bg}`} style={{ textTransform: "capitalize" }}>
            {status.text}
          </span>
        </td>
      </tr>
    );
  });
}
