import React, { useEffect, useState } from "react";
import { fetchRecycle } from "./api";
import "./Recycle.css";

export default function Recycle() {

    const [data, setData] = useState([]);

    useEffect(() => {

        fetchRecycle()
            .then(res => setData(res))
            .catch(err => console.log(err));

    }, []);

    return (

        <div className="container recycle-container mt-5">

            {/* TITLE */}
            <div className="text-center mb-5">
                <h3 className="fw-bold recycle-title">
                    Sustainable Electronics Recycling Solutions
                </h3>
                <p className="text-muted">
                    Choose the right recycling option for your electronic devices.
                </p>
            </div>

            <div className="row">

                {data.map((item) => (

                    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 mb-4 d-flex" key={item.id}>

                        <div className="card recycle-card w-100 d-flex flex-column">

                            {/* HEADER */}
                            <div className="recycle-header text-center">

                                <div className="icon-circle">
                                    <i className={`fa-solid ${item.icon}`}></i>
                                </div>

                            </div>

                            {/* BODY */}
                            <div className="card-body d-flex flex-column" style={{ height: "100%" }}>

                                <h5 className="fw-bold recycle-card-title">{item.title}</h5>

                                <p className="text-muted small">
                                    {item.description}
                                </p>

                                <h6 className="recycle-sub">RECYCLING PROCESS</h6>
                                <p className="small">{item.process}</p>

                                <h6 className="recycle-sub">SPECIAL INSTRUCTIONS</h6>
                                <p className="small">{item.instruction}</p>

                                <h6 className="recycle-sub">ENVIRONMENTAL BENEFITS</h6>
                                <p className="small">{item.benefits}</p>

                                <button className="btn recycle-btn mt-auto">
                                    {item.button_text}
                                </button>


                            </div>

                        </div>

                    </div>

                ))}

            </div>


{/* --- WHY RECYCLE SECTION --- */}
<div className="why-recycle-section mt-5 p-5">
    <h3 className="why-title mb-3">
        Why Recycle Electronics With E-Wast Recycling?
    </h3>

    <p className="why-subtitle mb-5">
        Our comprehensive approach ensures responsible handling of your electronic waste
    </p>

    <div className="row">

        <div className="col-md-3 mb-4">
            <div className="feature-card-2 p-3 h-100">
                <div className="feature-icon mb-3">
                    <i className="fa-solid fa-certificate"></i>
                </div>
                <h6 className="feature-title">Certified Process</h6>
                <p className="feature-text">
                    All recycling follows strict environmental standards and compliance protocols
                </p>
            </div>
        </div>

        <div className="col-md-3 mb-4">
            <div className="feature-card-2 p-3 h-100">
                <div className="feature-icon mb-3">
                    <i className="fa-solid fa-lock"></i>
                </div>
                <h6 className="feature-title">Data Security</h6>
                <p className="feature-text">
                    Guaranteed destruction of personal data on all electronic devices
                </p>
            </div>
        </div>

        <div className="col-md-3 mb-4">
            <div className="feature-card-2 p-3 h-100">
                <div className="feature-icon mb-3">
                    <i className="fa-solid fa-map"></i>
                </div>
                <h6 className="feature-title">Resource Recovery</h6>
                <p className="feature-text">
                    Maximum extraction of valuable materials from your electronic waste
                </p>
            </div>
        </div>

        <div className="col-md-3 mb-4">
            <div className="feature-card-2 p-3 h-100">
                <div className="feature-icon mb-3">
                    <i className="fa-solid fa-bolt"></i>
                </div>
                <h6 className="feature-title">Effortless Process</h6>
                <p className="feature-text">
                    Simple booking system makes recycling your electronics quick and convenient
                </p>
            </div>
        </div>

    </div>
</div>

        </div>

    );

}
