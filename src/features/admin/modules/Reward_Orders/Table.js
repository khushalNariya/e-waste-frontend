import React from "react";

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

export function Fetch_Reward_Order_Table(rows, edit_Order, deleteOrder, deletingId, handleStatusUpdate) {

  if (!rows || rows.length === 0) {
    return (
      <tr>
        <td colSpan="9" className="text-center text-muted">
          No Data Found
        </td>
      </tr>
    );
  }

  return rows.map((u) => (
    <tr key={u.id} className={deletingId === u.id ? "fade-row" : ""}>
      <td>{u.id}</td>
      <td>
        <span className="badge bg-light text-primary border" style={{ fontSize: "11px", letterSpacing: "1px" }}>
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
            <div className="text-muted d-flex align-items-center" style={{ fontSize: "11px" }}>
               <span className="badge bg-light text-dark border me-2" style={{ fontSize: "9px", padding: "2px 5px" }}>ID: {u.user}</span>
               {u.email}
            </div>
          </div>
        </div>
      </td>
      <td>
        <select
          className={`badge ${statusMap[u.order_status]?.bg || "bg-secondary"}`}
          value={u.order_status}
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
          {u.total_points} Pts
        </div>
      </td>
      <td>
        <span className="badge bg-light text-dark border" style={{ fontSize: "10px" }}>
          Cart: {u.cart_id || "N/A"}
        </span>
      </td>
      <td className="Home_Date-col">{u.delivered_at}</td>
      <td className="Home_Date-col">{u.created_at}</td>

      <td className="text-center">
        <div className="action-btn-group">
          <button
            type="button"
            className="btn btn-danger btn-sm action-btn"
            onClick={() => deleteOrder(u.id)}
            disabled={deletingId === u.id}
            title="Delete Order"
          >
            {deletingId === u.id
              ? <i className="fa fa-spinner fa-spin"></i>
              : <i className="fa fa-trash"></i>
            }
          </button>
        </div>
      </td>
    </tr>
  ));
}
