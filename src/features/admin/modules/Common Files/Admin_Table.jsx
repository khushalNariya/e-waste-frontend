import React from "react";

export default function Admin_Table({ columns, children }) {
    return (
        <table className="Home-table table table-bordered table-hover">
            <thead className="table-success">
                <tr>
                    {columns.map((col, index) => (
                        <th key={index}>{col}</th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {children}
            </tbody>
        </table>
    );
}