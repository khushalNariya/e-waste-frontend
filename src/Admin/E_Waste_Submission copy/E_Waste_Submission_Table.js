export function Fatch_E_Waste_Submission_Table(rows, edit_Users, deleteCategory, deletingId) {

  if (!rows || rows.length === 0) {
    return (
      <tr>
        <td colSpan="17" className="text-center text-muted">
          No Data Found
        </td>
      </tr>
    );
  }

  return rows.map((u) => (
    <tr key={u.id} className={deletingId === u.id ? "fade-row" : ""}>
      <td>{u.id}</td>
      <td>{u.user_name}</td>
      <td>{u.category?.title}</td>
      <td>{u.category_brand_mapping?.name}</td>
      <td>{u.model?.model_name}</td>
      <td>{u.user_condition?.display_name}</td>
      <td>{u.final_condition?.display_name}</td>

      <td>{u.pickup_type === "pickup" ? "Pickup" : "Dropoff"}</td>

      <td>{u.facility?.name}</td>
      <td className="Home-description-col">{u.address}</td>
      <td>{u.pickup_date} / {u.pickup_time}</td>
      <td>{u.phone}</td>

      <td>{u.notes}</td>

      <td>
        {u.status === "Requested"
          ? <span className="badge bg-warning">{u.status}</span>
          : u.status === "Accepted" || u.status === "Completed"
            ? <span className="badge bg-success">{u.status}</span>
            : <span className="badge bg-danger">{u.status}</span>
        }
      </td>

      <td className="Home_Date-col">{u.created_at}</td>
      <td className="Home_Date-col">{u.updated_at}</td>

      <td className="text-center">
        <div className="action-btn-group">

          <button
            type="button"

            className="btn btn-primary btn-sm action-btn"
            onClick={() => edit_Users(u.id)}
            title="Edit User"
          >
            <i className="fa fa-edit"></i>
          </button>

          <button
            type="button"

            className="btn btn-danger btn-sm action-btn"
            onClick={() => deleteCategory(u.id)}
            disabled={deletingId === u.id}
            title="Delete User"
          >
            {deletingId === u.id
              ? <i className="fa fa-spinner fa-spin"></i>
              : <i className="fa fa-trash"></i>
            }
          </button>

        </div>
      </td>

      {/* )} */}

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