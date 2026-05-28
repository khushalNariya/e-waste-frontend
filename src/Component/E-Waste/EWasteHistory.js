import React, { useEffect, useMemo, useState } from 'react';
import './EWasteHistory.css';
import EWasteHistoryList from './EWasteHistoryList';
import { getMyEWasteSubmissions, getMyRewards, getMyStatusHistory } from '../User-Interface-API/API_Service';

const getList = (data) => data?.results || data || [];

const statusLabels = {
    requested: 'Requested',
    picked_up_dropped_off: 'Picked Up/Dropped',
    evaluating: 'In Evaluation',
    recycled: 'Recycled',
    rewarded: 'Rewarded',
    rejected: 'Rejected'
};

const statusSteps = ['requested', 'picked_up_dropped_off', 'evaluating', 'recycled', 'rewarded'];

const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    // Standardizing to REACT_APP_API_URL to avoid origin mismatches
    return `${(process.env.REACT_APP_API_URL || "http://127.0.0.1:1000/").replace(/\/$/, "")}${imagePath}`;
};

const mapSubmission = (item, rewards = [], allStatusHistory = []) => {
    const progressStep = item.status === 'rejected'
        ? 0
        : Math.max(statusSteps.indexOf(item.status), 0);

    // Find matching reward transaction
    const rewardTxn = rewards.find(r => r.submission === item.id && r.type === 'credit');

    // Get specific status history for this submission
    const submissionHistory = allStatusHistory.filter(h => h.submission === item.id);
    
    // Map status history to steps
    const stepTimes = statusSteps.map(stepStatus => {
        const historyEntry = submissionHistory.find(h => h.status === stepStatus);
        return historyEntry ? historyEntry.created_at : null;
    });

    // Find the latest remark from status history
    const latestRemark = submissionHistory.length > 0 
        ? [...submissionHistory].sort((a, b) => b.id - a.id)[0]?.remarks 
        : null;

    const formatDate = (dateStr) => {
        if (!dateStr || dateStr === '-') return '-';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-GB', { day: '2d-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch (e) { return dateStr; }
    };

    return {
        id: `EWS-${item.id}`,
        submitDate: formatDate(item.created_at),
        updatedAt: formatDate(item.updated_at),
        stepTimes: stepTimes.map(t => formatDate(t)),
        product: {
            category: item.category?.title || '-',
            brand: item.category_brand_mapping?.name || '-',
            model: item.model?.model_name || '-',
            initialCondition: item.user_condition?.display_name || '-',
            finalCondition: item.final_condition?.display_name || null,
            image: getImageUrl(item.images_data?.[0]?.image),
            allImages: item.images_data || [],
            weight: item.weight ? `${item.weight} kg` : null
        },
        logistics: {
            type: item.pickup_type === 'dropoff' ? 'Self Drop-off' : 'Doorstep Pickup',
            facility: item.facility?.name || '-',
            schedule: `${item.pickup_date || '-'} | ${item.pickup_time || '-'}`,
            phone: item.phone || '-',
            address: item.address || '-'
        },
        status: statusLabels[item.status] || item.status || 'Requested',
        rawStatus: item.status,
        progressStep,
        points: rewardTxn?.points || 0,
        carbonSaved: `${((item.weight || 0) * 1.5).toFixed(1)} kg`,
        notes: item.notes || '-',
        remarks: latestRemark || null
    };
};

const EWasteHistory = () => {
    const [historyData, setHistoryData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const itemsPerPage = 5;

    const [selectedImages, setSelectedImages] = useState(null);

    const handleViewImages = (images) => {
        setSelectedImages(images);
    };

    const closeGallery = () => {
        setSelectedImages(null);
    };

    useEffect(() => {
        const loadHistory = async () => {
            setIsLoading(true);
            try {
                const [subRes, rewardRes, historyRes] = await Promise.all([
                    getMyEWasteSubmissions(),
                    getMyRewards(),
                    getMyStatusHistory()
                ]);

                const submissions = getList(subRes.data);
                const rewards = getList(rewardRes.data);
                const statusHistory = getList(historyRes.data);

                setHistoryData(submissions.map(item => mapSubmission(item, rewards, statusHistory)));
            } catch (err) {
                setErrorMsg('Unable to load your submission history. Please login and try again.');
            } finally {
                setIsLoading(false);
            }
        };

        loadHistory();
    }, []);

    const totalPages = Math.max(Math.ceil(historyData.length / itemsPerPage), 1);

    const steps = ['Requested', 'Picked Up/Dropped', 'Evaluated', 'Recycled', 'Rewarded'];

    return (
        <div className="history-wrapper">
            <div className="history-header text-center">
                <div className="header-icon mx-auto mb-3">
                    <i className="fa-solid fa-clock-rotate-left"></i>
                </div>
                <h1 className="fw-bolder text-white mb-2">My Submission History</h1>
                <p className="text-white-50">Track your e-waste recycling journey, check evaluated conditions, and view progress dynamically.</p>
            </div>

            <div className="container history-dashboard">
                {errorMsg && (
                    <div className="ew-alert ew-alert-info mb-4">
                        {errorMsg}
                    </div>
                )}

                <div className="row g-4 mb-5">
                    <div className="col-md-4">
                        <div className="stat-card">
                            <div className="stat-icon bg-success-subtle text-success">
                                <i className="fa-solid fa-leaf"></i>
                            </div>
                            <div className="stat-details">
                                <h3>{historyData.length}</h3>
                                <p>Total Submissions</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="stat-card">
                            <div className="stat-icon bg-warning-subtle text-warning">
                                <i className="fa-solid fa-trophy"></i>
                            </div>
                            <div className="stat-details">
                                <h3>{historyData.filter((item) => item.rawStatus === 'rewarded').length}</h3>
                                <p>Rewarded Requests</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="stat-card">
                            <div className="stat-icon bg-info-subtle text-info">
                                <i className="fa-solid fa-spinner"></i>
                            </div>
                            <div className="stat-details">
                                <h3>{historyData.filter((item) => !['rewarded', 'rejected'].includes(item.rawStatus)).length}</h3>
                                <p>Active Requests</p>
                            </div>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="history-empty-state">
                        <i className="fa-solid fa-spinner fa-spin me-2"></i>
                        Loading submissions...
                    </div>
                ) : (
                    <EWasteHistoryList 
                        currentItems={historyData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
                        steps={steps}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalRecords={historyData.length}
                        handlePageChange={(p) => { setCurrentPage(p); window.scrollTo({ top: 350, behavior: 'smooth' }); }}
                        onViewImages={handleViewImages}
                    />
                )}
            </div>

            {/* Image Gallery Modal */}
            {selectedImages && (
                <div className="image-gallery-modal" onClick={closeGallery}>
                    <div className="gallery-overlay"></div>
                    <div className="gallery-content" onClick={e => e.stopPropagation()}>
                        <button className="gallery-close" onClick={closeGallery}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                        <div className="gallery-header">
                            <h5>Submission Images</h5>
                            <span>{selectedImages.length} Photos</span>
                        </div>
                        <div className="gallery-grid">
                            {selectedImages.map((img, idx) => (
                                <div key={idx} className="gallery-item">
                                    <img src={getImageUrl(img.image)} alt={`Submission ${idx + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EWasteHistory;
