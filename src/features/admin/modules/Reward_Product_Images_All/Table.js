import React from "react";

export function Fatch_Reward_Product_Image_Table(rows, edit_Users, deleteImage, toggleStatus, deletingId, handleOrderChange, togglePrimary) {
    if (!rows || rows.length === 0) {
        return (
            <tr>
                <td colSpan="9" className="text-center text-muted">
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
                    <div className="p-1 border rounded bg-light d-inline-block shadow-sm">
                        <img
                            src={u.image}
                            width="60"
                            height="60"
                            alt="Product"
                            style={{ objectFit: "cover", borderRadius: "4px" }}
                        />
                    </div>
                )}
            </td>
            <td>
                <span className="fw-bold text-dark">{u.product ? u.product.name : "N/A"}</span>
                <br />
                <small className="text-muted">ID: {u.product ? u.product.id : "N/A"}</small>
            </td>
            <td className="text-center">
                {/* 🌈 PREMIUM MAGIC STAR SELECTOR */}
                <div 
                    onClick={() => togglePrimary(u.id)}
                    className="d-inline-flex align-items-center justify-content-center"
                    style={{ 
                        cursor: "pointer", 
                        position: "relative",
                        padding: "8px 15px",
                        borderRadius: "30px",
                        background: u.is_primary ? "rgba(255, 193, 7, 0.08)" : "#f8fafc",
                        border: u.is_primary ? "1px solid rgba(255, 193, 7, 0.3)" : "1px solid #e2e8f0",
                        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        minWidth: "120px",
                        overflow: "hidden"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px) scale(1.05)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0) scale(1)"}
                >
                    {/* Background Sparkle Particles (Only for Primary) */}
                    {u.is_primary && (
                        <div className="sparkle-container">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className={`sparkle sparkle-${i}`} />
                            ))}
                        </div>
                    )}

                    {/* Glowing Pulse Ring (Only for Primary) */}
                    {u.is_primary && <div className="pulse-ring" />}

                    <i 
                        className={u.is_primary ? "fa fa-star star-animated" : "fa fa-star-o"} 
                        style={{ 
                            fontSize: "20px", 
                            color: u.is_primary ? "#ffc107" : "#94a3b8",
                            zIndex: 2,
                            position: "relative",
                            transition: "0.5s"
                        }}
                    ></i>

                    <span style={{
                        marginLeft: "10px",
                        fontSize: "10px",
                        fontWeight: "800",
                        color: u.is_primary ? "#b45309" : "#64748b",
                        zIndex: 2,
                        textTransform: "uppercase",
                        letterSpacing: "1px"
                    }}>
                        {u.is_primary ? "PRIMARY" : "SELECT"}
                    </span>

                    <style>{`
                        .star-animated {
                            animation: star-rotate 0.8s ease;
                        }
                        @keyframes star-rotate {
                            0% { transform: scale(1) rotate(0); }
                            50% { transform: scale(1.5) rotate(180deg); }
                            100% { transform: scale(1) rotate(360deg); }
                        }
                        .pulse-ring {
                            position: absolute;
                            width: 30px;
                            height: 30px;
                            background: rgba(255,193,7,0.4);
                            border-radius: 50%;
                            animation: pulse-ring 2s infinite;
                            z-index: 1;
                        }
                        @keyframes pulse-ring {
                            0% { transform: scale(0.5); opacity: 0.8; }
                            100% { transform: scale(2.5); opacity: 0; }
                        }
                        .sparkle {
                            position: absolute;
                            width: 4px;
                            height: 4px;
                            background: #ffc107;
                            border-radius: 50%;
                            z-index: 1;
                        }
                        .sparkle-0 { top: 10%; left: 20%; animation: sparkle-float 1.5s infinite; }
                        .sparkle-1 { bottom: 15%; right: 25%; animation: sparkle-float 2s infinite 0.5s; }
                        .sparkle-2 { top: 40%; right: 10%; animation: sparkle-float 1.8s infinite 0.3s; }
                        @keyframes sparkle-float {
                            0% { transform: translateY(0) scale(1); opacity: 0; }
                            50% { opacity: 1; }
                            100% { transform: translateY(-20px) scale(0); opacity: 0; }
                        }
                    `}</style>
                </div>
            </td>
            <td>
                {/* 🚀 STYLISH INLINE ORDER SELECTOR */}
                <div className="position-relative d-inline-block">
                    <select
                        value={u.display_order}
                        onChange={(e) => handleOrderChange(u.id, parseInt(e.target.value))}
                        className="form-select form-select-sm rounded-pill shadow-sm"
                        style={{
                            width: "70px",
                            paddingLeft: "15px",
                            background: "linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)",
                            border: "1px solid #c7d2fe",
                            color: "#4338ca",
                            fontWeight: "700",
                            fontSize: "12px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            appearance: "none",
                            textAlign: "center"
                        }}
                    >
                        {[...Array(20)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                    </select>
                    <i className="fa fa-chevron-down position-absolute" style={{
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: "8px",
                        color: "#6366f1",
                        pointerEvents: "none"
                    }}></i>
                </div>
            </td>

            {/* 💎 ULTRA-MODERN SLIDING HIGHLIGHT TOGGLE */}
            <td className="text-center">
                <div
                    onClick={() => toggleStatus(u.id)}
                    className="position-relative d-inline-flex align-items-center p-1"
                    style={{
                        width: "110px",
                        height: "32px",
                        background: "#f1f5f9",
                        borderRadius: "30px",
                        cursor: "pointer",
                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
                        overflow: "hidden"
                    }}
                >
                    {/* Sliding Highlight Pill */}
                    <div style={{
                        position: "absolute",
                        top: "3px",
                        left: u.is_active ? "55px" : "3px",
                        width: "52px",
                        height: "26px",
                        background: u.is_active
                            ? "linear-gradient(135deg, #6366f1, #4f46e5)"
                            : "linear-gradient(135deg, #94a3b8, #64748b)",
                        borderRadius: "25px",
                        transition: "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                        boxShadow: u.is_active
                            ? "0 4px 10px rgba(99, 102, 241, 0.4)"
                            : "0 4px 10px rgba(100, 116, 139, 0.3)",
                        zIndex: 1
                    }} />

                    {/* Labels */}
                    <div className="w-100 d-flex justify-content-between px-2 position-relative" style={{ zIndex: 2 }}>
                        <span style={{
                            fontSize: "9px",
                            fontWeight: "800",
                            color: u.is_active ? "#64748b" : "white",
                            transition: "0.3s",
                            width: "45px",
                            textAlign: "center",
                            lineHeight: "26px",
                            textTransform: "uppercase"
                        }}>Off</span>
                        <span style={{
                            fontSize: "9px",
                            fontWeight: "800",
                            color: u.is_active ? "white" : "#64748b",
                            transition: "0.3s",
                            width: "45px",
                            textAlign: "center",
                            lineHeight: "26px",
                            textTransform: "uppercase"
                        }}>Active</span>
                    </div>
                </div>
            </td>

            <td className="Home_Date-col">{u.created_at}</td>
            <td className="Home_Date-col">{u.updated_at}</td>

            <td className="text-center">
                <div className="action-btn-group">
                    <button
                        type="button"
                        className="btn btn-primary btn-sm action-btn"
                        onClick={() => edit_Users(u.id)}
                        title="Edit Image"
                    >
                        <i className="fa fa-edit"></i>
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger btn-sm action-btn"
                        onClick={() => deleteImage(u.id)}
                        disabled={deletingId === u.id}
                        title="Delete Image"
                    >
                        {deletingId === u.id ? (
                            <i className="fa fa-spinner fa-spin"></i>
                        ) : (
                            <i className="fa fa-trash"></i>
                        )}
                    </button>
                </div>
            </td>
        </tr>
    ));
}