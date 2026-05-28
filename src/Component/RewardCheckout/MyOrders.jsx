import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Styles/Checkout.css';
import { getMyOrdersAPI, cancelOrderAPI, getMyReturnsAPI, getMyReplacesAPI } from '../User-Interface-API/API_Service';

// UI Components
import OrdersHeader from './MyOrders_UI_Components/OrdersHeader';
import FilterTabs from './MyOrders_UI_Components/FilterTabs';
import OrderCard from './MyOrders_UI_Components/OrderCard';
import CancelModal from './MyOrders_UI_Components/CancelModal';
import EmptyOrders from './MyOrders_UI_Components/EmptyOrders';

const ORDERS_CACHE_KEY = 'my_orders_cache';

const MyOrders = () => {
    // ✅ Initialize from cache immediately — avoids blank spinner on re-navigation
    const [orders, setOrders] = useState(() => {
        try {
            const cached = sessionStorage.getItem(ORDERS_CACHE_KEY);
            return cached ? JSON.parse(cached) : [];
        } catch { return []; }
    });
    const [activeTab, setActiveTab] = useState('All');
    const [expandedOrder, setExpandedOrder] = useState(null);
    // Only show loading spinner when there is no cached data at all
    const [loading, setLoading] = useState(() => !sessionStorage.getItem(ORDERS_CACHE_KEY));

    // Cancel modal state
    const [cancelModal, setCancelModal] = useState({ open: false, orderId: null, orderName: '' });
    const [cancelReason, setCancelReason] = useState('');
    const [cancelSuccess, setCancelSuccess] = useState(null); // orderId of just-cancelled order

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        // Only show hard spinner when cache is empty (first ever load)
        if (!sessionStorage.getItem(ORDERS_CACHE_KEY)) setLoading(true);
        try {
            // Fetch orders, returns AND replacements in parallel
            const [ordersResponse, returnsResponse, replacesResponse] = await Promise.all([
                getMyOrdersAPI(),
                getMyReturnsAPI(),
                getMyReplacesAPI()
            ]);

            const returnsData = returnsResponse.data.results || returnsResponse.data || [];
            const replacesData = replacesResponse.data.results || replacesResponse.data || [];

            // Build a set of order_numbers that have been refunded
            const returnedOrderNumbers = new Set(
                returnsData
                    .filter(ret => ['refunded'].includes(ret.return_status))
                    .map(ret => ret.order_number)
            );

            // Group returns by order number
            const orderReturns = {};
            returnsData.forEach(ret => {
                if (!orderReturns[ret.order_number]) {
                    orderReturns[ret.order_number] = [];
                }
                orderReturns[ret.order_number].push(ret);
            });

            // Group replacements by order number
            const orderReplaces = {};
            replacesData.forEach(rep => {
                if (!orderReplaces[rep.order_number]) {
                    orderReplaces[rep.order_number] = [];
                }
                orderReplaces[rep.order_number].push(rep);
            });

            // Map API data to UI format
            const formattedOrders = ordersResponse.data.map(order => {
                const isReturned = returnedOrderNumbers.has(order.order_number);
                const rawStatus = order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1);
                return {
                    orderId: order.order_number,
                    dbId: order.id,
                    date: order.created_at,
                    items: order.items.map(item => ({
                        id: item.product_id,
                        name: item.product_name,
                        points: item.points,
                        quantity: item.quantity,
                        subtotal: item.subtotal_points,
                        image: item.image 
                            ? (item.image.startsWith('http') ? item.image : `${(process.env.REACT_APP_API_URL || "http://127.0.0.1:1000/").replace(/\/$/, "")}${item.image}`)
                            : `https://img.icons8.com/plasticine/144/package.png`
                    })),
                    totalPoints: order.total_points,
                    // Override status to 'Returned' if a refunded return exists for this order
                    status: isReturned ? 'Returned' : rawStatus,
                    replaces: orderReplaces[order.order_number] || [],
                    returns: orderReturns[order.order_number] || [],
                    paymentMethod: 'points',
                    estimatedDelivery: new Date(new Date(order.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    statusHistory: order.status_history || [],
                    address: order.address ? {
                        fullName: order.address.full_name,
                        phone: order.address.phone,
                        address: order.address.address,
                        city: order.address.city,
                        state: order.address.state,
                        pincode: order.address.pincode,
                        landmark: order.address.landmark
                    } : null,
                    adminNotes: order.admin_notes,
                    deliveredAt: order.delivered_at || null
                };
            });

            setOrders(formattedOrders);
            // ✅ Persist to sessionStorage so next navigation is instant
            try { sessionStorage.setItem(ORDERS_CACHE_KEY, JSON.stringify(formattedOrders)); } catch {}
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };


    /* ─── Cancel Logic ─── */
    const openCancelModal = (order) => {
        setCancelReason('');
        setCancelModal({ open: true, orderId: order.orderId, orderName: order.items.map(i => i.name).join(', ') });
    };

    const closeCancelModal = () => {
        setCancelModal({ open: false, orderId: null, orderName: '' });
        setCancelReason('');
    };

    const confirmCancel = async () => {
        if (!cancelReason) return;
        try {
            const response = await cancelOrderAPI(cancelModal.orderId, cancelReason);
            if (response.data.message) {
                const updated = orders.map(o =>
                    o.orderId === cancelModal.orderId
                        ? { ...o, status: 'Cancelled', cancelReason, cancelledAt: new Date().toISOString() }
                        : o
                );
                setOrders(updated);
                // ✅ Update cache so re-navigation shows the cancelled status immediately
                try { sessionStorage.setItem(ORDERS_CACHE_KEY, JSON.stringify(updated)); } catch {}
                setCancelSuccess(cancelModal.orderId);
                closeCancelModal();
                setTimeout(() => setCancelSuccess(null), 4000);
            }
        } catch (error) {
            console.error("Error cancelling order:", error);
            alert(error.response?.data?.error || "Failed to cancel order.");
        }
    };

    /* ─── Helpers ─── */
    const tabs = ['All', 'Processing', 'Shipped', 'Delivered', 'Returned', 'Cancelled'];
    const filteredOrders = activeTab === 'All' ? orders : orders.filter(o => o.status === activeTab);
    const formatDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    const statusClass = {
        'Pending':    'status-processing',
        'Confirmed':  'status-processing',
        'Processing': 'status-processing',
        'Packed':     'status-processing',
        'Shipped':    'status-shipped',
        'Out_for_delivery': 'status-shipped',
        'Delivered':  'status-delivered',
        'Returned':   'status-returned',
        'Cancelled':  'status-cancelled'
    };
    const statusIcon = {
        'Pending':    'fa-clock',
        'Confirmed':  'fa-clock',
        'Processing': 'fa-clock',
        'Packed':     'fa-box',
        'Shipped':    'fa-truck',
        'Out_for_delivery': 'fa-truck',
        'Delivered':  'fa-circle-check',
        'Returned':   'fa-rotate-left',
        'Cancelled':  'fa-ban'
    };

    const paymentLabel = {
        points: '🪙 Eco Points',
        upi:    '📱 UPI',
        card:   '💳 Card',
        cod:    '💵 COD'
    };

    const cancelReasons = [
        'Changed my mind',
        'Ordered by mistake',
        'Found a better reward',
        'Insufficient points concern',
        'Delivery address issue',
        'Other reason'
    ];

    const totalPointsRedeemed = orders.filter(o => o.status !== 'Cancelled').reduce((acc, o) => acc + o.totalPoints, 0);

    return (
        <div className="orders-page">

            {/* ── Cancel Success Toast ── */}
            {cancelSuccess && (
                <div className="cancel-toast-wrapper">
                    <div className="cancel-toast">
                        <i className="fa-solid fa-circle-check me-2 text-success"></i>
                        Order cancelled successfully. Points will be refunded within 24 hrs.
                        <button className="btn-close btn-close-sm ms-3" onClick={() => setCancelSuccess(null)}></button>
                    </div>
                </div>
            )}

            {/* ── Cancel Confirmation Modal ── */}
            {cancelModal.open && (
                <CancelModal 
                    cancelModal={cancelModal}
                    closeCancelModal={closeCancelModal}
                    cancelReason={cancelReason}
                    setCancelReason={setCancelReason}
                    cancelReasons={cancelReasons}
                    confirmCancel={confirmCancel}
                />
            )}

            <div className="container">
                <OrdersHeader orders={orders} totalPointsRedeemed={totalPointsRedeemed} />

                <FilterTabs 
                    tabs={tabs} 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    orders={orders} 
                />

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <EmptyOrders activeTab={activeTab} />
                ) : (
                    filteredOrders.map(order => (
                        <OrderCard 
                            key={order.orderId}
                            order={order}
                            expandedOrder={expandedOrder}
                            setExpandedOrder={setExpandedOrder}
                            openCancelModal={openCancelModal}
                            formatDate={formatDate}
                            statusClass={statusClass}
                            statusIcon={statusIcon}
                            paymentLabel={paymentLabel}
                        />
                    ))
                )}

                {/* Bottom Banner */}
                {orders.length > 0 && (
                    <div className="mt-5 p-4 rounded-4 d-flex align-items-center gap-4 flex-wrap" style={{ background: 'linear-gradient(135deg, #1cc88a, #0d6e4a)', color: '#fff' }}>
                        <i className="fa-solid fa-recycle fa-2x opacity-75"></i>
                        <div className="flex-grow-1">
                            <div className="fw-bold fs-5">Keep Recycling, Keep Earning!</div>
                            <div className="small opacity-80">Submit more e-waste to unlock bigger rewards.</div>
                        </div>
                        <Link to="/E-Waste-Form" className="btn btn-light fw-bold px-4 py-2 text-success text-decoration-none" style={{ borderRadius: 12 }}>
                            Submit E-Waste <i className="fa-solid fa-arrow-right ms-2"></i>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
