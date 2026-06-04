export function Fatch_Reward_Transactions_Table(rows, deleteTransaction, deletingId) {
  if (!rows || rows.length === 0) {
    return (
      <tr>
        <td colSpan="8" className="text-center text-muted">
          No Data Found
        </td>
      </tr>
    );
  }

  return rows.map((t) => (
    <tr key={t.id} className={deletingId === t.id ? "fade-row" : ""}>
      <td>{t.id}</td>
      <td className="fw-bold">{t.user_name} (ID: {t.user})</td>
      <td>{t.submission ? `Sub #${t.submission}` : "N/A"}</td>
      <td>
        <span className={`badge px-3 py-2 rounded-pill ${t.type === 'credit' ? 'bg-success' : 'bg-danger'}`}>
          {t.type === 'credit' ? '+' : '-'}{t.points} pts
        </span>
      </td>
      <td>
        <span className={`badge ${t.type === 'credit' ? 'bg-success' : 'bg-danger'}`}>
          {t.type.toUpperCase()}
        </span>
      </td>
      <td style={{ whiteSpace: "nowrap" }}>
        {t.description || "N/A"}
      </td>
      <td className="Home_Date-col">{t.created_at}</td>
    </tr>
  ));
}
