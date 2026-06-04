import React from "react";

export function Fetch_Reward_Replace_Item_Table(rows) {
    if (!rows || rows.length === 0) {
        return (
            <tr>
                <td colSpan="8" className="text-center text-muted">
                    No Replace Items Found
                </td>
            </tr>
        );
    }

    return rows.map((u) => (
        <tr key={u.id}>
            <td>{u.id}</td>
            <td>
                <span className="badge bg-light text-primary border" style={{ fontSize: "11px", letterSpacing: "1px" }}>
                    {u.replace_number || `REQ-${u.replace_request}`}
                </span>
            </td>
            <td>
                <span className="badge bg-light text-dark border" style={{ fontSize: "11px" }}>
                    #{u.order_number || "N/A"}
                </span>
            </td>
            <td>
                <div className="fw-bold" style={{ fontSize: "13px" }}>{u.product_name}</div>
                {u.replacement_product_name && (
                    <div className="text-success small mt-1">
                        <i className="fa fa-arrow-right me-1"></i>Replace with: {u.replacement_product_name}
                    </div>
                )}
            </td>
            <td className="text-center">
                <span className="badge bg-primary text-white">{u.quantity}</span>
            </td>
            <td className="text-muted">
                {u.points} Pts
            </td>
            <td className="fw-bold text-success">
                {u.subtotal_points} Pts
            </td>
            <td>
                <span className="badge bg-secondary text-white" style={{ fontSize: "11px" }}>
                    {u.item_condition?.replace("_", " ") || "N/A"}
                </span>
            </td>
        </tr>
    ));
}
