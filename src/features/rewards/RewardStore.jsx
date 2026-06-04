/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import './Styles/RewardStore.css';
import StoreHeader from './Store_UI_Components/StoreHeader';
import StoreFilters from './Store_UI_Components/StoreFilters';
import StoreProductCard from './Store_UI_Components/StoreProductCard';
import StoreBanner from './Store_UI_Components/StoreBanner';
import RewardNotification from './Store_UI_Components/Add_To_Cart_Reward_Product';
import { getRewardCategories, getRewardProducts, getUserWallet } from '../../services/API_Service';

const RewardStore = () => {
    const [filter, setFilter] = useState('All');
    const [categories, setCategories] = useState(['All']);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userPoints, setUserPoints] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    // Notification State
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

    useEffect(() => {
        // Retrieve login status from localStorage
        const token = localStorage.getItem('user_access_token');

        if (token) {
            setIsLoggedIn(true);
            fetchUserPoints();
        } else {
            setIsLoggedIn(false);
            setUserPoints(0);
        }

        fetchCategories();
    }, []);

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
    };

    const fetchUserPoints = async () => {
        try {
            const response = await getUserWallet();
            // Wallet endpoint usually returns an array for list view, so we take the first item
            const walletData = response.data.results || response.data;
            if (walletData && walletData.length > 0) {
                const points = walletData[0].total_points;
                setUserPoints(points);
                localStorage.setItem('user_total_points', points); // Update local cache
            } else if (walletData && walletData.total_points !== undefined) {
                // If it returns a single object
                setUserPoints(walletData.total_points);
                localStorage.setItem('user_total_points', walletData.total_points);
            }
        } catch (error) {
            console.error('Error fetching user points:', error);
            // Fallback to local storage if API fails
            const cachedPoints = localStorage.getItem('user_total_points');
            if (cachedPoints) setUserPoints(parseInt(cachedPoints));
        }
    };

    useEffect(() => {
        fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const fetchCategories = async () => {
        try {
            const response = await getRewardCategories();
            const categoryData = response.data.results || response.data;
            setCategories(['All', ...categoryData.map(cat => cat.name)]);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let categoryId = null;
            if (filter !== 'All') {
                // Find the category ID from the categories list if possible, 
                // or just pass the name if the API supports it.
                // Assuming we might need to fetch categories to get IDs
                const catResponse = await getRewardCategories();
                const catData = catResponse.data.results || catResponse.data;
                const selectedCat = catData.find(c => c.name === filter);
                if (selectedCat) categoryId = selectedCat.id;
            }
            const response = await getRewardProducts(categoryId);
            setItems(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reward-store-page">
            <StoreHeader isLoggedIn={isLoggedIn} userPoints={userPoints} />

            <div className="container py-5">
                <StoreFilters
                    categories={categories}
                    currentFilter={filter}
                    onFilterChange={setFilter}
                />

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <h4 className="mt-3 text-muted">Discovering Rewards...</h4>
                    </div>
                ) : (
                    <div className="row g-4 justify-content-center">
                        {items.map(item => (
                            <StoreProductCard 
                                key={item.id} 
                                item={item} 
                                onShowToast={showNotification}
                            />
                        ))}

                        {items.length === 0 && (
                            <div className="col-12 text-center py-5">
                                <i className="fa-solid fa-box-open fa-3x text-muted mb-3"></i>
                                <h3 className="text-muted">No rewards found in this category.</h3>
                            </div>
                        )}
                    </div>
                )}

                <StoreBanner />
            </div>

            <RewardNotification 
                show={notification.show}
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ ...notification, show: false })}
            />
        </div>
    );
};

export default RewardStore;

