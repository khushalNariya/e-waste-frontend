import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getMyReturnsAPI, getMyReplacesAPI, getMyOrdersAPI, submitReturnRequestAPI, cancelReturnRequestAPI } from '../../../services/user-api/API_Service';
import './Styles/Checkout.css';

const MyReturns = () => {
    const location = useLocation();
    const [returns, setReturns] = useState([]);
    const [deliveredOrders, setDeliveredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');

    // Modal states for creating a return request
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [returnReason, setReturnReason] = useState('');
    const [returnNote, setReturnNote] = useState('');
    const [selectedItems, setSelectedItems] = useState({}); // { order_item_id: { checked: bool, qty: number, condition: string } }
    const [images, setImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [returnedQuantities, setReturnedQuantities] = useState({});
    const [cancelModal, setCancelModal] = useState({ open: false, returnId: null, returnNumber: '' });
    const [cancelReason, setCancelReason] = useState('');
    const cancelReasons = [
        "Decided to keep the product",
        "Ordered replacement instead",
        "Issue resolved by customer support",
        "Incorrect return reason selected",
        "Other reasons"
    ];
    const [replacedQuantities, setReplacedQuantities] = useState({});

    useEffect(() => {
        fetchReturnsData();
    }, []);

    useEffect(() => {
        if (location.state?.openCreateModal && location.state?.selectOrderId && deliveredOrders.length > 0) {
            const order = deliveredOrders.find(o =>
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
                                condition: 'wrong_item',
                                productId: targetItem.product_id
                            }
                        });
                    }
                }
            }
        }
    }, [location.state, deliveredOrders]);

    const openCancelModal = (retRequest) => {
        setCancelReason('');
        setCancelModal({ open: true, returnId: retRequest.id, returnNumber: retRequest.return_number });
    };

    const closeCancelModal = () => {
        setCancelModal({ open: false, returnId: null, returnNumber: '' });
        setCancelReason('');
    };

    const confirmCancelReturn = async () => {
        if (!cancelReason) return;
        try {
            setLoading(true);
            await cancelReturnRequestAPI(cancelModal.returnId, cancelReason);
            setSuccessMessage(`Return request ${cancelModal.returnNumber} cancelled successfully.`);
            closeCancelModal();
            await fetchReturnsData();
        } catch (error) {
            console.error("Error cancelling return request:", error);
            alert(error.response?.data?.error || "Failed to cancel return request. Please try again.");
            setLoading(false);
        }
    };

    const fetchReturnsData = async () => {
        setLoading(true);
        try {
            // Fetch return requests and replacement requests in parallel
            const [returnsResponse, replacesResponse] = await Promise.all([
                getMyReturnsAPI(),
                getMyReplacesAPI()
            ]);
            const returnsData = returnsResponse.data.results || returnsResponse.data || [];
            const replacesData = replacesResponse.data.results || replacesResponse.data || [];
            setReturns(returnsData);

            // Fetch delivered orders for the dropdown/modal (to initiate returns)
            const ordersResponse = await getMyOrdersAPI();
            const delivered = (ordersResponse.data.results || ordersResponse.data || []).filter(order => {
                if (order.order_status !== 'delivered' || !order.delivered_at) {
                    return false;
                }

                // Check 1 calendar day eligibility window
                const d1 = new Date(order.delivered_at);
                d1.setHours(0, 0, 0, 0);
                const d2 = new Date();
                d2.setHours(0, 0, 0, 0);

                const diffDays = Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
                return diffDays <= 1;
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

            // Map order_item_id -> total replaced quantity across active replacements
            const replacedItemQuantities = {};
            replacesData
                .filter(rep => rep.replace_status !== 'rejected')
                .forEach(rep => {
                    rep.items_data?.forEach(item => {
                        const orderItemId = item.order_item;
                        replacedItemQuantities[orderItemId] = (replacedItemQuantities[orderItemId] || 0) + item.quantity;
                    });
                });

            setReturnedQuantities(returnedItemQuantities);
            setReplacedQuantities(replacedItemQuantities);

            // ---------------------------------------------------------
            // Helper: check if ISO timestamp is within 1 calendar day
            // ---------------------------------------------------------
            const isWithin1Day = (isoDate) => {
                if (!isoDate) return false;
                const d1 = new Date(isoDate);
                d1.setHours(0, 0, 0, 0);
                const d2 = new Date();
                d2.setHours(0, 0, 0, 0);
                return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24)) <= 1;
            };

            // Only show delivered orders that have AT LEAST ONE item not fully returned or replaced yet
            const availableForReturn = delivered.filter(order => {
                const hasReturnableItems = order.items?.some(item => {
                    const returnedQty = returnedItemQuantities[item.id] || 0;
                    const replacedQty = replacedItemQuantities[item.id] || 0;
                    return item.quantity > (returnedQty + replacedQty);
                });
                return hasReturnableItems;
            });

            // ---------------------------------------------------------
            // REPLACEMENT RETURN WINDOW
            // Find orders where replacement was delivered within 1 day.
            // These orders may have their original window closed but the
            // replaced items can still be returned (replacement window).
            // ---------------------------------------------------------
            const ordersAlreadyIncluded = new Set(availableForReturn.map(o => o.order_number));
            const allOrders = ordersResponse.data.results || ordersResponse.data || [];

            replacesData
                .filter(rep =>
                    ['replacement_delivered'].includes(rep.replace_status) &&
                    rep.replacement_delivered_at &&
                    isWithin1Day(rep.replacement_delivered_at)
                )
                .forEach(rep => {
                    // Find matching raw order from fetched orders
                    const matchedOrder = allOrders.find(o => o.order_number === rep.order_number);
                    if (!matchedOrder) return;

                    // Build set of order_item IDs that were replaced in this replacement request
                    const replacedOrderItemIds = new Set(rep.items_data?.map(i => i.order_item) || []);

                    if (ordersAlreadyIncluded.has(matchedOrder.order_number)) {
                        // Order already in list — just enrich it with replacement window info
                        const existing = availableForReturn.find(o => o.order_number === matchedOrder.order_number);
                        if (existing) {
                            existing._replacementWindowOpen = true;
                            existing._replacedOrderItemIds = [
                                ...(existing._replacedOrderItemIds || []),
                                ...replacedOrderItemIds
                            ];
                            existing._replacementDeliveredAt = rep.replacement_delivered_at;
                        }
                    } else {
                        // Order not yet included — add it with replacement-only flag
                        ordersAlreadyIncluded.add(matchedOrder.order_number);
                        availableForReturn.push({
                            ...matchedOrder,
                            _replacementWindowOnly: true,
                            _replacementWindowOpen: true,
                            _replacedOrderItemIds: [...replacedOrderItemIds],
                            _replacementDeliveredAt: rep.replacement_delivered_at,
                        });
                    }
                });

            setDeliveredOrders(availableForReturn);
        } catch (error) {
            console.error("Error fetching returns data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle checkboxes and quantities in return request creation
    const handleItemSelectionChange = (item, checked) => {
        const returnedQty = returnedQuantities[item.id] || 0;
        const replacedQty = replacedQuantities[item.id] || 0;
        const isReplacedItem = selectedOrder?._replacedOrderItemIds?.includes(item.id);
        const remainingQty = isReplacedItem && selectedOrder?._replacementWindowOpen
            ? replacedQty - returnedQty
            : item.quantity - (returnedQty + replacedQty);

        setSelectedItems(prev => ({
            ...prev,
            [item.id]: {
                checked,
                qty: remainingQty,
                condition: prev[item.id]?.condition || 'wrong_item',
                productId: item.product_id
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

    // Create Return Submit
    const handleCreateReturnSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!selectedOrder) {
            setErrorMessage('Please select an order to return.');
            return;
        }

        const itemsToReturn = Object.entries(selectedItems)
            .filter(([_, value]) => value.checked)
            .map(([orderItemId, value]) => ({
                order_item_id: parseInt(orderItemId),
                product_id: value.productId,
                quantity: value.qty,
                item_condition: value.condition
            }));

        if (itemsToReturn.length === 0) {
            setErrorMessage('Please check at least one item to return.');
            return;
        }

        if (images.length < 1) {
            setErrorMessage('Please upload at least 1 image proof.');
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('order_id', selectedOrder.id);
        formData.append('return_reason', returnReason);
        formData.append('return_note', returnNote);
        formData.append('return_items', JSON.stringify(itemsToReturn));

        images.forEach(img => {
            formData.append('images', img);
        });

        try {
            await submitReturnRequestAPI(formData);
            setSuccessMessage('Return request submitted successfully!');
            setIsCreateModalOpen(false);

            // Reset states
            setSelectedOrder(null);
            setReturnReason('');
            setReturnNote('');
            setSelectedItems({});
            setImages([]);

            // Refresh data
            fetchReturnsData();
        } catch (error) {
            console.error("Error submitting return:", error);
            const errDetail = error.response?.data;
            if (typeof errDetail === 'object') {
                const combinedErrors = Object.entries(errDetail)
                    .map(([key, val]) => `${key}: ${Array.isArray(val) ? val[0] : val}`)
                    .join(' | ');
                setErrorMessage(combinedErrors || 'Failed to submit return request.');
            } else {
                setErrorMessage(error.response?.data?.error || 'Failed to submit return request.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Date formatter
    const formatDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    // CSS status classes
    const statusClasses = {
        requested: 'status-processing',
        approved: 'status-processing',
        pickup_scheduled: 'status-processing',
        picked_up: 'status-shipped',
        received: 'status-shipped',
        inspected: 'status-shipped',
        refund_approved: 'status-delivered',
        refunded: 'status-delivered',
        rejected: 'status-cancelled'
    };

    const statusIcons = {
        requested: 'fa-clock',
        approved: 'fa-circle-check',
        pickup_scheduled: 'fa-calendar-days',
        picked_up: 'fa-truck-ramp-box',
        received: 'fa-warehouse',
        inspected: 'fa-circle-check',
        refund_approved: 'fa-credit-card',
        refunded: 'fa-rotate-left',
        rejected: 'fa-ban'
    };

    const filteredReturns = activeTab === 'All'
        ? returns
        : returns.filter(ret => {
            if (activeTab === 'Refunded') return ret.return_status === 'refunded';
            if (activeTab === 'Pending') return !['refunded', 'rejected'].includes(ret.return_status);
            if (activeTab === 'Rejected') return ret.return_status === 'rejected';
            return true;
        });

    return (
        <div className="orders-page" style={{ fontFamily: '"Inter", sans-serif', minHeight: '80vh', padding: '40px 0' }}>
            <div className="container">

                {/* Headers */}
                <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
                    <div>
                        <h2 className="fw-bold text-dark mb-1">My Product Returns</h2>
                        <p className="text-muted mb-0">Track and manage your reward product return requests</p>
                    </div>
                    {deliveredOrders.length > 0 ? (
                        <button
                            className="btn btn-success fw-bold px-4 py-2"
                            style={{ borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(28, 200, 138, 0.2)' }}
                            onClick={() => {
                                setIsCreateModalOpen(true);
                                setErrorMessage('');
                            }}
                        >
                            <i className="fa-solid fa-rotate-left"></i>
                            Request a Return
                        </button>
                    ) : (
                        <div className="alert alert-light border small text-muted mb-0 py-2 px-3 rounded-3">
                            <i className="fa-solid fa-circle-info me-2 text-warning"></i>
                            Only delivered items can be returned.
                        </div>
                    )}
                </div>

                {/* Toast alerts */}
                {successMessage && (
                    <div className="alert alert-success alert-dismissible fade show rounded-4 mb-4" role="alert">
                        <i className="fa-solid fa-circle-check me-2"></i>
                        {successMessage}
                        <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
                    </div>
                )}

                {/* Filter Tabs */}
                <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
                    <div className="d-flex gap-2 bg-light p-1 rounded-3">
                        {['All', 'Pending', 'Refunded', 'Rejected'].map(tab => (
                            <button
                                key={tab}
                                className={`btn btn-sm px-4 py-2 fw-semibold ${activeTab === tab ? 'bg-white shadow-sm text-success' : 'text-muted'}`}
                                style={{ borderRadius: 8, border: 'none', transition: 'all 0.2s' }}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="small text-muted fw-semibold">
                        Showing {filteredReturns.length} Return Requests
                    </div>
                </div>

                {/* List container */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : filteredReturns.length === 0 ? (
                    <div className="text-center py-5 bg-white border rounded-4">
                        <i className="fa-solid fa-rotate-left fa-3x text-muted mb-3 opacity-50"></i>
                        <h4 className="fw-bold text-dark">No returns found</h4>
                        <p className="text-muted small">You don't have any return requests matching the filters.</p>
                        <Link to="/reward-store" className="btn btn-sm btn-outline-success fw-bold px-4 py-2 mt-2" style={{ borderRadius: 10 }}>
                            Browse Reward Store
                        </Link>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-4">
                        {filteredReturns.map(ret => (
                            <div key={ret.id} className="card border rounded-4 shadow-sm bg-white overflow-hidden mb-4">

                                {/* Return Card Header */}
                                <div className="card-header bg-light border-0 py-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
                                    <div className="d-flex align-items-center gap-3">
                                        <div>
                                            <div className="small text-muted fw-bold">RETURN NUMBER</div>
                                            <div className="fw-bold text-dark">{ret.return_number}</div>
                                        </div>
                                        <div className="vr d-none d-sm-block" style={{ height: 28 }}></div>
                                        <div>
                                            <div className="small text-muted fw-bold">ORDER NUMBER</div>
                                            <div className="fw-semibold text-dark">{ret.order_number}</div>
                                        </div>
                                        <div className="vr d-none d-sm-block" style={{ height: 28 }}></div>
                                        <div>
                                            <div className="small text-muted fw-bold">REQUESTED ON</div>
                                            <div className="fw-semibold text-dark">{formatDate(ret.created_at)}</div>
                                        </div>
                                        <div className="vr d-none d-sm-block" style={{ height: 28 }}></div>
                                        <div>
                                            <div className="small fw-bold" style={{ color: '#92400e' }}>
                                                <i className="fa-regular fa-calendar-clock me-1"></i>EXPECTED BY
                                            </div>
                                            <div className="fw-semibold" style={{ color: '#b45309' }}>{ret.expected_by}</div>
                                        </div>
                                        {ret.return_status === 'refunded' && ret.completed_at && (
                                            <>
                                                <div className="vr d-none d-sm-block" style={{ height: 28 }}></div>
                                                <div>
                                                    <div className="small fw-bold" style={{ color: '#15803d' }}>
                                                        <i className="fa-solid fa-circle-check me-1"></i>COMPLETED ON
                                                    </div>
                                                    <div className="fw-semibold" style={{ color: '#166534' }}>{ret.completed_at}</div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <span className={`order-status-badge ${statusClasses[ret.return_status]}`}>
                                        <i className={`fa-solid ${statusIcons[ret.return_status]} me-1`}></i>
                                        {ret.return_status.replace(/_/g, ' ').toUpperCase()}
                                    </span>
                                </div>

                                {/* Return Card Body */}
                                <div className="card-body p-4">
                                    <div className="row g-4">

                                        {/* Products list in return */}
                                        <div className="col-lg-8">
                                            <h5 className="fw-bold text-dark mb-3">Returned Items</h5>
                                            <div className="d-flex flex-column gap-3">
                                                {ret.items_data?.map(item => {
                                                    const imgUrl = item.image ? (item.image.startsWith('http') ? item.image : `${(process.env.REACT_APP_API_URL || "http://127.0.0.1:1000/").replace(/\/$/, "")}${item.image}`) : 'https://img.icons8.com/plasticine/100/package.png';
                                                    return (
                                                        <div key={item.id} className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light border">
                                                            <div className="bg-white rounded p-1 border d-flex align-items-center justify-content-center" style={{ width: 64, height: 64, flexShrink: 0 }}>
                                                                <img src={imgUrl} alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                            </div>
                                                            <div className="flex-grow-1">
                                                                <div className="fw-bold text-dark">{item.product_name}</div>
                                                                <div className="small text-muted">Quantity: {item.quantity} | Points per item: {item.points} PTS</div>
                                                                <span className="badge bg-warning-subtle text-warning border border-warning-subtle rounded-pill px-2 py-1 small mt-1 d-inline-block">
                                                                    Condition: {item.item_condition.replace(/_/g, ' ')}
                                                                </span>
                                                            </div>
                                                            <div className="fw-bold text-success text-end">
                                                                {item.subtotal_points.toLocaleString()} PTS
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="mt-4 p-3 rounded-4 bg-light">
                                                <div className="fw-bold text-dark mb-2">Reason for Return:</div>
                                                <div className="text-muted small bg-white p-3 rounded-3 border">
                                                    <div className="fw-bold text-dark mb-1">{ret.return_reason.replace(/_/g, ' ').toUpperCase()}</div>
                                                    {ret.return_note || 'No notes provided by user.'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Refund Summary and Images */}
                                        <div className="col-lg-4">
                                            <div className="p-4 rounded-4 bg-success-subtle border border-success-subtle text-success mb-4">
                                                <div className="small fw-semibold text-uppercase opacity-75">Estimated Refund Value</div>
                                                <div className="display-6 fw-bold mt-1 mb-2">{ret.refund_points.toLocaleString()} <span style={{ fontSize: 18 }}>PTS</span></div>
                                                <div className="small opacity-90">Points will credit automatically into your Wallet once "Refund Approved" status is updated.</div>
                                            </div>

                                            {ret.images_data && ret.images_data.length > 0 && (
                                                <div>
                                                    <h6 className="fw-bold text-dark mb-2">Proof Uploads:</h6>
                                                    <div className="d-flex gap-2 flex-wrap">
                                                        {ret.images_data.map(img => (
                                                            <a href={img.image} target="_blank" rel="noreferrer" key={img.id} className="border rounded overflow-hidden" style={{ width: 60, height: 60 }}>
                                                                <img src={img.image} alt="proof" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Pickup schedule summary info */}
                                            {ret.pickup_data && ret.pickup_data.length > 0 && (
                                                <div className="mt-4 p-3 rounded-3 border bg-light">
                                                    <div className="fw-bold text-dark small mb-1"><i className="fa-solid fa-truck-fast me-2 text-success"></i>Pickup Status</div>
                                                    <div className="small text-muted">Status: <span className="fw-bold text-dark text-capitalize">{ret.pickup_data[0].pickup_status}</span></div>
                                                    <div className="small text-muted mt-2">Address: {ret.pickup_data[0].address_details.address}, {ret.pickup_data[0].address_details.city}</div>
                                                </div>
                                            )}
                                            {/* Cancellation Info Strip — shown when request was cancelled */}
                                            {ret.return_status === 'rejected' && ret.cancel_info && (
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
                                                            {ret.cancel_info.cancelled_at}
                                                        </span>
                                                    </div>
                                                    <div className="d-flex align-items-start gap-2 mt-1">
                                                        <i className="fa-solid fa-user-circle mt-1" style={{ color: '#ef4444', fontSize: 13, flexShrink: 0 }}></i>
                                                        <div>
                                                            <span className="small text-muted">Cancelled by: </span>
                                                            <span className="fw-semibold small" style={{ color: '#991b1b' }}>
                                                                {ret.cancel_info.cancelled_by || 'Customer'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {ret.cancel_info.remarks && (
                                                        <div className="mt-2 pt-2" style={{ borderTop: '1px solid #fecdd3' }}>
                                                            <div className="small text-muted mb-1">
                                                                <i className="fa-solid fa-comment-dots me-1"></i>Reason:
                                                            </div>
                                                            <div className="small fw-semibold" style={{ color: '#7f1d1d', lineHeight: 1.5 }}>
                                                                {ret.cancel_info.remarks}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Cancel Return Request Button */}
                                            {ret.return_status === 'requested' && (
                                                <button
                                                    className="btn btn-sm btn-outline-danger w-100 fw-bold py-2.5 mt-4"
                                                    style={{ borderRadius: 12, borderStyle: 'dashed' }}
                                                    onClick={() => openCancelModal(ret)}
                                                >
                                                    <i className="fa-solid fa-ban me-1"></i> Cancel Return Request
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Return Request Modal */}
                {isCreateModalOpen && (
                    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                        <div className="modal-dialog modal-lg modal-dialog-centered">
                            <div className="modal-content rounded-4 border-0 shadow-lg">
                                <div className="modal-header border-bottom-0 p-4">
                                    <h4 className="modal-title fw-bold text-dark">Submit Return Request</h4>
                                    <button type="button" className="btn-close" onClick={() => setIsCreateModalOpen(false)}></button>
                                </div>
                                <form onSubmit={handleCreateReturnSubmit}>
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
                                                    const order = deliveredOrders.find(o => String(o.id) === String(e.target.value));
                                                    setSelectedOrder(order || null);
                                                    setSelectedItems({});
                                                }}
                                            >
                                                <option value="">-- Choose Delivered Order --</option>
                                                {deliveredOrders.map(order => (
                                                    <option key={order.id} value={order.id}>
                                                        Order {order.order_number} ({order.total_points} PTS) - {formatDate(order.created_at)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Select Items inside selected order */}
                                        {selectedOrder && (
                                            <div className="mb-4">
                                                <label className="form-label small fw-bold text-dark">Select Items &amp; Quantities to Return</label>

                                                {/* Replacement Window Notice Banner */}
                                                {selectedOrder._replacementWindowOnly && (
                                                    <div className="mb-3 p-3 rounded-3 d-flex align-items-center gap-2"
                                                        style={{ background: 'linear-gradient(135deg,#e0e7ff,#c7d2fe)', border: '1px solid #a5b4fc', fontSize: 12 }}>
                                                        <i className="fa-solid fa-arrows-rotate text-primary"></i>
                                                        <span className="fw-semibold text-primary">Replacement Return Window</span>
                                                        <span className="text-dark-50">— You can only return the <strong>replaced product</strong> you received. Original window has closed.</span>
                                                    </div>
                                                )}

                                                <div className="d-flex flex-column gap-3 p-3 rounded-4 bg-light border">
                                                    {selectedOrder.items?.map(item => {
                                                        const key = item.id;
                                                        const isChecked = selectedItems[key]?.checked || false;
                                                        const qty = selectedItems[key]?.qty || 1;
                                                        const condition = selectedItems[key]?.condition || 'wrong_item';
                                                        const returnedQty = returnedQuantities[item.id] || 0;
                                                        const replacedQty = replacedQuantities[item.id] || 0;

                                                        const isReplacedItem = selectedOrder._replacedOrderItemIds?.includes(item.id);

                                                        // If the replacement return window is open and this item was replaced,
                                                        // the user returns the replacement product (up to replacedQty - returnedQty).
                                                        // Otherwise, it is the normal remaining original item quantity.
                                                        const remainingQty = isReplacedItem && selectedOrder._replacementWindowOpen
                                                            ? replacedQty - returnedQty
                                                            : item.quantity - (returnedQty + replacedQty);

                                                        if (remainingQty <= 0) return null;

                                                        // If order is in replacement-window-only mode, only show replaced items
                                                        if (selectedOrder._replacementWindowOnly && !isReplacedItem) return null;

                                                        return (
                                                            <div key={item.id} className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-white border gap-3 flex-wrap flex-md-nowrap"
                                                                style={isReplacedItem && selectedOrder._replacementWindowOpen
                                                                    ? { borderColor: '#a5b4fc', background: 'linear-gradient(135deg,#fafafe,#f5f3ff)' }
                                                                    : {}}>
                                                                <div className="d-flex align-items-center gap-3 min-w-0 flex-grow-1">
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

                                                                    <div className="min-w-0 flex-grow-1">
                                                                        <div className="fw-semibold text-dark small mb-1">
                                                                            {item.product_name}
                                                                        </div>
                                                                        {isReplacedItem && selectedOrder._replacementWindowOpen && (
                                                                            <div className="mb-1">
                                                                                <span className="badge rounded-pill px-2 py-1" style={{ fontSize: 10, background: '#e0e7ff', color: '#4338ca', border: '1px solid #a5b4fc', display: 'inline-block' }}>
                                                                                    <i className="fa-solid fa-arrows-rotate me-1" style={{ fontSize: 9 }}></i>Replaced Product — Return Only
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                        <div className="text-muted" style={{ fontSize: 12 }}>Ordered: {item.quantity} Qty {returnedQty > 0 && <span className="text-success fw-semibold ms-2">({returnedQty} Returned)</span>} {replacedQty > 0 && <span className="text-primary fw-semibold ms-2">({replacedQty} Replaced)</span>} | {item.points} PTS</div>
                                                                    </div>
                                                                </div>

                                                                {isChecked && (
                                                                    <div className="d-flex gap-2 align-items-center flex-shrink-0">
                                                                        <div className="d-flex align-items-center border rounded bg-light px-2.5 py-1 text-muted" style={{ fontSize: 12 }}>
                                                                            <span className="small fw-semibold">Return Qty: {qty}</span>
                                                                        </div>
                                                                        <select
                                                                            className="form-select form-select-sm border bg-white"
                                                                            style={{ width: 130 }}
                                                                            value={condition}
                                                                            onChange={(e) => handleConditionChange(item.id, e.target.value)}
                                                                        >
                                                                            <option value="wrong_item">Wrong Item</option>
                                                                            <option value="damaged">Damaged Product</option>
                                                                            <option value="size_issue">Size / Style issue</option>
                                                                            <option value="not_satisfied">Quality issue</option>
                                                                        </select>
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
                                                <label className="form-label small fw-bold text-dark">Return Reason Category</label>
                                                <select
                                                    className="form-select rounded-3 p-2 border"
                                                    value={returnReason}
                                                    onChange={(e) => setReturnReason(e.target.value)}
                                                    required
                                                >
                                                    <option value="">-- Select Reason --</option>
                                                    <option value="damaged_on_arrival">Damaged on arrival</option>
                                                    <option value="incorrect_item_sent">Incorrect item sent</option>
                                                    <option value="poor_quality">Quality mismatch</option>
                                                    <option value="other">Other reason</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-dark">Detail Comments</label>
                                                <textarea
                                                    className="form-control rounded-3 border"
                                                    rows="2"
                                                    value={returnNote}
                                                    placeholder="Enter any comments for verification..."
                                                    onChange={(e) => setReturnNote(e.target.value)}
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
                                            className="btn btn-success fw-bold"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

            {/* Return Request Cancel Modal */}
            {cancelModal.open && (
                <div className="cancel-modal-overlay" onClick={closeCancelModal}>
                    <div className="cancel-modal-box" onClick={e => e.stopPropagation()}>
                        <div className="cancel-modal-header">
                            <div className="cancel-modal-icon">
                                <i className="fa-solid fa-triangle-exclamation"></i>
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1 text-dark">Cancel Return?</h5>
                                <p className="text-muted small mb-0">This action cannot be undone.</p>
                            </div>
                            <button className="btn-close ms-auto" onClick={closeCancelModal}></button>
                        </div>
                        <div className="cancel-modal-body">
                            <div className="cancel-order-preview">
                                <i className="fa-solid fa-rotate-left text-muted me-2"></i>
                                <span className="small text-dark fw-semibold">Return Request: {cancelModal.returnNumber}</span>
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
                                onClick={confirmCancelReturn}
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

export default MyReturns;
