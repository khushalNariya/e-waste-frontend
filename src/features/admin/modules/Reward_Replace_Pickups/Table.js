import React from "react";

const pickupStatusMap = {
    scheduled:  { bg: "bg-primary",   text: "Scheduled" },
    picked_up:  { bg: "bg-success",   text: "Picked Up" },
    failed:     { bg: "bg-danger",    text: "Failed" },
    rescheduled:{ bg: "bg-warning",   text: "Rescheduled" },
    delivered:  { bg: "bg-info",      text: "Delivered" },
};

export function Fetch_Reward_Replace_Pickup_Table(rows) {
    if (!rows || rows.length === 0) {
        return (
            <tr>
                <td colSpan="6" className="text-center text-muted">
                    No Replace Pickups Found
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
                <div className="fw-bold" style={{ fontSize: "13px" }}>{u.user_name || "N/A"}</div>
            </td>
            <td style={{ fontSize: "12px" }}>
                {u.address_details ? (
                    <div>
                        <div className="fw-bold">{u.address_details.full_name}</div>
                        <div className="text-muted">
                            {u.address_details.address},
                            {u.address_details.landmark ? ` Near ${u.address_details.landmark},` : ""}
                            {" "}{u.address_details.city}, {u.address_details.state} - {u.address_details.pincode}
                        </div>
                        <div className="text-muted">📞 {u.address_details.phone}</div>
                    </div>
                ) : (
                    <span className="text-muted">No address</span>
                )}
            </td>
            <td>
                <span className={`badge ${pickupStatusMap[u.pickup_status]?.bg || "bg-secondary"} text-white`} style={{ fontSize: "11px", padding: "5px 12px", borderRadius: "20px" }}>
                    {pickupStatusMap[u.pickup_status]?.text || u.pickup_status}
                </span>
                {u.courier_name && (
                    <div className="text-muted small mt-1">{u.courier_name} • {u.tracking_number}</div>
                )}
            </td>
        </tr>
    ));
}
