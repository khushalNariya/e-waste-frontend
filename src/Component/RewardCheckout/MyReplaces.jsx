import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getMyReplacesAPI, getMyReturnsAPI, getMyOrdersAPI, submitReplaceRequestAPI, cancelReplaceRequestAPI } from '../User-Interface-API/API_Service';
import './Styles/Checkout.css';

const MyReplaces = () => {
    const location = useLocation();
    const [replaces, setReplaces] = useState([]);
    const [eligibleOrders, setEligibleOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');

    // Modal states for creating a replace request
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [replaceReason, setReplaceReason] = useState('');
    const [replaceNote, setReplaceNote] = useState('');
    const [replaceType, setReplaceType] = useState('same_item');
    const [selectedItems, setSelectedItems] = useState({}); // { order_item_id: { checked: bool, qty: number, condition: string, variantDetails: string } }
    const [images, setImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [replacedQuantities, setReplacedQuantities] = useState({});
    const [returnedQuantities, setReturnedQuantities] = useState({});
    const [cancelModal, setCancelModal] = useState({ open: false, replaceId: null, replaceNumber: '' });
    const [cancelReason, setCancelReason] = useState('');
    const cancelReasons = [
        "Decided to keep the product",
        "Want to request a refund/return instead",
        "Issue resolved by customer support",
        "Incorrect replacement reason selected",
        "Other reasons"
    ];
    // Tracks order_item IDs that were already successfully replaced (cannot be re-replaced)
    const [successfullyReplacedItems, setSuccessfullyReplacedItems] = useState(new Set());
    // Maps order_item ID -> replacement_delivered_at timestamp for window display
    const [replacementWindowMap, setReplacementWindowMap] = useState({});

    useEffect(() => {
        fetchReplacesData();
    }, []);

    useEffect(() => {
        if (location.state?.openCreateModal && location.state?.selectOrderId && eligibleOrders.length > 0) {
            const order = eligibleOrders.find(o =>
                String(o.order_number) === String(location.state.selectOrderId) ||
                String(o.id) === String(location.state.selectOrderId)
            );
            if (order) {
                setSelectedOrder(order);
                setIsCreateModalOpen(true);
                if (location.state?.selectOrderItemId) {
                    const targetItem = order.items?.find(i => String(i.id) === String(location.state.selectOrderItemId));
                    if (targetItem) {
                        setSelectedItems({
                            [targetItem.id]: {
                                checked: true,
                                qty: 1,
                                condition: 'defective',
                                variantDetails: '',
                                productId: targetItem.product_id,
                                productName: targetItem.product_name
                            }
                        });
                    }
                }
            }
        }
    }, [location.state, eligibleOrders]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const openCancelModal = (repRequest) => {
        setCancelReason('');
        setCancelModal({ open: true, replaceId: repRequest.id, replaceNumber: repRequest.replace_number });
    };

    const closeCancelModal = () => {
        setCancelModal({ open: false, replaceId: null, replaceNumber: '' });
        setCancelReason('');
    };

    const confirmCancelReplace = async () => {
        if (!cancelReason) return;
        try {
            setLoading(true);
            await cancelReplaceRequestAPI(cancelModal.replaceId, cancelReason);
            setSuccessMessage(`Replacement request ${cancelModal.replaceNumber} cancelled successfully.`);
            closeCancelModal();
            await fetchReplacesData();
        } catch (error) {
            console.error("Error cancelling replacement request:", error);
            alert(error.response?.data?.error || "Failed to cancel replacement request. Please try again.");
            setLoading(false);
        }
    };

    const fetchReplacesData = async () => {
        setLoading(true);
        try {
            // Fetch replace requests and return requests in parallel
            const [replacesResponse, returnsResponse] = await Promise.all([
                getMyReplacesAPI(),
                getMyReturnsAPI()
            ]);
            const replacesData = replacesResponse.data.results || replacesResponse.data || [];
            const returnsData = returnsResponse.data.results || returnsResponse.data || [];
            setReplaces(replacesData);

            // Fetch delivered orders
            const ordersResponse = await getMyOrdersAPI();
            const orders = ordersResponse.data.results || ordersResponse.data || [];

            // Filter for orders delivered within the last 1 calendar day using delivered_at
            // Map order_item_id -> total replaced quantity across active replaces
            const replacedItemQuantities = {};
            replacesData
                .filter(rep => !['rejected', 'replacement_delivered'].includes(rep.replace_status))
                .forEach(rep => {
                    rep.items_data?.forEach(item => {
                        const orderItemId = item.order_item;
                        replacedItemQuantities[orderItemId] = (replacedItemQuantities[orderItemId] || 0) + item.quantity;
                    });
                });

            // Map order_item_id -> total returned quantity across active returns
            const returnedItemQuantities = {};
            returnsData
                .filter(ret => ret.return_status !== 'rejected')
                .forEach(ret => {
                    ret.items_data?.forEach(item => {
                        const orderItemId = item.order_item;
                        returnedItemQuantities[orderItemId] = (returnedItemQuantities[orderItemId] || 0) + item.quantity;
                    });
                });

            setReplacedQuantities(replacedItemQuantities);
            setReturnedQuantities(returnedItemQuantities);

            // ---------------------------------------------------------
            // Track items already SUCCESSFULLY replaced:
            // These items cannot be re-replaced — only returned.
            // Also map order_item -> replacement_delivered_at for UI.
            // ---------------------------------------------------------
            const successReplaced = new Set();
            const windowMap = {};
            replacesData
                .filter(rep => ['replacement_delivered'].includes(rep.replace_status))
                .forEach(rep => {
                    rep.items_data?.forEach(item => {
                        successReplaced.add(item.order_item);
                        if (rep.replacement_delivered_at) {
                            windowMap[item.order_item] = rep.replacement_delivered_at;
                        }
                    });
                });
            setSuccessfullyReplacedItems(successReplaced);
            setReplacementWindowMap(windowMap);

            const availableForReplace = orders.filter(order => {
                if (!['delivered', 'returned'].includes(order.order_status) || !order.delivered_at) {
                    return false;
                }

                // Check 1 calendar day eligibility window
                const d1 = new Date(order.delivered_at);
                d1.setHours(0, 0, 0, 0);
                const d2 = new Date();
                d2.setHours(0, 0, 0, 0);

                const diffDays = Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));

                if (diffDays > 1) {
                    return false;
                }

                // Check if there is at least one item not fully replaced or returned yet
                const hasReplaceableItems = order.items?.some(item => {
                    const replacedQty = replacedItemQuantities[item.id] || 0;
                    const returnedQty = returnedItemQuantities[item.id] || 0;
                    return item.quantity > (replacedQty + returnedQty);
                });

                return hasReplaceableItems;
            });

            setEligibleOrders(availableForReplace);
        } catch (error) {
            console.error("Error fetching replaces data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle item selection inside modal
    const handleItemSelectionChange = (item, checked) => {
        const replacedQty = replacedQuantities[item.id] || 0;
        const returnedQty = returnedQuantities[item.id] || 0;
        const remainingQty = item.quantity - (replacedQty + returnedQty);

        setSelectedItems(prev => ({
            ...prev,
            [item.id]: {
                checked,
                qty: remainingQty,
                condition: prev[item.id]?.condition || 'defective',
                variantDetails: prev[item.id]?.variantDetails || '',
                productId: item.product_id,
                productName: item.product_name
            }
        }));
    };

    const handleQtyChange = (itemId, qty, max) => {
        const validQty = Math.max(1, Math.min(qty, max));
        setSelectedItems(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                qty: validQty
            }
        }));
    };

    const handleConditionChange = (itemId, condition) => {
        setSelectedItems(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                condition
            }
        }));
    };

    const handleVariantDetailsChange = (itemId, details) => {
        setSelectedItems(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                variantDetails: details
            }
        }));
    };

    // Images Upload Handlers
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 5) {
            alert("Maximum 5 proof images are allowed.");
            return;
        }
        setImages(prev => [...prev, ...files]);
    };

    const handleRemoveImage = (index) => {
        setImages(prev => prev.filter((_, idx) => idx !== index));
    };

    // Form Submit
    const handleCreateReplaceSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!selectedOrder) {
            setErrorMessage('Please select an eligible order.');
            return;
        }

        const itemsToReplace = Object.entries(selectedItems)
            .filter(([_, value]) => value.checked)
            .map(([orderItemId, value]) => ({
                order_item_id: parseInt(orderItemId),
                product_id: value.productId,
                quantity: value.qty,
                item_condition: value.condition,
                replacement_product_id: null, // default same product
                replacement_product_name: replaceType === 'different_variant' && value.variantDetails
                    ? `${value.productName} (${value.variantDetails})`
                    : value.productName
            }));

        if (itemsToReplace.length === 0) {
            setErrorMessage('Please check at least one item to replace.');
            return;
        }

        if (images.length < 1) {
            setErrorMessage('Please upload at least 1 photo proving the product defect or issue.');
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('order_id', selectedOrder.id);
        formData.append('replace_reason', replaceReason);
        formData.append('replace_note', replaceNote);
        formData.append('replace_type', replaceType);
        formData.append('replace_items', JSON.stringify(itemsToReplace));

        images.forEach(img => {
            formData.append('images', img);
        });

        try {
            await submitReplaceRequestAPI(formData);
            setSuccessMessage('Your replacement request has been successfully created. We will schedule a courier partner for the item swap shortly.');
            setIsCreateModalOpen(false);

            // Reset modal states
            setSelectedOrder(null);
            setReplaceReason('');
            setReplaceNote('');
            setReplaceType('same_item');
            setSelectedItems({});
            setImages([]);

            // Refresh — await ensures quantities + dropdown update before UI settles
            await fetchReplacesData();
        } catch (error) {
            console.error("Error submitting replace request:", error);
            const errDetail = error.response?.data;
            if (typeof errDetail === 'object') {
                const combinedErrors = Object.entries(errDetail)
                    .map(([key, val]) => `${key}: ${Array.isArray(val) ? val[0] : val}`)
                    .join(' | ');
                setErrorMessage(combinedErrors || 'Failed to submit replace request.');
            } else {
                setErrorMessage(error.response?.data?.error || 'Failed to submit replace request.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    // CSS status classes tailored for replacements
    const statusClasses = {
        requested: 'status-processing',
        approved: 'status-processing',
        replacement_dispatched: 'status-shipped',
        replacement_delivered: 'status-delivered',
        rejected: 'status-cancelled'
    };

    const statusIcons = {
        requested: 'fa-clock',
        approved: 'fa-thumbs-up',
        replacement_dispatched: 'fa-truck-fast',
        replacement_delivered: 'fa-box-open',
        rejected: 'fa-circle-xmark'
    };

    const filteredReplaces = activeTab === 'All'
        ? replaces
        : replaces.filter(rep => {
            if (activeTab === 'Pending') return !['replacement_delivered', 'rejected'].includes(rep.replace_status);
            if (activeTab === 'Completed') return rep.replace_status === 'replacement_delivered';
            if (activeTab === 'Rejected') return rep.replace_status === 'rejected';
            return true;
        });

    return (
        <div className="orders-page" style={{ fontFamily: '"Inter", sans-serif', minHeight: '80vh', padding: '40px 0' }}>
            <div className="container">

                {/* Headers with Premium Vibe */}
                <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
                    <div>
                        <h2 className="fw-bold mb-1" style={{ color: '#2c3e50', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <i className="fa-solid fa-arrows-rotate text-primary"></i>
                            Instant Replacement Exchanges
                        </h2>
                        <p className="text-muted mb-0">Exchange items concurrently with our seamless one-trip pickup and swap service</p>
                    </div>

                    {eligibleOrders.length > 0 ? (
                        <button
                            className="btn btn-primary fw-bold px-4 py-2"
                            style={{
                                borderRadius: 12,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                background: 'linear-gradient(135deg, #4f46e5, #3730a3)',
                                border: 'none',
                                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)'
                            }}
                            onClick={() => {
                                setIsCreateModalOpen(true);
                                setErrorMessage('');
                            }}
                        >
                            <i className="fa-solid fa-square-plus"></i>
                            Request a Replacement
                        </button>
                    ) : (
                        <div className="alert alert-light border small text-muted mb-0 py-2 px-3 rounded-3">
                            <i className="fa-solid fa-circle-info me-2 text-primary"></i>
                            No orders delivered within the 7-day replace window are available.
                        </div>
                    )}
                </div>

                {successMessage && (
                    <div
                        className="p-4 mb-4 d-flex align-items-center justify-content-between position-relative"
                        style={{
                            background: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            borderRadius: '16px',
                            boxShadow: '0 4px 15px rgba(22, 163, 74, 0.04)',
                            animation: 'fadeIn 0.4s ease',
                            display: 'flex',
                            gap: '16px'
                        }}
                    >
                        <style>{`
                            @keyframes fadeIn {
                                from { opacity: 0; transform: translateY(-8px); }
                                to { opacity: 1; transform: translateY(0); }
                            }
                        `}</style>
                        <div className="d-flex align-items-center gap-3">
                            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '44px', height: '44px', minWidth: '44px', background: '#dcfce7', color: '#16a34a' }}>
                                <i className="fa-solid fa-circle-check fa-lg"></i>
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1" style={{ color: '#14532d', fontSize: '15px', letterSpacing: '0.2px' }}>Request Submitted Successfully!</h5>
                                <p className="mb-0 small" style={{ color: '#166534', fontSize: '13px', lineHeight: '1.4' }}>{successMessage}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="btn opacity-75 hover-opacity-100 p-1 border-0"
                            onClick={() => setSuccessMessage('')}
                            style={{ fontSize: '22px', cursor: 'pointer', background: 'none', color: '#15803d', lineHeight: 1 }}
                        >
                            &times;
                        </button>
                    </div>
                )}

                {/* Filter Tabs */}
                <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
                    <div className="d-flex gap-2 bg-light p-1 rounded-3">
                        {['All', 'Pending', 'Completed', 'Rejected'].map(tab => (
                            <button
                                key={tab}
                                className={`btn btn-sm px-4 py-2 fw-semibold ${activeTab === tab ? 'bg-white shadow-sm text-primary' : 'text-muted'}`}
                                style={{ borderRadius: 8, border: 'none', transition: 'all 0.2s' }}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="small text-muted fw-semibold">
                        Showing {filteredReplaces.length} Replace Requests
                    </div>
                </div>

                {/* List container */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : filteredReplaces.length === 0 ? (
                    <div className="text-center py-5 bg-white border rounded-4">
                        <i className="fa-solid fa-arrows-rotate fa-3x text-muted mb-3 opacity-30"></i>
                        <h4 className="fw-bold text-dark">No replacements found</h4>
                        <p className="text-muted small">You don't have any replacement requests matching this filter.</p>
                        <Link to="/my-orders" className="btn btn-sm btn-primary fw-bold px-4 py-2 mt-2" style={{ borderRadius: 10, backgroundColor: '#4f46e5', border: 'none' }}>
                            View Delivered Orders
                        </Link>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-4">
                        {filteredReplaces.map(rep => (
                            <div key={rep.id} className="card border rounded-4 shadow-sm bg-white overflow-hidden mb-4">

                                {/* Card Header */}
                                <div className="card-header bg-light border-0 py-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
                                    <div className="d-flex align-items-center gap-3">
                                        <div>
                                            <div className="small text-muted fw-bold" style={{ fontSize: 10 }}>REPLACEMENT ID</div>
                                            <div className="fw-bold text-dark">{rep.replace_number}</div>
                                        </div>
                                        <div className="vr d-none d-sm-block" style={{ height: 28 }}></div>
                                        <div>
                                            <div className="small text-muted fw-bold" style={{ fontSize: 10 }}>ORDER NUMBER</div>
                                            <div className="fw-semibold text-dark">{rep.order_number}</div>
                                        </div>
                                        <div className="vr d-none d-sm-block" style={{ height: 28 }}></div>
                                        <div>
                                            <div className="small text-muted fw-bold" style={{ fontSize: 10 }}>INITIATED ON</div>
                                            <div className="fw-semibold text-dark">{formatDate(rep.created_at)}</div>
                                        </div>
                                        <div className="vr d-none d-sm-block" style={{ height: 28 }}></div>
                                        <div>
                                            <div className="small fw-bold" style={{ fontSize: 10, color: '#92400e' }}>
                                                <i className="fa-regular fa-calendar-clock me-1"></i>EXPECTED BY
                                            </div>
                                            <div className="fw-semibold" style={{ color: '#b45309' }}>{rep.expected_by}</div>
                                        </div>
                                        {rep.replace_status === 'replacement_delivered' && rep.completed_at && (
                                            <>
                                                <div className="vr d-none d-sm-block" style={{ height: 28 }}></div>
                                                <div>
                                                    <div className="small fw-bold" style={{ fontSize: 10, color: '#15803d' }}>
                                                        <i className="fa-solid fa-circle-check me-1"></i>COMPLETED ON
                                                    </div>
                                                    <div className="fw-semibold" style={{ color: '#166534' }}>{rep.completed_at}</div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <span className={`order-status-badge ${statusClasses[rep.replace_status]}`} style={{ borderRadius: 20, padding: '6px 16px' }}>
                                        <i className={`fa-solid ${statusIcons[rep.replace_status]} me-2`}></i>
                                        {rep.replace_status.replace(/_/g, ' ').toUpperCase()}
                                    </span>
                                </div>

                                {/* Card Body */}
                                <div className="card-body p-4">
                                    <div className="row g-4">

                                        {/* Left Side: Items & Exchange Mapping */}
                                        <div className="col-lg-8">
                                            <h5 className="fw-bold text-dark mb-3">Replacement Mapping</h5>
                                            <div className="d-flex flex-column gap-3">
                                                {rep.items_data?.map(item => {
                                                    const faultyImgUrl = item.image ? (item.image.startsWith('http') ? item.image : `${(process.env.REACT_APP_API_URL || "http://127.0.0.1:1000/").replace(/\/$/, "")}${item.image}`) : 'https://img.icons8.com/plasticine/100/package.png';
                                                    // Fallback to faulty image if replacement product image is not separately provided
                                                    const replacementImgUrl = faultyImgUrl;
                                                    return (
                                                        <div key={item.id} className="p-3 rounded-4 bg-light border">
                                                            <div className="row align-items-center g-3">
                                                                {/* Original product */}
                                                                <div className="col-md-5">
                                                                    <div className="d-flex align-items-center gap-3">
                                                                        <div className="bg-white rounded p-1 border d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, flexShrink: 0 }}>
                                                                            <img src={faultyImgUrl} alt="faulty item" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                                        </div>
                                                                        <div>
                                                                            <div className="small text-danger fw-bold"><i className="fa-solid fa-circle-arrow-down me-1"></i>FAULTY ITEM</div>
                                                                            <div className="fw-bold text-dark text-truncate" style={{ maxWidth: 180 }}>{item.product_name}</div>
                                                                            <div className="text-muted" style={{ fontSize: 11 }}>Quantity: {item.quantity} | {item.points} PTS</div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Exchange Indicator */}
                                                                <div className="col-md-2 text-center">
                                                                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary border" style={{ width: 36, height: 36 }}>
                                                                        <i className="fa-solid fa-right-left fa-sm"></i>
                                                                    </div>
                                                                </div>

                                                                {/* Replacement product */}
                                                                <div className="col-md-5">
                                                                    <div className="d-flex align-items-center gap-3">
                                                                        <div className="bg-white rounded p-1 border d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, flexShrink: 0 }}>
                                                                            <img src={replacementImgUrl} alt="replacement item" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                                        </div>
                                                                        <div>
                                                                            <div className="small text-success fw-bold"><i className="fa-solid fa-truck-ramp-box me-1"></i>REPLACEMENT ITEM</div>
                                                                            <div className="fw-bold text-dark text-truncate" style={{ maxWidth: 180 }}>
                                                                                {item.replacement_product_name || item.product_name}
                                                                            </div>
                                                                            <span className="badge bg-primary-subtle text-primary rounded-pill px-2 py-0.5" style={{ fontSize: 10 }}>
                                                                                Condition: {item.item_condition.replace(/_/g, ' ')}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Reason & Remarks */}
                                            <div className="mt-4 p-3 rounded-4 bg-light">
                                                <div className="fw-bold text-dark small mb-2">Issue / Defect Reason:</div>
                                                <div className="text-muted small bg-white p-3 rounded-3 border">
                                                    <div className="fw-bold text-dark mb-1">{rep.replace_reason.replace(/_/g, ' ').toUpperCase()}</div>
                                                    {rep.replace_note || 'No detailed comments provided.'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side: Amazon One-Trip Exchange Details */}
                                        <div className="col-lg-4">
                                            <div className="p-4 rounded-4 text-white mb-4" style={{ background: 'linear-gradient(135deg, #4f46e5, #4338ca)', boxShadow: '0 4px 12px rgba(79,70,229,0.2)' }}>
                                                <div className="small fw-semibold text-uppercase opacity-75">Exchange Mode</div>
                                                <h4 className="fw-bold mt-1 mb-2">One-Trip Swap</h4>
                                                <p className="small mb-0 opacity-95">The delivery agent will handover the new replacement item at the same time they collect your faulty product.</p>
                                            </div>

                                            {/* Proof Photos */}
                                            {rep.images_data && rep.images_data.length > 0 && (
                                                <div className="mb-4">
                                                    <h6 className="fw-bold text-dark mb-2">Defect Proof Uploads:</h6>
                                                    <div className="d-flex gap-2 flex-wrap">
                                                        {rep.images_data.map(img => (
                                                            <a href={img.image} target="_blank" rel="noreferrer" key={img.id} className="border rounded overflow-hidden" style={{ width: 60, height: 60 }}>
                                                                <img src={img.image} alt="proof" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* One-Trip Pickup & Delivery schedule details */}
                                            {rep.pickup_data && rep.pickup_data.length > 0 && (
                                                <div className="p-3 rounded-4 border bg-light">
                                                    <div className="fw-bold text-dark small mb-2 d-flex align-items-center gap-2">
                                                        <i className="fa-solid fa-truck text-primary"></i>
                                                        Dispatch Tracking
                                                    </div>
                                                    <div className="small text-muted mb-1">Exchange Status: <span className="fw-bold text-dark text-capitalize">{rep.pickup_data[0].pickup_status}</span></div>
                                                    {rep.pickup_data[0].courier_name && (
                                                        <div className="small text-muted mb-1">Partner: <span className="fw-semibold text-dark">{rep.pickup_data[0].courier_name}</span></div>
                                                    )}
                                                    {rep.pickup_data[0].tracking_number && (
                                                        <div className="small text-muted mb-1">Tracking #: <span className="fw-semibold text-primary">{rep.pickup_data[0].tracking_number}</span></div>
                                                    )}
                                                    <div className="small text-muted mt-2 border-top pt-2">Address: {rep.pickup_data[0].address_details.address}, {rep.pickup_data[0].address_details.city}</div>
                                                </div>
                                            )}
                                            {/* Cancellation Info Strip — shown when request was cancelled */}
                                            {rep.replace_status === 'rejected' && rep.cancel_info && (
                                                <div className="mt-4" style={{
                                                    background: 'linear-gradient(135deg, #fff1f2, #ffe4e6)',
                                                    border: '1.5px solid #fecdd3',
                                                    borderRadius: 16,
                                                    padding: '14px 18px',
                                                }}>
                                                    <div className="d-flex align-items-center gap-2 mb-2">
                                                        <div style={{
                                                            width: 30, height: 30,
                                                            borderRadius: '50%',
                                                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            flexShrink: 0,
                                                        }}>
                                                            <i className="fa-solid fa-ban" style={{ color: '#fff', fontSize: 12 }}></i>
                                                        </div>
                                                        <span className="fw-bold" style={{ fontSize: 13, color: '#991b1b', letterSpacing: '0.01em' }}>
                                                            Request Cancelled
                                                        </span>
                                                        <span className="ms-auto" style={{
                                                            fontSize: 11, color: '#b91c1c',
                                                            background: 'rgba(239,68,68,0.1)',
                                                            borderRadius: 20, padding: '2px 10px', fontWeight: 600,
                                                        }}>
                                                            {rep.cancel_info.cancelled_at}
                                                        </span>
                                                    </div>
                                                    <div className="d-flex align-items-start gap-2 mt-1">
                                                        <i className="fa-solid fa-user-circle mt-1" style={{ color: '#ef4444', fontSize: 13, flexShrink: 0 }}></i>
                                                        <div>
                                                            <span className="small text-muted">Cancelled by: </span>
                                                            <span className="fw-semibold small" style={{ color: '#991b1b' }}>
                                                                {rep.cancel_info.cancelled_by || 'Customer'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {rep.cancel_info.remarks && (
                                                        <div className="mt-2 pt-2" style={{ borderTop: '1px solid #fecdd3' }}>
                                                            <div className="small text-muted mb-1">
                                                                <i className="fa-solid fa-comment-dots me-1"></i>Reason:
                                                            </div>
                                                            <div className="small fw-semibold" style={{ color: '#7f1d1d', lineHeight: 1.5 }}>
                                                                {rep.cancel_info.remarks}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Cancel Replacement Request Button */}
                                            {rep.replace_status === 'requested' && (
                                                <button
                                                    className="btn btn-sm btn-outline-danger w-100 fw-bold py-2.5 mt-4"
                                                    style={{ borderRadius: 12, borderStyle: 'dashed' }}
                                                    onClick={() => openCancelModal(rep)}
                                                >
                                                    <i className="fa-solid fa-ban me-1"></i> Cancel Replacement Request
                                                </button>
                                            )}

                                            {/* Replacement Return Window Strip */}
                                            {['replacement_delivered'].includes(rep.replace_status) && rep.replacement_delivered_at && (() => {
                                                const d1 = new Date(rep.replacement_delivered_at);
                                                d1.setHours(0, 0, 0, 0);
                                                const d2 = new Date();
                                                d2.setHours(0, 0, 0, 0);
                                                const diff = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
                                                const windowOpen = diff <= 1;
                                                const closeDate = new Date(new Date(rep.replacement_delivered_at).setDate(
                                                    new Date(rep.replacement_delivered_at).getDate() + 1
                                                ));
                                                return (
                                                    <div className="mt-4 p-3 rounded-3 d-flex align-items-start gap-2 flex-column"
                                                        style={{
                                                            background: windowOpen ? 'linear-gradient(135deg,#fafafe,#f5f3ff)' : 'linear-gradient(135deg,#f8fafc,#f1f5f9)',
                                                            border: `1px solid ${windowOpen ? '#a5b4fc' : '#cbd5e1'}`,
                                                            fontSize: 12
                                                        }}>
                                                        <div className="d-flex align-items-center gap-2 fw-semibold" style={{ color: windowOpen ? '#4338ca' : '#64748b' }}>
                                                            <i className={`fa-solid ${windowOpen ? 'fa-rotate-left' : 'fa-lock'}`}></i>
                                                            {windowOpen ? 'Replaced Product — Return Window Open' : 'Replaced Product — Return Window Closed'}
                                                        </div>
                                                        <div style={{ color: windowOpen ? '#b45309' : '#94a3b8', fontSize: 11 }}>
                                                            {windowOpen
                                                                ? <><i className="fa-solid fa-clock-rotate-left me-1"></i>You can return the replacement item until <strong>{closeDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong> at 11:59 PM</>
                                                                : <><i className="fa-regular fa-calendar-xmark me-1 text-danger"></i>Window closed on <strong className="text-danger">{closeDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong> at 11:59 PM</>
                                                            }
                                                        </div>
                                                        {windowOpen && (
                                                            <Link to="/my-returns"
                                                                className="btn btn-sm fw-semibold mt-1"
                                                                style={{ fontSize: 11, borderRadius: 8, background: '#e0e7ff', color: '#4338ca', border: '1px solid #a5b4fc' }}>
                                                                <i className="fa-solid fa-rotate-left me-1"></i>Go to Returns
                                                            </Link>
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Replace Request Modal */}
                {isCreateModalOpen && (
                    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                        <div className="modal-dialog modal-lg modal-dialog-centered">
                            <div className="modal-content rounded-4 border-0 shadow-lg">
                                <div className="modal-header border-bottom-0 p-4">
                                    <h4 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                                        <i className="fa-solid fa-arrows-rotate text-primary"></i>
                                        Instant Exchange Request
                                    </h4>
                                    <button type="button" className="btn-close" onClick={() => setIsCreateModalOpen(false)}></button>
                                </div>
                                <form onSubmit={handleCreateReplaceSubmit}>
                                    <div className="modal-body p-4 pt-0" style={{ maxHeight: '65vh', overflowY: 'auto' }}>

                                        {errorMessage && (
                                            <div className="alert alert-danger rounded-3 small">
                                                <i className="fa-solid fa-triangle-exclamation me-2"></i>
                                                {errorMessage}
                                            </div>
                                        )}

                                        {/* Dropdown to select Order */}
                                        <div className="mb-4">
                                            <label className="form-label small fw-bold text-dark">Select Delivered Order</label>
                                            <select
                                                className="form-select border-0 bg-light rounded-4 px-3 py-2.5 text-dark fw-semibold" style={{ boxShadow: 'none', fontSize: '14px', color: '#2d3748', border: '1px solid #e2e8f0', borderRadius: '12px' }}
                                                required
                                                value={selectedOrder?.id || ''}
                                                onChange={(e) => {
                                                    const order = eligibleOrders.find(o => String(o.id) === String(e.target.value));
                                                    setSelectedOrder(order || null);
                                                    setSelectedItems({});
                                                }}
                                            >
                                                <option value="">-- Choose Order --</option>
                                                {eligibleOrders.map(order => (
                                                    <option key={order.id} value={order.id}>
                                                        Order {order.order_number} ({order.total_points} PTS) - Delivered on {formatDate(order.delivered_at)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Replace type selection */}
                                        {selectedOrder && (
                                            <div className="mb-4">
                                                <label className="form-label small fw-bold text-dark">Replacement Choice</label>
                                                <div className="d-flex gap-4">
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="replaceType"
                                                            id="sameItem"
                                                            value="same_item"
                                                            checked={replaceType === 'same_item'}
                                                            onChange={(e) => setReplaceType(e.target.value)}
                                                        />
                                                        <label className="form-check-label small" htmlFor="sameItem">
                                                            Replace with same product
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="replaceType"
                                                            id="diffVariant"
                                                            value="different_variant"
                                                            checked={replaceType === 'different_variant'}
                                                            onChange={(e) => setReplaceType(e.target.value)}
                                                        />
                                                        <label className="form-check-label small" htmlFor="diffVariant">
                                                            Replace with another color/size/variant
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Select Items inside selected order */}
                                        {selectedOrder && (
                                            <div className="mb-4">
                                                <label className="form-label small fw-bold text-dark">Select Products for Exchange</label>
                                                <div className="d-flex flex-column gap-3 p-3 rounded-4 bg-light border">
                                                    {selectedOrder.items?.map(item => {
                                                        const key = item.id;
                                                        const isChecked = selectedItems[key]?.checked || false;
                                                        const qty = selectedItems[key]?.qty || 1;
                                                        const condition = selectedItems[key]?.condition || 'defective';
                                                        const variantDetails = selectedItems[key]?.variantDetails || '';
                                                        const replacedQty = replacedQuantities[item.id] || 0;
                                                        const returnedQty = returnedQuantities[item.id] || 0;
                                                        const remainingQty = item.quantity - (replacedQty + returnedQty);
                                                        if (remainingQty <= 0) return null;

                                                        // ── Already Successfully Replaced ──
                                                        // Show read-only card; user can only return, not re-replace
                                                        if (successfullyReplacedItems.has(item.id)) {
                                                            const repDeliveredAt = replacementWindowMap[item.id];
                                                            const windowOpen = (() => {
                                                                if (!repDeliveredAt) return false;
                                                                const d1 = new Date(repDeliveredAt);
                                                                d1.setHours(0, 0, 0, 0);
                                                                const d2 = new Date();
                                                                d2.setHours(0, 0, 0, 0);
                                                                return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24)) <= 1;
                                                            })();
                                                            const windowCloseDate = repDeliveredAt
                                                                ? new Date(new Date(repDeliveredAt).setDate(new Date(repDeliveredAt).getDate() + 1))
                                                                : null;
                                                            return (
                                                                <div key={item.id} className="p-3 rounded-3 border d-flex align-items-center gap-3 flex-wrap"
                                                                    style={{ background: windowOpen ? 'linear-gradient(135deg,#fafafe,#f5f3ff)' : '#f8fafc', borderColor: windowOpen ? '#a5b4fc' : '#cbd5e1', opacity: 0.92 }}>
                                                                    <div className="rounded p-1 border d-flex align-items-center justify-content-center bg-light" style={{ width: 44, height: 44, flexShrink: 0 }}>
                                                                        <img src={item.image ? (item.image.startsWith('http') ? item.image : `${(process.env.REACT_APP_API_URL || "http://127.0.0.1:1000/").replace(/\/$/, "")}${item.image}`) : 'https://img.icons8.com/plasticine/144/package.png'}
                                                                            alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                                    </div>
                                                                    <div className="flex-grow-1">
                                                                        <div className="fw-semibold text-dark small d-flex align-items-center gap-2 flex-wrap">
                                                                            {item.product_name}
                                                                            <span className="badge rounded-pill px-2 py-1"
                                                                                style={{ fontSize: 10, background: windowOpen ? '#e0e7ff' : '#f1f5f9', color: windowOpen ? '#4338ca' : '#64748b', border: `1px solid ${windowOpen ? '#a5b4fc' : '#cbd5e1'}` }}>
                                                                                <i className={`fa-solid ${windowOpen ? 'fa-rotate-left' : 'fa-lock'} me-1`} style={{ fontSize: 9 }}></i>
                                                                                {windowOpen ? 'Already Replaced — Return Only' : 'Already Replaced — Return Window Closed'}
                                                                            </span>
                                                                        </div>
                                                                        <div className="small mt-1" style={{ fontSize: 11, color: windowOpen ? '#b45309' : '#94a3b8' }}>
                                                                            {windowOpen
                                                                                ? <><i className="fa-solid fa-clock-rotate-left me-1"></i>Return window open · closes on <strong>{windowCloseDate?.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong> at 11:59 PM</>
                                                                                : <><i className="fa-regular fa-calendar-xmark me-1 text-danger"></i>Return window closed on <strong className="text-danger">{windowCloseDate?.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong> at 11:59 PM</>}
                                                                        </div>
                                                                    </div>
                                                                    {windowOpen && (
                                                                        <Link to="/my-returns" className="btn btn-sm fw-semibold"
                                                                            style={{ fontSize: 11, borderRadius: 8, background: '#e0e7ff', color: '#4338ca', border: '1px solid #a5b4fc' }}>
                                                                            <i className="fa-solid fa-rotate-left me-1"></i>Go to Returns
                                                                        </Link>
                                                                    )}
                                                                </div>
                                                            );
                                                        }

                                                        return (
                                                            <div key={item.id} className="p-3 rounded-3 bg-white border">
                                                                <div className="d-flex align-items-center gap-3 flex-wrap">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        checked={isChecked}
                                                                        onChange={(e) => handleItemSelectionChange(item, e.target.checked)}
                                                                    />
                                                                    {/* Beautiful Product Thumbnail */}
                                                                    <div className="rounded p-1 border d-flex align-items-center justify-content-center bg-light" style={{ width: 44, height: 44, flexShrink: 0 }}>
                                                                        <img
                                                                            src={item.image
                                                                                ? (item.image.startsWith('http') ? item.image : `${(process.env.REACT_APP_API_URL || "http://127.0.0.1:1000/").replace(/\/$/, "")}${item.image}`)
                                                                                : `https://img.icons8.com/plasticine/144/package.png`}
                                                                            alt={item.product_name}
                                                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                                        />
                                                                    </div>
                                                                    <div className="flex-grow-1">
                                                                        <div className="fw-semibold text-dark small">{item.product_name}</div>
                                                                        <div className="text-muted" style={{ fontSize: 11 }}>Ordered: {item.quantity} Qty {replacedQty > 0 && <span className="text-success fw-semibold ms-2">({replacedQty} Replaced)</span>} {returnedQty > 0 && <span className="text-danger fw-semibold ms-2">({returnedQty} Returned)</span>} | {item.points} PTS</div>
                                                                    </div>

                                                                    {isChecked && (
                                                                        <div className="d-flex gap-2 align-items-center">
                                                                            <div className="d-flex align-items-center border rounded bg-light px-2.5 py-1 text-muted" style={{ fontSize: 12 }}>
                                                                                <span className="small fw-semibold">Replace Qty: {qty}</span>
                                                                            </div>
                                                                            <select
                                                                                className="form-select form-select-sm border"
                                                                                style={{ width: 130 }}
                                                                                value={condition}
                                                                                onChange={(e) => handleConditionChange(item.id, e.target.value)}
                                                                            >
                                                                                <option value="defective">Defective / Faulty</option>
                                                                                <option value="damaged">Damaged on arrival</option>
                                                                                <option value="wrong_item">Wrong Item Sent</option>
                                                                                <option value="wrong_color">Wrong Color / Size</option>
                                                                            </select>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Variant entry if different variant choice is made */}
                                                                {isChecked && replaceType === 'different_variant' && (
                                                                    <div className="mt-3 border-top pt-3">
                                                                        <label className="form-label small text-muted" style={{ fontSize: 11 }}>Specify your desired variant (e.g. Blue color, Size XL, 64GB Variant):</label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm rounded border"
                                                                            value={variantDetails}
                                                                            placeholder="Enter variant requirements..."
                                                                            required
                                                                            onChange={(e) => handleVariantDetailsChange(item.id, e.target.value)}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Reason & Comments */}
                                        <div className="row g-3 mb-4">
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-dark">Replacement Reason Category</label>
                                                <select
                                                    className="form-select rounded-3 p-2 border"
                                                    value={replaceReason}
                                                    onChange={(e) => setReplaceReason(e.target.value)}
                                                    required
                                                >
                                                    <option value="">-- Select Reason --</option>
                                                    <option value="damaged_on_arrival">Damaged on arrival</option>
                                                    <option value="incorrect_item_sent">Incorrect item sent</option>
                                                    <option value="defective_parts">Defective parts / malfunctioning</option>
                                                    <option value="mismatch">Specifications mismatch</option>
                                                    <option value="other">Other issue</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-dark">Detailed Notes</label>
                                                <textarea
                                                    className="form-control rounded-3 border"
                                                    rows="2"
                                                    value={replaceNote}
                                                    placeholder="Provide any additional comments or specifics about the issue..."
                                                    onChange={(e) => setReplaceNote(e.target.value)}
                                                ></textarea>
                                            </div>
                                        </div>

                                        {/* Image proof upload */}
                                        <div className="mb-4">
                                            <label className="form-label small fw-bold text-dark">Upload Proof Photos (Min 1, Max 5)</label>
                                            <div className="d-flex gap-2 flex-wrap mb-2">
                                                {images.map((img, idx) => (
                                                    <div key={idx} className="position-relative border rounded" style={{ width: 80, height: 80 }}>
                                                        <img src={URL.createObjectURL(img)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-danger position-absolute top-0 end-0 py-0 px-1"
                                                            style={{ fontSize: 10, borderRadius: '50%' }}
                                                            onClick={() => handleRemoveImage(idx)}
                                                        >
                                                            &times;
                                                        </button>
                                                    </div>
                                                ))}
                                                {images.length < 5 && (
                                                    <label className="border rounded d-flex flex-column align-items-center justify-content-center bg-light cursor-pointer" style={{ width: 80, height: 80, cursor: 'pointer' }}>
                                                        <i className="fa-solid fa-camera text-muted mb-1"></i>
                                                        <span className="text-muted" style={{ fontSize: 9 }}>Add Photo</span>
                                                        <input
                                                            type="file"
                                                            className="d-none"
                                                            accept="image/*"
                                                            multiple
                                                            onChange={handleImageChange}
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                            <div className="small text-muted" style={{ fontSize: 11 }}>Please upload clear images showing the product and labels.</div>
                                        </div>

                                    </div>
                                    <div className="modal-footer border-top-0 p-4 pt-0">
                                        <button type="button" className="btn btn-light fw-bold" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary fw-bold"
                                            style={{ backgroundColor: '#4f46e5', border: 'none' }}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Submitting Swap...' : 'Confirm Exchange Swap'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

            {/* Replacement Request Cancel Modal */}
            {cancelModal.open && (
                <div className="cancel-modal-overlay" onClick={closeCancelModal}>
                    <div className="cancel-modal-box" onClick={e => e.stopPropagation()}>
                        <div className="cancel-modal-header">
                            <div className="cancel-modal-icon">
                                <i className="fa-solid fa-triangle-exclamation"></i>
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1 text-dark">Cancel Replacement?</h5>
                                <p className="text-muted small mb-0">This action cannot be undone.</p>
                            </div>
                            <button className="btn-close ms-auto" onClick={closeCancelModal}></button>
                        </div>
                        <div className="cancel-modal-body">
                            <div className="cancel-order-preview">
                                <i className="fa-solid fa-arrows-rotate text-muted me-2"></i>
                                <span className="small text-dark fw-semibold">Replacement Request: {cancelModal.replaceNumber}</span>
                            </div>
                            <div className="cancel-info-banner" style={{ background: 'linear-gradient(135deg, #f0fdf4, #e8f9f2)', border: '1px solid #c6f6e0', color: '#2d7a56' }}>
                                <i className="fa-solid fa-circle-info text-success me-2"></i>
                                <span>Cancelling this request will release the item quantity for new return or replacement requests.</span>
                            </div>
                            <div className="mt-3">
                                <label className="form-label checkout-label">Select Cancellation Reason *</label>
                                <div className="cancel-reasons">
                                    {cancelReasons.map(reason => (
                                        <label key={reason} className={`cancel-reason-option ${cancelReason === reason ? 'selected' : ''}`}>
                                            <input
                                                type="radio"
                                                name="cancelReason"
                                                value={reason}
                                                checked={cancelReason === reason}
                                                onChange={() => setCancelReason(reason)}
                                                hidden
                                            />
                                            <i className={`fa-solid ${cancelReason === reason ? 'fa-circle-check text-danger' : 'fa-circle text-muted'} me-2`}></i>
                                            {reason}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="cancel-modal-footer">
                            <button className="btn checkout-btn-secondary px-4 py-2 fw-semibold" onClick={closeCancelModal}>
                                Keep Request
                            </button>
                            <button
                                className="btn cancel-confirm-btn px-4 py-2 fw-bold"
                                onClick={confirmCancelReplace}
                                disabled={!cancelReason}
                            >
                                <i className="fa-solid fa-ban me-2"></i>
                                Confirm Cancellation
                            </button>
                        </div>
                    </div>
                </div>
            )}

            </div>
        </div>
    );
};

export default MyReplaces;
