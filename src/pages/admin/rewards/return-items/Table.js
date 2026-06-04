import React from "react";

export function Fetch_Reward_Return_Item_Table(rows) {
  if (!rows || rows.length === 0) {
    return (
      <tr>
        <td colSpan="8" className="text-center text-muted">
          No Returned Items Found
        </td>
      </tr>
    );
  }

  return rows.map((u) => (
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
        <div className="fw-bold text-dark" style={{ fontSize: "13px" }}>{u.product_name}</div>
        <div className="text-muted" style={{ fontSize: "11px" }}>Product ID: {u.product}</div>
      </td>
      <td>{u.quantity}</td>
      <td>
        <span className="text-muted" style={{ fontSize: "12px" }}>{u.points} Pts</span>
      </td>
      <td>
        <div className="fw-bold text-success">
          {u.subtotal_points} Pts
        </div>
      </td>
      <td>
        <span className="badge bg-secondary text-white" style={{ textTransform: "capitalize" }}>
          {(u.item_condition || "wrong_item").replace("_", " ")}
        </span>
      </td>
    </tr>
  ));
}
