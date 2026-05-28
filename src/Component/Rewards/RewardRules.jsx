import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Styles/RewardRules.css';
import { getRewardRules } from '../User-Interface-API/API_Service';


const RewardRules = () => {
    // const pointSystem = [
    //     { category: 'Laptops/PCs', unit: 'Item', likeNew: 1500, working: 1000, minorDamage: 600, notWorking: 300, scrap: 150 },
    //     { category: 'Smartphones', unit: 'Item', likeNew: 800, working: 500, minorDamage: 300, notWorking: 150, scrap: 80 },
    //     { category: 'Home Appliances (Fridge/AC)', unit: 'KG', likeNew: 120, working: 100, minorDamage: 80, notWorking: 60, scrap: 45 },
    //     { category: 'Consumer Electronics (TV/Audio)', unit: 'KG', likeNew: 100, working: 80, minorDamage: 60, notWorking: 40, scrap: 30 },
    //     { category: 'Batteries & Bulky Scrap', unit: 'KG', likeNew: 60, working: 50, minorDamage: 40, notWorking: 30, scrap: 25 },
    // ];

    const [pointSystem, setPointSystem] = useState([]);

    // API CALL
    useEffect(() => {
        getRewardRules()
            .then(res => {
                convertData(res.data);  // 👈 correct
            })
            .catch(err => console.error('Error Fetching Reward Rules', err));
    }, []);

    // DATA CONVERT FUNCTION
    const convertData = (apiData) => {
        const result = {};
        if (!apiData || apiData.length === 0) return;

        apiData.forEach(item => {
            const category = item.category.title;
            const condition = item.condition.display_name;
            const points = item.points;

            if (!result[category]) {
                result[category] = {
                    category: category,
                    unit: item.unit,
                    likeNew: 0,
                    working: 0,
                    minorDamage: 0,
                    notWorking: 0,
                    scrap: 0,
                };
            }

            // condition mapping
            if (condition === "Like New") result[category].likeNew = points;
            if (condition === "Working") result[category].working = points;
            if (condition === "Minor Damage") result[category].minorDamage = points;
            if (condition === "Not Working") result[category].notWorking = points;
            if (condition === "Scrap") result[category].scrap = points;
        });

        setPointSystem(Object.values(result));
    };


    const steps = [
        {
            title: 'Submit E-Waste',
            desc: 'Fill out the e-waste submission form with accurate details and high-quality photos.',
            icon: 'fa-paper-plane',
            color: '#4e73df'
        },
        {
            title: 'Pickup & Verification',
            desc: 'Our team will pick up the item and verify its condition at the facility.',
            icon: 'fa-truck-fast',
            color: '#1cc88a'
        },
        {
            title: 'Earn Points',
            desc: 'Points are credited to your account instantly after successful verification.',
            icon: 'fa-coins',
            color: '#f6c23e'
        },
        {
            title: 'Redeem Rewards',
            desc: 'Browse our reward store and use your points to purchase your favorite items.',
            icon: 'fa-gift',
            color: '#e74a3b'
        }
    ];

    return (
        <div className="reward-rules-page">
            {/* Hero Section */}
            <header className="reward-rules-hero">
                <div className="container text-center">
                    <span className="reward-badge">Incentive Program 2024</span>
                    <h1 className="reward-title">Recycle & Get <span className="text-gradient">Rewarding</span></h1>
                    <p className="reward-subtitle">Transforming your e-waste into value while protecting the planet. Your rewards are calculated based on <strong>Product Condition + Total Weight</strong>.</p>
                </div>
            </header>

            <div className="container py-5">
                {/* Steps Section */}
                <section className="steps-container mb-5">
                    <h3 className="section-heading text-center mb-5">How It Works</h3>
                    <div className="row g-4">
                        {steps.map((step, index) => (
                            <div className="col-lg-3 col-md-6" key={index}>
                                <div className="step-card shadow-sm h-100">
                                    <div className="step-icon" style={{ backgroundColor: step.color }}>
                                        <i className={`fa-solid ${step.icon}`}></i>
                                    </div>
                                    <h4 className="step-tag">Step {index + 1}</h4>
                                    <h3 className="step-title">{step.title}</h3>
                                    <p className="step-desc">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Point System Table */}
                <section className="points-table-section mb-5">
                    <div className="card shadow border-0 overflow-hidden">
                        <div className="card-header bg-dark text-white p-4">
                            <div className="d-md-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="m-0"><i className="fa-solid fa-scale-balanced me-3 text-warning"></i>Condition & Weight Matrix</h3>
                                    <p className="mb-0 text-white-50 mt-1">Final points = (Unit Points × Weight in KG) for bulky items, or Flat rate for portable items.</p>
                                </div>
                                <div className="mt-3 mt-md-0">
                                    <span className="badge bg-warning text-dark px-3 py-2">Formula: Condition × Weight</span>
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0 reward-table">
                                <thead className="table-light">
                                    <tr>
                                        <th className="ps-4">Item Category</th>
                                        <th>Unit</th>
                                        <th>Like New</th>
                                        <th>Working</th>
                                        <th>Minor Damage</th>
                                        <th>Not Working</th>
                                        <th>Scrap Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pointSystem.map((row, idx) => (
                                        <tr key={idx}>
                                            <td className="ps-4">
                                                <div className="fw-bold">{row.category}</div>
                                            </td>
                                            <td><span className="unit-label">{row.unit}</span></td>
                                            <td><span className="badge-points like-new">{row.likeNew} <small>pts</small></span></td>
                                            <td><span className="badge-points working">{row.working} <small>pts</small></span></td>
                                            <td><span className="badge-points minor-damage">{row.minorDamage} <small>pts</small></span></td>
                                            <td><span className="badge-points not-working">{row.notWorking} <small>pts</small></span></td>
                                            <td><span className="badge-points scrap">{row.scrap} <small>pts</small></span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Bonus Section */}
                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="bonus-card shadow-sm h-100">
                            <div className="bonus-icon"><i className="fa-solid fa-weight-hanging"></i></div>
                            <h3>Weight Matters!</h3>
                            <p className="text-muted">For heavy appliances like Washing Machines and ACs, we use per-KG pricing to ensure you get the maximum value for your heavy e-waste.</p>
                            <ul className="bonus-list">
                                <li><strong>Weight Bonus:</strong> Extra 50 points for every 10KG above 50KG.</li>
                                <li><strong>Certificates:</strong> Get a "Green Hero" certificate for recycling &gt;100KG.</li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="bonus-card shadow-sm h-100 dark-version">
                            <div className="bonus-icon"><i className="fa-solid fa-circle-question"></i></div>
                            <h3>Frequently Asked Questions</h3>
                            <div className="faq-mini">
                                <p><strong>How long do points take to credit?</strong> Points are credited within 24-48 hours post-verification.</p>
                                <p><strong>Do points expire?</strong> No, your earned reward points never expire!</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="reward-cta mt-5 p-5 text-center shadow rounded-4">
                    <h2>Ready to Earn Rewards?</h2>
                    <p className="mb-4">Start by submitting your first e-waste item today and join the green movement.</p>
                    <Link to="/E-Waste-Form" className="btn btn-reward-primary btn-lg px-5 rounded-pill shadow">
                        Submit E-Waste Form <i className="fa-solid fa-arrow-right ms-2"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RewardRules;








