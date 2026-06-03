export function Fatch_Users_Table(rows, user_type, edit_Users, deleteCategory, deletingId) {

  if (!rows || rows.length === 0) {
    return (
      <tr>
        <td colSpan="12" className="text-center text-muted">
          No Data Found
        </td>
      </tr>
    );
  }

  return rows.map((u) => (
    <tr key={u.id} className={deletingId === u.id ? "fade-row" : ""}>
      <td>{u.id}</td>
      <td className="text-start">{u.title}</td>
      <td ><div className="Home-description-col">
        {u.description}
      </div>
       </td>
      <td>
        {u.image && (
          <img
            src={u.image}
            width="100"
            alt=""
          />
        )}
      </td>
      <td>{u.category}</td>
      <td>{u.author}</td>
      <td className="text-center align-middle">{u.date}</td>
      <td>{u.readTime}</td>
      <td>
        {u.isFeatured
          ? <span className="badge bg-success">Yes</span>
          : <span className="badge bg-secondary">No</span>
        }
      </td>
      <td className="Home_Date-col">{u.Education_Create_at}</td>
      <td className="Home_Date-col">{u.Education_Update_at}</td>

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
