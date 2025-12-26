import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';
import { useCompare } from '../contexts/CompareContext';
import './CompareProductPage.css';

const ComparePage: React.FC = () => {
    const { compareList, removeFromCompare } = useCompare();

    // Define criteria rows
    // This maps the visual requirements to the data we likely have
    const criterias = [
        { label: 'Phân loại sản phẩm', key: 'category' },
        { label: 'Giá tiền', key: 'price' },
        { label: 'Khu vực sơn', key: 'location' },
        { label: 'Đặc điểm nổi bật', key: 'features' },
        { label: 'Bề mặt ứng dụng', key: 'surface' },
        { label: 'Bề mặt hoàn thiện', key: 'finish' },
        { label: 'Độ phủ', key: 'coverage' },
        { label: 'Thời gian khô bề mặt', key: 'dryingTime' },
        { label: 'Thời gian chuyển tiếp', key: 'recoatTime' },
        { label: 'Đóng gói', key: 'packing' }
    ];

    // Helper to extract data from product object based on key
    const getProductData = (product: any, key: string) => {
        if (key === 'category') return product.category;

        // Infer location from category or name if not strictly defined
        if (key === 'price') {
            return (
                <span style={{ color: '#e60012', fontWeight: 700, fontSize: '16px' }}>
                    {product.price.toLocaleString('vi-VN')} ₫
                </span>
            );
        }
        if (key === 'location') {
            if (product.category.toLowerCase().includes('nội')) return 'Trong nhà';
            if (product.category.toLowerCase().includes('ngoại')) return 'Ngoài trời';
            return 'Trong nhà & Ngoài trời';
        }

        if (key === 'features') {
            if (product.benefits && product.benefits.length > 0) {
                return (
                    <ul className="np-compare-list-bullet">
                        {product.benefits.map((b: string, i: number) => <li key={i}>- {b}</li>)}
                    </ul>
                );
            }
            if (product.features && product.features.length > 0) {
                return (
                    <ul className="np-compare-list-bullet">
                        {product.features.map((f: string, i: number) => <li key={i}>- {f}</li>)}
                    </ul>
                );
            }
            return '-';
        }

        // Infer surface if not explicitly available
        if (key === 'surface') {
            // This would ideally come from specific data
            return 'Tường trát vữa, Bê tông, Tường gạch';
        }

        // Get technical data
        if (product.technicalData) {
            if (key === 'finish') return 'Mờ / Bóng'; // Placeholder if missing
            if (key === 'coverage') return product.technicalData.coverage;
            if (key === 'dryingTime') return product.technicalData.dryingTime;
            if (key === 'recoatTime') return '2 giờ'; // Placeholder
            if (key === 'packing') return product.technicalData.packing;
        }

        return '-';
    };

    return (
        <div className="np-app">
            <Header />
            <main className="np-main">
                <Breadcrumb items={[
                    { label: 'Trang chủ', link: '/' },
                    { label: 'So sánh sản phẩm' }
                ]} />

                <section className="np-compare-page">
                    <div className="np-container">
                        <h1 className="np-page-title-center">BẢNG SO SÁNH SẢN PHẨM</h1>

                        {compareList.length === 0 ? (
                            <div className="np-empty-compare">
                                <p>Bạn chưa chọn sản phẩm nào để so sánh.</p>
                                <a href="/san-pham" className="np-btn-primary">Chọn sản phẩm</a>
                            </div>
                        ) : (
                            <div className="np-compare-table-wrapper">
                                <table className="np-compare-table">
                                    <thead>
                                        <tr>
                                            <th className="np-col-criteria">
                                                <div className="np-criteria-header">
                                                    TIÊU CHÍ SO SÁNH
                                                </div>
                                            </th>
                                            {compareList.map(product => (
                                                <th key={product.id} className="np-col-product">
                                                    <div className="np-compare-product-header">
                                                        <div className="np-compare-close" onClick={() => removeFromCompare(product.id)}>×</div>
                                                        <img src={product.image} alt={product.name} />
                                                        <div className="np-compare-prod-cat">{product.category.toUpperCase()}</div>
                                                        <div className="np-compare-prod-name">{product.name}</div>
                                                    </div>
                                                </th>
                                            ))}
                                            {/* Fill remaining columns to maintain layout balance if less than 3 items */}
                                            {[...Array(3 - compareList.length)].map((_, i) => (
                                                <th key={`empty-${i}`} className="np-col-empty"></th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {criterias.map(criteria => (
                                            <tr key={criteria.key}>
                                                <td className="np-cell-label">{criteria.label}</td>
                                                {compareList.map(product => (
                                                    <td key={`${product.id}-${criteria.key}`} className="np-cell-data">
                                                        {getProductData(product, criteria.key)}
                                                    </td>
                                                ))}
                                                {[...Array(3 - compareList.length)].map((_, i) => (
                                                    <td key={`empty-cell-${i}`} className="np-cell-empty"></td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default ComparePage;
