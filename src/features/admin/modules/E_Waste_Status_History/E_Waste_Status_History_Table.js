const formateStatusBadge = (status) => {
  const statusMap = {
    requested: { bg: "bg-warning", text: "Requested" },
    picked_up_dropped_off: { bg: "bg-info", text: "Picked Up/Dropped Off" },
    evaluating: { bg: "bg-primary", text: "Evaluating" },
    recycled: { bg: "bg-success", text: "Recycled" },
    rewarded: { bg: "bg-success", text: "Rewarded" },
    rejected: { bg: "bg-danger", text: "Rejected" },
  };

  const config = statusMap[status] || { bg: "bg-secondary", text: status };
  return <span className={`badge ${config.bg}`}>{config.text}</span>;
};

export function Fatch_E_Waste_Status_History_Table(rows, edit_Users, deleteCategory, deletingId) {


  if (!rows || rows.length === 0) {
    return (
      <tr>
        <td colSpan="12" className="text-center text-muted">
          No Status History Found
        </td>
      </tr>
    );
  }

  return rows.map((u) => (
    <tr key={u.id} className={deletingId === u.id ? "fade-row" : ""}>
      <td>{u.id}</td>
      <td>
        <span className="badge bg-dark">#{u.submission}</span>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <div className="avatar-sm me-2 bg-info text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "30px", height: "30px", fontSize: "12px" }}>
            {u.user?.first_name?.[0].toUpperCase()}
          </div>
          <div>
            <div className="fw-bold" style={{ fontSize: "13px" }}>{u.user?.first_name} {u.user?.last_name}</div>
          </div>
        </div>
      </td>
      <td>{u.product?.category}</td>
      <td>{u.product?.brand}</td>
      <td>{u.product?.name}</td>
      <td>
        {formateStatusBadge(u.status)}
      </td>
      {/* <td>
        <div style={{ maxWidth: "200px", fontSize: "20px", color: "#f30c0cff" }} className="text-truncate" title={u.remarks}>
          {u.remarks || "---"}
        </div>
      </td> */}
      <td>
        <div className="Home-description-col" style={{ color: "#f30c0cff" }}>
          {u.remarks || "---"}
        </div>
      </td>
      <td>
        {u.image ? (
          <img
            src={u.image}
            alt="E-waste"
            width="50"
            height="50"
            style={{ borderRadius: "8px", objectFit: "cover", border: "1px solid #eee" }}
          />
        ) : (
          <span className="text-muted small">No Image</span>
        )}
      </td>
      <td>
        {u.changed_by ? (
          <div className="d-flex align-items-center">
             <i className="fa fa-user-circle me-1 text-primary"></i>
             <span style={{ fontSize: "12px" }}>{u.changed_by.first_name}</span>
          </div>
        ) : (
          <span className="text-muted small">System</span>
        )}
      </td>
      <td className="Home_Date-col">{u.created_at}</td>

      <td className="text-center">
        <div className="action-btn-group">
          <button
            type="button"
            className="btn btn-primary btn-sm action-btn"
            onClick={() => edit_Users(u.id)}
            title="Update Remarks"
          >
            <i className="fa fa-edit"></i>
          </button>
        </div>
      </td>
    </tr>
  ));
}



// // ======================================================================================================
// // ======================================================================================================
// // ======================================================================================================

// export function Fatch_Home_Hero_Image(rows, user_type, edit_Users, deleteCategory, deletingId) {

//   if (!rows || rows.length === 0) {
//     return (
//       <tr>
//         <td colSpan="6" className="text-center text-muted">
//           No Data Found
//         </td>
//       </tr>
//     );
//   }

//   return rows.map((u) => (
//     <tr key={u.id} className={deletingId === u.id ? "fade-row" : ""}>
//       <td>{u.id}</td>
//       <td>
//         {u.image && (
//           <img
//             src={u.image}
//             width="100"
//             alt=""
//           />
//         )}
//       </td>
//       <td className="text-center">
//         {u.is_active
//           ? <span className="badge bg-success">Yes</span>
//           : <span className="badge bg-secondary">No</span>
//         }
//       </td>
//       <td className="Home_Date-col">{u.created_at}</td>
//       <td className="Home_Date-col">{u.updated_at}</td>

//       <td className="text-center">
//         <div className="action-btn-group">

//           <button
//             type="button"

//             className="btn btn-primary btn-sm action-btn"
//             onClick={() => edit_Users(u.id)}
//             title="Edit User"
//           >
//             <i className="fa fa-edit"></i>
//           </button>

//           <button
//             type="button"

//             className="btn btn-danger btn-sm action-btn"
//             onClick={() => deleteCategory(u.id)}
//             disabled={deletingId === u.id}
//             title="Delete User"
//           >
//             {deletingId === u.id
//               ? <i className="fa fa-spinner fa-spin"></i>
//               : <i className="fa fa-trash"></i>
//             }
//           </button>

//         </div>
//       </td>

//       {/* )} */}

//     </tr>
//   ));
// }