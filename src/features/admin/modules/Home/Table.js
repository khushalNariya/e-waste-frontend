export function Fatch_Home_Table(rows, user_type, edit_Users, deleteCategory, deletingId) {

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
      <td className="text-start">{u.title}</td>
      <td><div className="Home-description-col">
        {u.description}
      </div>
      </td>

      <td>{u.icon}</td>
      <td>{u.order}</td>
      {/* <td className="text-center align-middle">{u.date}</td>
      <td>{u.readTime}</td> */}
      <td className="text-center">
        {u.is_active
          ? <span className="badge bg-success">Yes</span>
          : <span className="badge bg-secondary">No</span>
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


// ======================================================================================================
// ======================================================================================================
// ======================================================================================================

export function Fatch_Home_Hero_Image(rows, user_type, edit_Users, deleteCategory, deletingId) {

  if (!rows || rows.length === 0) {
    return (
      <tr>
        <td colSpan="6" className="text-center text-muted">
          No Data Found
        </td>
      </tr>
    );
  }

  return rows.map((u) => (
    <tr key={u.id} className={deletingId === u.id ? "fade-row" : ""}>
      <td>{u.id}</td>
      <td>
        {u.image && (
          <img
            src={u.image}
            width="100"
            alt=""
          />
        )}
      </td>
      <td className="text-center">
        {u.is_active
          ? <span className="badge bg-success">Yes</span>
          : <span className="badge bg-secondary">No</span>
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