import React from 'react';

const FilterTabs = ({ tabs, activeTab, setActiveTab, orders }) => {
    return (
        <div className="orders-filter-tabs">
            {tabs.map(tab => (
                <button key={tab} className={`orders-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                    {tab}
                    <span className="ms-2 badge" style={{
                        background: activeTab === tab ? 'rgba(255,255,255,0.3)' : '#e8f9f2',
                        color: activeTab === tab ? '#fff' : '#1cc88a',
                        fontSize: '11px',
                        padding: '3px 8px'
                    }}>
                        {tab === 'All' ? orders.length : orders.filter(o => o.status === tab).length}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default FilterTabs;
