export function Fatch_User_Wallet_Table(rows, deleteWallet, deletingId) {
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
      <td>{u.user}</td>
      <td className="fw-bold">{u.user_name}</td>
      <td>
        <span className="badge bg-success px-3 py-2 rounded-pill">
          {u.total_points} pts
        </span>
      </td>
      <td className="Home_Date-col">{u.created_at}</td>
      <td className="Home_Date-col">{u.updated_at}</td>
    </tr>
  ));
}
