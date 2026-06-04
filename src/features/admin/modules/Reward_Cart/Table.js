import React from "react";

export function Fetch_Reward_Cart_Table(rows, edit_Cart, deleteCart, deletingId) {

  if (!rows || rows.length === 0) {
    return (
      <tr>
        <td colSpan="7" className="text-center text-muted">
          No Data Found
        </td>
      </tr>
    );
  }

  return rows.map((u) => (
    <tr key={u.id} className={deletingId === u.id ? "fade-row" : ""}>
      <td>{u.id}</td>
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
        <span className={`badge ${u.status === 'active' ? 'bg-success' : u.status === 'checked_out' ? 'bg-primary' : 'bg-secondary'}`}>
          {u.status}
        </span>
      </td>
      <td>{u.total_points}</td>
      <td className="Home_Date-col">{u.created_at}</td>
      <td className="Home_Date-col">{u.updated_at}</td>

      <td className="text-center">
        <div className="action-btn-group">
          {/* <button
            type="button"
            className="btn btn-primary btn-sm action-btn"
            onClick={() => edit_Cart(u.id)}
            title="Edit Cart"
          >
            <i className="fa fa-edit"></i>
          </button> */}

          <button
            type="button"
            className="btn btn-danger btn-sm action-btn"
            onClick={() => deleteCart(u.id)}
            disabled={deletingId === u.id}
            title="Delete Cart"
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
