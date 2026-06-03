import React from "react";

export function Fetch_EWaste_Submission_Table(rows, editRow, deleteRow, deletingId) {
    if (!rows || rows.length === 0) {
        return (
            <tr>
                <td colSpan="15" className="text-center text-muted">No Submissions Found</td>
            </tr>
        );
    }

    return rows.map((u) => (
        <tr key={u.submission_id} className={deletingId === u.submission_id ? "fade-row" : ""}>
            <td>{u.submission_id}</td>
            <td>{u.user_id}</td>
            <td>{u.brand} - {u.model_name}</td>
            <td>{u.category}</td>
            <td>{u.condition_type}</td>
            <td>{u.pickup_type}</td>
            <td>{u.facility}</td>
            <td>{u.phone_number}</td>
            <td><span className={`badge bg-${u.current_status === 'Completed' ? 'success' : 'warning'}`}>{u.current_status}</span></td>
            <td>{u.created_at}</td>
            <td className="text-center">
                <div className="action-btn-group">
                    <button className="btn btn-primary btn-sm" onClick={() => editRow(u.submission_id)}><i className="fa fa-edit"></i></button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteRow(u.submission_id)} disabled={deletingId === u.submission_id}>
                        {deletingId === u.submission_id ? <i className="fa fa-spinner fa-spin"></i> : <i className="fa fa-trash"></i>}
                    </button>
                </div>
            </td>
        </tr>
    ));
}

export function Fetch_EWaste_Status_History_Table(rows, editRow, deleteRow, deletingId) {
    if (!rows || rows.length === 0) {
        return (
            <tr>
                <td colSpan="7" className="text-center text-muted">No Status History Found</td>
            </tr>
        );
    }

    return rows.map((u) => (
        <tr key={u.id} className={deletingId === u.id ? "fade-row" : ""}>
            <td>{u.id}</td>
            <td>{u.submission}</td>
            <td>{u.status_label}</td>
            <td>{u.update_date}</td>
            <td>{u.update_time}</td>
            <td>{u.remarks}</td>
            <td className="text-center">
                <div className="action-btn-group">
                    <button className="btn btn-primary btn-sm" onClick={() => editRow(u.id)}><i className="fa fa-edit"></i></button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteRow(u.id)} disabled={deletingId === u.id}>
                        {deletingId === u.id ? <i className="fa fa-spinner fa-spin"></i> : <i className="fa fa-trash"></i>}
                    </button>
                </div>
            </td>
        </tr>
    ));
}
