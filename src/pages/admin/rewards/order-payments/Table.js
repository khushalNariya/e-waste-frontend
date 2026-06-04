import React from "react";

export function Fetch_Reward_Order_Payment_Table(rows, edit_Payment, deletePayment, deletingId) {

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
        <span className="badge bg-light text-primary border" style={{ fontSize: "11px" }}>
          Order ID: {u.order}
        </span>
      </td>
      <td>
        <span className="badge bg-info text-white">
          {u.payment_method}
        </span>
      </td>
      <td>
        <span className={`badge ${u.payment_status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
          {u.payment_status?.toUpperCase()}
        </span>
      </td>
      <td className="fw-bold text-success">{u.amount_points} Pts</td>
      <td className="fw-bold">₹{u.amount_money}</td>

      <td className="text-center">
        <div className="action-btn-group">
          <button
            type="button"
            className="btn btn-danger btn-sm action-btn"
            onClick={() => deletePayment(u.id)}
            disabled={deletingId === u.id}
            title="Delete Payment"
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
