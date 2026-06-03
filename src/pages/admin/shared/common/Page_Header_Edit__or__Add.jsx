import React from "react";
import { Link } from "react-router-dom";

export default function Page_Header_Edit_or_Add({
    headingText,
    headingIcon,
    breadcrumbText,
    breadIcon,
    listLink,
    listName
}) {
    return (
        <div className="page-header d-flex justify-content-between align-items-center mb-3 flex-wrap">
            <div>
                <h4 className="fw-bold text-success mb-1">
                    <i className={`fa ${headingIcon} me-2`}></i> {headingText}
                </h4>

                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb premium-breadcrumb">

                        <li className="breadcrumb-item">
                            <Link to="/admin">
                                <i className="fa fa-home me-1"></i> Dashboard
                            </Link>
                        </li>

                        <li className="breadcrumb-item">
                            <Link to={listLink}>
                                <i className={`fa ${breadIcon} me-1`}></i> {listName}
                            </Link>
                        </li>

                        <li className="breadcrumb-item active">
                            {breadcrumbText}
                        </li>

                    </ol>
                </nav>
            </div>

            <span className="badge eco-badge">Admin Panel</span>
        </div>
    );
}