import React from "react";

export function Fetch_Reward_Order_Address_Table(rows, edit_Address, deleteAddress, deletingId) {

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
        <div className="fw-bold">{u.full_name}</div>
        <div className="text-muted" style={{ fontSize: "12px" }}>{u.phone}</div>
      </td>
      <td>
        <div style={{ maxWidth: "200px", fontSize: "12px" }} className="text-truncate" title={u.address}>
          {u.address}
        </div>
      </td>
      <td>{u.city}</td>
      <td>{u.state}</td>
      <td>{u.pincode}</td>

      <td className="text-center">
        <div className="action-btn-group">
          <button
            type="button"
            className="btn btn-danger btn-sm action-btn"
            onClick={() => deleteAddress(u.id)}
            disabled={deletingId === u.id}
            title="Delete Address"
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
