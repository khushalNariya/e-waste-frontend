export function Fatch_Reward_Product_Table(rows, edit_Users, deleteProduct, toggleStatus, deletingId) {

  if (!rows || rows.length === 0) {
    return (
      <tr>
        <td colSpan="16" className="text-center text-muted">
          No Data Found
        </td>
      </tr>
    );
  }

  return rows.map((u) => (
    <tr key={u.id} className={deletingId === u.id ? "fade-row" : ""}>
      <td>{u.id}</td>
      <td>{u.name}</td>
      <td>{u.slug}</td>
      <td>{u.category ? u.category.name : "N/A"}</td>
      <td>{u.points}</td>
      <td>{u.stock}</td>
      <td><div className="Home-description-col">
        {u.description}</div></td>
      <td><div className="Home-description-col">
        {u.terms}</div></td>
      <td>{u.tag}</td>
      <td>{u.delivery_days}</td>

      {/* rating */}
      <td>
        <div className="rating-badge-premium">
          <i className="fa fa-star"></i>
          <span>{u.rating}</span>
        </div>
      </td>

      {/* total-redeemed */}
      <td>{u.total_redeemed}</td>

      {/* is_Active */}
      <td className="text-center">
        <div
          className="premium-switch-container"
          onClick={() => toggleStatus(u.id)}
          title={u.is_active ? "Switch Off" : "Switch On"}
        >
          <div className={`premium-switch ${u.is_active ? "active" : ""}`}>
            <div className="switch-handle"></div>
            <span className="switch-text text-active">Active</span>
            <span className="switch-text text-inactive">Inactive</span>
          </div>
        </div>
      </td>

      {/* created_at */}
      <td className="Home_Date-col">{u.created_at}</td>
      {/* updated_at */}
      <td className="Home_Date-col">{u.updated_at}</td>

      <td className="text-center">
        <div className="action-btn-group">

          <button
            type="button"
            className="btn btn-primary btn-sm action-btn"
            onClick={() => edit_Users(u.id)}
            title="Edit Product"
          >
            <i className="fa fa-edit"></i>
          </button>

          <button
            type="button"
            className="btn btn-danger btn-sm action-btn"
            onClick={() => deleteProduct(u.id)}
            disabled={deletingId === u.id}
            title="Delete Product"
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