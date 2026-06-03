export function Fatch_Users_Table(rows, user_type, edit_Users, deleteCategory, deletingId) {

  if (!rows || rows.length === 0) {
    return (
      <tr>
        <td colSpan="14" className="text-center text-muted">
          No Data Found
        </td>
      </tr>
    );
  }

  return rows.map((u) => (
    <tr key={u.id} className={deletingId === u.id ? "fade-row" : ""}>
      <td>{u.id}</td>
      <td>{u.first_name}</td>
      <td>{u.last_name}</td>
      <td>{u.profile?.mobile_number || "---"}</td>
      <td>{u.email}</td>
      <td>{u.profile?.Show_Password || "---"}</td>
      <td className="User_address_col">{u.profile?.address_line_1 || "---"}</td>
      <td className="User_address_col">{u.profile?.address_line_2 || "---"}</td>
      <td>{u.profile?.city || "---"}</td>
      <td>{u.profile?.state || "---"}</td>
      <td>{u.profile?.pincode || "---"}</td>
      <td className="Home_Date-col">{u.profile?.user_created_on || "---"}</td>
      <td className="Home_Date-col">{u.profile?.user_updated_on || "---"}</td>

      {/* {user_type === "Master" && ( */}
      {/* <td className="text-center">
          <button
            className="btn btn-primary btn-sm me-2"
            onClick={() => edit_Users(u.id)}
          >
            <i className="fa fa-edit"></i>
          </button>

          <button
            className="btn btn-danger btn-sm"
            onClick={() => delete_User(u.id)}
          >
            <i className="fa fa-trash"></i>
          </button>
        </td> */}

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
            disabled={deletingId  === u.id}
            title="Delete User"
          >
            {deletingId  === u.id
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
