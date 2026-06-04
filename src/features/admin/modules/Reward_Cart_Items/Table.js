import React from "react";

export function Fetch_Reward_Cart_Items_Table(rows, deleteItem, deletingId) {

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
        <span className="badge bg-dark">#{u.cart}</span>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <div className="avatar-sm me-2 bg-info text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "30px", height: "30px", fontSize: "12px", fontWeight: "bold" }}>
            {u.user_name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <div className="fw-bold" style={{ fontSize: "13px" }}>{u.user_name}</div>
            <div className="text-muted d-flex align-items-center" style={{ fontSize: "11px" }}>
               <span className="badge bg-light text-dark border me-2" style={{ fontSize: "9px", padding: "2px 5px" }}>ID: {u.user_id}</span>
               {u.email}
            </div>
          </div>
        </div>
      </td>
      <td>{u.category_name || "N/A"}</td>
      <td>{u.product_name || "N/A"}</td>
      <td>{u.quantity}</td>
      <td>{u.points}</td>
      <td>{u.subtotal_points}</td>
      <td className="Home_Date-col">{u.created_at}</td>
      <td className="Home_Date-col">{u.updated_at}</td>

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
