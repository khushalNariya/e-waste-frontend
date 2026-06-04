import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EWasteForm.css';
import EWasteSubmissionForm from './EWasteSubmissionForm';
import {
    createEWasteSubmission,
    getCategoryBrands,
    getFacilities,
    getModelsByCategoryBrand,
    getRecycleCategories,
    getRewardRules
} from '../../../services/user-api/API_Service';

const getList = (data) => data?.results || data || [];

const EWasteForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        category_id: '',
        category_brand_mapping_id: '',
        model_id: '',
        user_condition_id: '',
        facility_id: '',
        pickup_type: 'pickup',
        address: '',
        pickup_date: '',
        pickup_time: '',
        phone: '',
        notes: '',
        images: [],
        weight: ''
    });

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [rewardRules, setRewardRules] = useState([]);
    const [errors, setErrors] = useState({});
    const [errorMsg, setErrorMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const conditions = useMemo(() => {
        const map = new Map();
        rewardRules.forEach((rule) => {
            if (rule.condition?.id) {
                map.set(rule.condition.id, rule.condition);
            }
        });
        return Array.from(map.values());
    }, [rewardRules]);

    const selectedUnit = useMemo(() => {
        const matchingRule = rewardRules.find(
            (rule) => String(rule.category?.id) === String(formData.category_id)
        );
        return matchingRule?.unit?.toLowerCase() || '';
    }, [formData.category_id, rewardRules]);

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            setErrorMsg('');

            try {
                const [categoryRes, facilityRes, rulesRes] = await Promise.all([
                    getRecycleCategories(),
                    getFacilities(),
                    getRewardRules()
                ]);

                setCategories(getList(categoryRes.data));
                setFacilities(getList(facilityRes.data));
                setRewardRules(getList(rulesRes.data));
            } catch (err) {
                setErrorMsg('Unable to load form data. Please login and try again.');
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const handleChange = async (e) => {
        const { name, value, files } = e.target;

        if (name === 'images') {
            const selectedFiles = Array.from(files || []);
            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...selectedFiles].slice(0, 5)
            }));
            setErrors((prev) => ({ ...prev, images: '', error: '' }));
            return;
        }

        if (name === 'category_id') {
            setFormData((prev) => ({
                ...prev,
                category_id: value,
                category_brand_mapping_id: '',
                model_id: '',
                weight: ''
            }));
            setBrands([]);
            setModels([]);

            if (value) {
                try {
                    const res = await getCategoryBrands(value);
                    setBrands(getList(res.data));
                } catch (err) {
                    setErrors((prev) => ({
                        ...prev,
                        category_id: 'Unable to load brands for selected category'
                    }));
                }
            }
        } else if (name === 'category_brand_mapping_id') {
            setFormData((prev) => ({
                ...prev,
                category_brand_mapping_id: value,
                model_id: ''
            }));
            setModels([]);

            if (value) {
                try {
                    const res = await getModelsByCategoryBrand(value);
                    setModels(getList(res.data));
                } catch (err) {
                    setErrors((prev) => ({
                        ...prev,
                        category_brand_mapping_id: 'Unable to load models for selected brand'
                    }));
                }
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleRemoveImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, imageIndex) => imageIndex !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setErrors({});
        setIsSubmitting(true);

        try {
            const payload = new FormData();

            Object.keys(formData).forEach((key) => {
                if (key !== 'images') {
                    payload.append(key, formData[key]);
                }
            });

            formData.images.forEach((image) => {
                payload.append('images', image);
            });

            await createEWasteSubmission(payload);
            sessionStorage.setItem('success_message', 'E-Waste submission added successfully!');
            navigate('/submission-history');
        } catch (err) {
            if (err.response?.data) {
                setErrors(err.response.data);
            } else {
                setErrorMsg('Failed to submit e-waste request. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="ewaste-form-page">
            <div className="ewaste-form-container">

                <header className="ew-form-header">
                    <div className="ew-header-icon">
                        <i className="fa-solid fa-recycle fa-spin-slow"></i>
                    </div>
                    <h2>Electronic Waste Submission</h2>
                    <p>Provide details of your e-waste for responsible recycling and earn reward points.</p>
                </header>

                <main className="ew-form-body">
                    {isLoading ? (
                        <div className="ew-state-message">
                            <i className="fa-solid fa-spinner fa-spin me-2"></i>
                            Loading form data...
                        </div>
                    ) : (
                        <EWasteSubmissionForm
                            formData={formData}
                            handleChange={handleChange}
                            handleRemoveImage={handleRemoveImage}
                            handleSubmit={handleSubmit}
                            categories={categories}
                            brands={brands}
                            models={models}
                            conditions={conditions}
                            facilities={facilities}
                            errors={errors}
                            errorMsg={errorMsg}
                            isSubmitting={isSubmitting}
                            selectedUnit={selectedUnit}
                        />
                    )}
                </main>

            </div>
        </div>
    );
};

export default EWasteForm;
