import React from "react";

const statusMap = {
  requested: { bg: "bg-warning", text: "Requested" },
  approved: { bg: "bg-info", text: "Approved" },
  pickup_scheduled: { bg: "bg-primary", text: "Pickup Scheduled" },
  picked_up: { bg: "bg-secondary", text: "Picked Up" },
  received: { bg: "bg-dark", text: "Received" },
  inspected: { bg: "bg-info", text: "Inspected" },
  refund_approved: { bg: "bg-warning", text: "Refund Approved" },
  refunded: { bg: "bg-success", text: "Refunded" },
  rejected: { bg: "bg-danger", text: "Rejected" },
};

export function Fetch_Reward_Return_Request_Table(rows, deleteRequest, deletingId, handleStatusUpdate, viewDetails) {
  if (!rows || rows.length === 0) {
    return (
      <tr>
        <td colSpan="8" className="text-center text-muted">
          No Return Requests Found
        </td>
      </tr>
    );
  }

  return rows.map((u) => (
    <tr key={u.id} className={deletingId === u.id ? "fade-row" : ""}>
      <td>{u.id}</td>
      <td>
        <span className="badge bg-light text-primary border" style={{ fontSize: "11px", letterSpacing: "1px" }}>
          {u.return_number}
        </span>
      </td>
      <td>
        <span className="badge bg-light text-dark border" style={{ fontSize: "11px" }}>
          #{u.order_number}
        </span>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <div className="avatar-sm me-2 bg-info text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "30px", height: "30px", fontSize: "12px", fontWeight: "bold" }}>
            {u.user_name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <div className="fw-bold" style={{ fontSize: "13px" }}>{u.user_name}</div>
          </div>
        </div>
      </td>
      <td>
        <select
          className={`badge ${statusMap[u.return_status]?.bg || "bg-secondary"}`}
          value={u.return_status}
          onChange={(e) => handleStatusUpdate(u.id, e.target.value)}
          style={{
            border: "none",
            color: "white",
            cursor: "pointer",
            fontWeight: "600",
            padding: "5px 30px 5px 15px",
            borderRadius: "20px",
            width: "auto",
            minWidth: "160px",
            textAlign: "center",
            textAlignLast: "center",
            fontSize: "12px",
            outline: "none",
            display: "inline-block",
            appearance: "none",
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
            backgroundSize: "18px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease",
          }}
        >
          {Object.entries(statusMap).map(([key, value]) => (
            <option
              key={key}
              value={key}
              style={{
                background: "white",
                color: "black",
                padding: "10px",
                fontSize: "13px",
              }}
            >
              {value.text}
            </option>
          ))}
        </select>
      </td>
      <td>
        <div className="fw-bold text-success">
          {u.refund_points} Pts
        </div>
      </td>
      <td className="Home_Date-col">{u.created_at}</td>
      <td className="text-center">
        <div className="action-btn-group">
          <button
            type="button"
            className="btn btn-info btn-sm action-btn me-1 text-white"
            onClick={() => viewDetails(u)}
            title="View Details"
          >
            <i className="fa fa-eye"></i>
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm action-btn"
            onClick={() => deleteRequest(u.id)}
            disabled={deletingId === u.id}
            title="Delete Request"
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
  ));
}
