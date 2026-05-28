import React from 'react';
import './Rule.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Rule = () => {
    return (
        <div className="rule-premium-page">
            {/* Dynamic Header Section */}
            <section className="rule-header-v5 py-5 text-center text-white">
                <div className="container">
                    <div className="badge border border-light text-white mb-3 px-3 py-2 rounded-pill shadow-sm">
                        <i className="bi bi-shield-check me-2"></i> Official Gazette Notification
                    </div>
                    <h1 className="display-4 fw-800 mb-3">Indian E-Waste Management <br /><span className="text-emerald-bright">Regulatory Framework</span></h1>
                    <p className="lead opacity-75 mx-auto max-w-800">
                        A comprehensive governing system established by the Central Government under the Environment (Protection) Act, 1986.
                    </p>
                </div>
            </section>

            <div className="container py-5 negative-mt-100">
                <div className="row g-4 justify-content-center">

                    {/* Main Legal Document Container */}
                    <div className="col-lg-11">
                        <div className="legal-portal-card shadow-lg bg-white overflow-hidden border-0">

                            {/* Internal Metadata Bar */}
                            <div className="meta-bar p-3 d-md-flex justify-content-between align-items-center text-white px-4">
                                <div className="d-flex align-items-center gap-3">
                                    <span className="small opacity-75">Notification ID: <strong>S.O. 1047(E)</strong></span>
                                    <div className="v-sep"></div>
                                    <span className="small opacity-75">Dated: <strong>16th March, 2022</strong></span>
                                </div>
                                <div className="mt-2 mt-md-0">
                                    <span className="badge bg-success px-3">Active Regulation</span>
                                </div>
                            </div>

                            {/* Subject Area */}
                            <div className="p-4 p-md-5 bg-light-gradient border-bottom">
                                <div className="row align-items-center">
                                    <div className="col-md-9">
                                        <h5 className="fw-bold text-dark mb-2">Subject: The E-Waste (Management) Rules, 2022</h5>
                                        <p className="text-muted small m-0 italic">
                                            In exercise of the powers conferred by section 6, 8 and 25 of the Environment (Protection) Act, 1986 (29 of 1986), the Central Government hereby establishes comprehensive guidelines for the responsible management, handling, and disposal of electronic waste across India:
                                        </p>
                                    </div>
                                    <div className="col-md-3 text-md-end mt-3 mt-md-0">
                                        <img src="https://img.icons8.com/clouds/100/scales.png" alt="Law" width="80" />
                                    </div>
                                </div>
                            </div>

                            {/* Rules Content */}
                            <div className="p-4 p-md-5">

                                {/* Chapter I Card */}
                                <div className="chapter-v5-wrap mb-5">
                                    <div className="d-flex align-items-center gap-3 mb-4 section-label">
                                        <span className="ch-num">I</span>
                                        <h3 className="fw-800 m-0 gradient-text">CHAPTER I: PRELIMINARY PROVISIONS</h3>
                                    </div>

                                    <div className="rule-v5-card mb-4 p-4 border rounded-4 hover-lift">
                                        <h5 className="fw-bold"><span className="text-emerald me-2">1.</span> Short title and commencement.</h5>
                                        <div className="ps-4">
                                            <p className="mb-2 text-muted fw-500 font-sm">(1) These rules may be called the E-Waste (Management) Rules, 2022.</p>
                                            <p className="mb-0 text-muted fw-500 font-sm">(2) They shall come into force on the date of their publication in the Official Gazette.</p>
                                        </div>
                                    </div>

                                    <div className="rule-v5-card p-4 border rounded-4 hover-lift">
                                        <h5 className="fw-bold"><span className="text-emerald me-2">2.</span> Definitions.</h5>
                                        <div className="ps-4">
                                            <p className="text-muted mb-3 italic small">In these rules, unless the context otherwise requires:</p>
                                            <div className="row g-3">
                                                <div className="col-md-4">
                                                    <div className="def-item p-3 rounded-3 bg-light border-0 h-100">
                                                        <strong>(a) "Act"</strong>
                                                        <p className="small m-0 mt-1">Environment (Protection) Act, 1986 (29 of 1986);</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="def-item p-3 rounded-3 bg-light border-0 h-100">
                                                        <strong>(b) "Appliance"</strong>
                                                        <p className="small m-0 mt-1">Electrical/electronic equipment designed for household use;</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="def-item p-3 rounded-3 bg-light border-0 h-100">
                                                        <strong>(c) "Authorized dismantler"</strong>
                                                        <p className="small m-0 mt-1">Entity authorized by SPCB to dismantle e-waste;</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Chapter II Card */}
                                <div className="chapter-v5-wrap">
                                    <div className="d-flex align-items-center gap-3 mb-4 section-label">
                                        <span className="ch-num">II</span>
                                        <h3 className="fw-800 m-0 gradient-text">CHAPTER II: PRODUCER RESPONSIBILITIES</h3>
                                    </div>

                                    <div className="grid-stack-v5">

                                        {/* Rule 3 */}
                                        <div className="rule-v5-item mb-4">
                                            <div className="d-flex gap-3">
                                                <div className="rule-v5-index">3</div>
                                                <div>
                                                    <h5 className="fw-bold">Extended producer responsibility.</h5>
                                                    <p className="text-muted font-sm">(1) Every producer shall be responsible for establishing a system to collect, refurbish, recycle or dispose of e-waste generated from their products in an environmentally sound manner.</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rule 4 */}
                                        <div className="rule-v5-item mb-4">
                                            <div className="d-flex gap-3">
                                                <div className="rule-v5-index">4</div>
                                                <div>
                                                    <h5 className="fw-bold">Collection of E-Waste from Consumers.</h5>
                                                    <p className="text-muted font-sm">(1) Producers shall establish dedicated collection centers for the return of end-of-life electronic products from consumers.</p>
                                                    <p className="text-muted font-sm">(2) Producers shall provide comprehensive information to consumers regarding collection center locations and return procedures.</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rule 5 */}
                                        <div className="rule-v5-item mb-4">
                                            <div className="d-flex gap-3">
                                                <div className="rule-v5-index">5</div>
                                                <div>
                                                    <h5 className="fw-bold">Recycling Targets.</h5>
                                                    <p className="text-muted font-sm">(1) Producers shall achieve the specific recycling targets detailed in Schedule II of these rules.</p>
                                                    <p className="text-muted font-sm">(2) Failure to meet targets results in financial penalties by the Central Pollution Control Board (CPCB).</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rule 6 */}
                                        <div className="rule-v5-item mb-4">
                                            <div className="d-flex gap-3">
                                                <div className="rule-v5-index">6</div>
                                                <div>
                                                    <h5 className="fw-bold">Labeling of Electronic Products.</h5>
                                                    <p className="text-muted font-sm">(1) All products must be labeled with information regarding hazardous substances and safe disposal practices.</p>
                                                    <p className="text-muted font-sm">(2) CPCB shall establish and enforce the required form of labeling.</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rule 7 */}
                                        <div className="rule-v5-item mb-4">
                                            <div className="d-flex gap-3">
                                                <div className="rule-v5-index">7</div>
                                                <div>
                                                    <h5 className="fw-bold">Annual Reporting Requirements.</h5>
                                                    <p className="text-muted font-sm">(1) Producers must submit annual reports to the State Pollution Control Board (SPCB) detailing collection and recycling.</p>
                                                    <p className="text-muted font-sm">(2) Format and details shall be specified by the CPCB.</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rules 8-11 in a grid */}
                                        <div className="row g-4 mt-2">
                                            <div className="col-md-6 text-card-v5">
                                                <div className="p-3 bg-soft-green rounded-3 border-start border-4 border-emerald h-100">
                                                    <h6 className="fw-bold"><i className="bi bi-truck me-2"></i> 8. Transport & Handling</h6>
                                                    <p className="small m-0 text-muted">Producers and authorized dismantlers shall ensure safe transportation and handling as per CPCB guidelines.</p>
                                                </div>
                                            </div>
                                            <div className="col-md-6 text-card-v5">
                                                <div className="p-3 bg-soft-green rounded-3 border-start border-4 border-emerald h-100">
                                                    <h6 className="fw-bold"><i className="bi bi-megaphone me-2"></i> 9. Awareness Programs</h6>
                                                    <p className="small m-0 text-muted">Producers must educate the public about improper disposal risks and responsible recycling practices.</p>
                                                </div>
                                            </div>
                                            <div className="col-md-6 text-card-v5">
                                                <div className="p-3 bg-soft-red rounded-3 border-start border-4 border-danger h-100">
                                                    <h6 className="fw-bold text-danger"><i className="bi bi-slash-circle me-2"></i> 10. Unauthorized Handling</h6>
                                                    <p className="small m-0 text-muted">Unauthorized dismantling or recycling is strictly prohibited. Violations lead to serious legal consequences.</p>
                                                </div>
                                            </div>
                                            <div className="col-md-6 text-card-v5">
                                                <div className="p-3 bg-soft-green rounded-3 border-start border-4 border-emerald h-100">
                                                    <h6 className="fw-bold"><i className="bi bi-people me-2"></i> 11. Facilities Collaboration</h6>
                                                    <p className="small m-0 text-muted">Producers must collaborate with authorized disposal facilities for environmentally safe processing.</p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>

                            <footer className="card-footer bg-light p-4 text-center">
                                <p className="small text-muted m-0">Managed Compliance Monitoring Interface | © 2024 E-Waste Portal India</p>
                            </footer>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rule;
