import React from "react";

export function Fetch_Reward_Order_Items_Table(rows, edit_Item, deleteItem, deletingId) {

  if (!rows || rows.length === 0) {
    return (
      <tr>
        <td colSpan="8" className="text-center text-muted">
          No Data Found
        </td>
      </tr>
    );
  }

  return rows.map((u) => (
    <tr key={u.id} className={deletingId === u.id ? "fade-row" : ""}>
      <td>{u.id}</td>
      <td>
        <span className="badge bg-light text-primary border" style={{ fontSize: "11px" }}>
          Order ID: {u.order}
        </span>
      </td>
      <td>
        <div className="fw-bold" style={{ fontSize: "14px" }}>
          {u.product_name}
        </div>
        <div className="text-muted" style={{ fontSize: "11px" }}>
          Product ID: {u.product_id}
        </div>
      </td>
      <td>
        <span className="badge bg-info text-white">
          Qty: {u.quantity}
        </span>
      </td>
      <td>{u.points} Pts</td>
      <td className="fw-bold text-success">{u.subtotal_points} Pts</td>
      <td className="Home_Date-col">{u.created_at}</td>

      <td className="text-center">
        <div className="action-btn-group">
          <button
            type="button"
            className="btn btn-danger btn-sm action-btn"
            onClick={() => deleteItem(u.id)}
            disabled={deletingId === u.id}
            title="Delete Item"
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
