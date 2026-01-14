import React, { useMemo, useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Breadcrumb from '../../components/common/Breadcrumb';
import { PRODUCTS, Product } from '../../data/products';
import './InventoryPage.css';
import '../../components/layout/FilterBar.css';


type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

interface InventoryRow {
  product: Product;
  quantity: number;
  status: StockStatus;
}

const getStockInfo = (product: Product): { quantity: number; status: StockStatus } => {
  
  const base = (product.id % 75);

  let status: StockStatus = 'in_stock';
  if (base <= 0) status = 'out_of_stock';
  else if (base <= 25) status = 'low_stock';

  return {
    quantity: base,
    status
  };
};

function InventoryPage(): React.JSX.Element {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<StockStatus | 'all'>('all');
  

  const inventoryData: InventoryRow[] = useMemo(
    () =>
      PRODUCTS.map((p) => {
        const { quantity, status } = getStockInfo(p);
        return { product: p, quantity, status };
      }),
    []
  );

  const lowStockCount = inventoryData.filter(item => item.status === 'low_stock').length;
  const outOfStockCount = inventoryData.filter(item => item.status === 'out_of_stock').length;


  const uniqueCategories = useMemo(
    () =>
      Array.from(new Set(PRODUCTS.map((p) => p.category))).sort((a, b) =>
        a.localeCompare(b, 'vi-VN')
      ),
    []
  );

  const filteredInventory = useMemo(
    () =>
      inventoryData.filter((row) => {
        const byCategory = categoryFilter === 'all' || row.product.category === categoryFilter;
        const byStatus = statusFilter === 'all' || row.status === statusFilter;
        return byCategory && byStatus;
      }),
    [inventoryData, categoryFilter, statusFilter]
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price || 0);

  const getStatusLabel = (status: StockStatus) => {
    switch (status) {
      case 'in_stock':
        return 'Còn hàng';
      case 'low_stock':
        return 'Sắp hết';
      case 'out_of_stock':
        return 'Hết hàng';
      default:
        return status;
    }
  };

  return (
    <div className="np-app">
      <Header />

      <main className="np-main">
        <Breadcrumb
          items={[
            { label: 'Trang chủ', link: '/' },
            { label: 'Tồn kho sản phẩm' }
          ]}
        />

        <section className="np-page-title">
          <div className="np-container">
            <h1>Tồn kho sản phẩm</h1>
            <p className="np-page-subtitle">
              Theo dõi nhanh số lượng tồn kho của toàn bộ danh mục sản phẩm Nippon
            </p>
          </div>
        </section>

        <section className="np-inventory-alerts">
          <div className="np-container">
            <div className="np-alerts-grid">
              {lowStockCount > 0 && (
                <div className="np-alert-card np-alert-warning">
                  <div className="np-alert-content">
                    <h3>{lowStockCount} sản phẩm sắp hết hàng</h3>
                    <p>Cần nhập thêm hàng để tránh thiếu hụt</p>
                  </div>
                </div>
              )}
              
              {outOfStockCount > 0 && (
                <div className="np-alert-card np-alert-danger">
                  <div className="np-alert-content">
                    <h3>{outOfStockCount} sản phẩm đã hết hàng</h3>
                    <p>Cần nhập hàng khẩn cấp</p>
                  </div>
                </div>
              )}
              
              {lowStockCount === 0 && outOfStockCount === 0 && (
                <div className="np-alert-card np-alert-success">
                  <div className="np-alert-content">
                    <h3>Tất cả sản phẩm còn đủ hàng</h3>
                    <p>Tồn kho đang ở mức tốt</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="np-inventory-section">
          <div className="np-container">
            <div className="np-filter-bar-wrapper">
              <div className="np-filter-bar np-inventory-filters">
                <div className="np-filter-group">
                  <label>Danh mục sản phẩm:</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">Tất cả</option>
                    {uniqueCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="np-filter-group">
                  <label>Trạng thái tồn kho:</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as StockStatus | 'all')}
                  >
                    <option value="all">Tất cả</option>
                    <option value="in_stock">Còn hàng</option>
                    <option value="low_stock">Sắp hết</option>
                    <option value="out_of_stock">Hết hàng</option>
                  </select>
                </div>

                <button
                  className="np-btn-apply"
                  onClick={() => {
                    setCategoryFilter('all');
                    setStatusFilter('all');
                  }}
                >
                  XÓA BỘ LỌC
                </button>
              </div>
            </div>

            <div className="np-inventory-summary">
              <span>
                Tổng số sản phẩm:&nbsp;
                <strong>{inventoryData.length}</strong>
              </span>
              <span>
                Đang hiển thị:&nbsp;
                <strong>{filteredInventory.length}</strong>
              </span>
            </div>

            <div className="np-inventory-table-wrapper">
              <table className="np-inventory-table">
                <thead>
                  <tr>
                    <th style={{ width: '70px' }}>Mã</th>
                    <th>Sản phẩm</th>
                    <th>Danh mục</th>
                    <th style={{ width: '140px' }}>Giá bán</th>
                    <th style={{ width: '110px' }}>Số lượng</th>
                    <th style={{ width: '140px' }}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((row) => (
                    <tr key={row.product.id}>
                      <td>{row.product.id}</td>
                      <td>
                        <div className="np-inventory-product-cell">
                          <img
                            src={row.product.image}
                            alt={row.product.name}
                            onError={(e) => {
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=200';
                              e.currentTarget.onerror = null;
                            }}
                          />
                          <div>
                            <div className="np-inventory-product-name">{row.product.name}</div>
                            {row.product.features && row.product.features.length > 0 && (
                              <div className="np-inventory-product-note">
                                {row.product.features.slice(0, 2).join(' • ')}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{row.product.category}</td>
                      <td>{formatPrice(row.product.price)}</td>
                      <td>
                        <span className="np-inventory-qty">{row.quantity}</span>
                      </td>
                      <td>
                        <span className={`np-inventory-status np-status-${row.status}`}>
                          {getStatusLabel(row.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredInventory.length === 0 && (
                    <tr>
                      <td colSpan={6} className="np-inventory-empty">
                        Không có sản phẩm nào phù hợp với bộ lọc hiện tại.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default InventoryPage;

