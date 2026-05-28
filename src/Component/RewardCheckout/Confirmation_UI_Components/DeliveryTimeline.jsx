import React from 'react';

const DeliveryTimeline = ({ timeline }) => {

    const getDotStyle = (step) => {
        if (step.isCancel) return { background: '#e74c3c', boxShadow: '0 0 0 3px #e74c3c' };
        if (step.isReturn) return { background: '#1cc88a', boxShadow: '0 0 0 3px #1cc88a' };
        if (step.done)    return {};  // default green from CSS
        return {};                    // pending grey from CSS
    };

    const getLabelColor = (step) => {
        if (step.isCancel) return 'text-danger';
        if (step.isReturn) return 'text-success';
        return step.done ? 'text-success' : 'text-muted';
    };

    const getIcon = (step) => {
        if (step.isCancel) return <i className="fa-solid fa-ban ms-1 text-danger" style={{ fontSize: 10 }}></i>;
        if (step.isReturn) return <i className="fa-solid fa-rotate-left ms-1 text-success" style={{ fontSize: 10 }}></i>;
        return null;
    };

    return (
        <div className="conf-order-card mb-4">
            <div className="conf-order-header d-flex align-items-center gap-3">
                <div style={{ width: 40, height: 40, background: '#e8f9f2', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa-solid fa-route text-success"></i>
                </div>
                <div>
                    <h6 className="fw-bold text-dark mb-0">Order Timeline</h6>
                    <span className="small text-muted">Track your reward's journey</span>
                </div>
            </div>
            <div className="p-4">
                <div className="delivery-timeline">
                    {timeline.map((step, i) => (
                        <div key={i} className="timeline-item">
                            <div
                                className={`timeline-dot ${step.done ? '' : 'pending'}`}
                                style={getDotStyle(step)}
                            ></div>
                            <div>
                                <div className={`fw-bold small ${getLabelColor(step)}`}>
                                    {step.label}{getIcon(step)}
                                </div>
                                <div className="text-muted" style={{ fontSize: '12px' }}>{step.desc}</div>
                                {step.date && (
                                    <div className="text-dark fw-semibold" style={{ fontSize: '12px', marginTop: '2px' }}>{step.date}</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DeliveryTimeline;
