const statusMap = {
  requested: { bg: "bg-warning", text: "Requested" },
  picked_up_dropped_off: { bg: "bg-info", text: "Picked Up/Dropped Off" },
  evaluating: { bg: "bg-primary", text: "Evaluating" },
  recycled: { bg: "bg-success", text: "Recycled" },
  rewarded: { bg: "bg-success", text: "Rewarded" },
  rejected: { bg: "bg-danger", text: "Rejected" },
};

// eslint-disable-next-line no-unused-vars
const formateStatusBadge = (status) => {
  const config = statusMap[status] || { bg: "bg-secondary", text: status };
  return <span className={`badge ${config.bg}`}>{config.text}</span>;
};

export function Fatch_E_Waste_Submission_Table(rows, edit_Users, deleteCategory, deletingId, handleStatusUpdate) {

  if (!rows || rows.length === 0) {
    return (
      <tr>
        <td colSpan="19" className="text-center text-muted">
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
      <td>
  {
  // u.images && u.images.length > 0 ? 
  u.images_data && u.images_data.length > 0 ?
  (
    // u.images.map((img, index) => (
      u.images_data.map((img, index) => (
      <img
        key={index}
        src={img.image}
        alt=""
        width="50"
        height="50"
        style={{ marginRight: "5px", borderRadius: "5px" }}
      />
    ))
  ) : (
    "No Images"
  )}
</td>
      <td>{u.weight ? `${u.weight} kg` : "N/A"}</td>
      <td>{u.user_condition?.display_name}</td>
      <td>{u.final_condition?.display_name}</td>

      <td>{u.pickup_type === "pickup" ? "Pickup" : "Dropoff"}</td>

      <td>{u.facility?.name}</td>
      <td><div className="Home-description-col">{u.address}</div></td>
      <td>{u.pickup_date} / {u.pickup_time}</td>
      <td>{u.phone}</td>

      <td>{u.notes}</td>

      <td>
        <select
          className={`badge ${statusMap[u.status]?.bg || "bg-secondary"}`}
          value={u.status}
          onChange={(e) => handleStatusUpdate(u.id, e.target.value)}
          style={{
            border: "none",
            color: "white",
            cursor: "pointer",
            fontWeight: "600",
            padding: "5px 30px 5px 15px",
            borderRadius: "20px",
            width: "auto",
            minWidth: "160px",
            textAlign: "center",
            textAlignLast: "center",
            fontSize: "12px",
            outline: "none",
            display: "inline-block",
            appearance: "none",
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
            backgroundSize: "18px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease",
          }}
        >
          {Object.entries(statusMap).map(([key, value]) => (
            <option
              key={key}
              value={key}
              style={{
                background: "white",
                color: "black",
                padding: "10px",
                fontSize: "13px",
              }}
            >
              {value.text}
            </option>
          ))}
        </select>
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


    </tr>
  ));
}

