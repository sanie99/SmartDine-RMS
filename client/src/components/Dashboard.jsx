import React, { useState, useEffect } from "react";

const Dashboard = ({ token }) => {
  const [analytics, setAnalytics] = useState({
    todaySales: 28450,
    todayOrders: 84,
    tableOccupancy: "9/16",
    avgOrderValue: 338,
    salesTrend: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/analytics", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    // fetchAnalytics();
  }, [token]);

  return (
    <div id="page-dashboard" style={{ minHeight: "100vh" }}>
      <div className="stats-grid">
        <div className="stat-card c1">
          <div className="stat-label">Today's Revenue</div>
          <div className="stat-value">
            ₹{analytics.todaySales?.toLocaleString()}
          </div>
          <div className="stat-delta up">↑ 12.4% vs yesterday</div>
          <div className="stat-icon">💰</div>
        </div>
        <div className="stat-card c2">
          <div className="stat-label">Orders Today</div>
          <div className="stat-value">{analytics.todayOrders}</div>
          <div className="stat-delta up">↑ 7 from avg</div>
          <div className="stat-icon">🗒</div>
        </div>
        <div className="stat-card c3">
          <div className="stat-label">Tables Occupied</div>
          <div className="stat-value">
            {analytics.tableOccupancy || "9 / 16"}
          </div>
          <div className="stat-delta dn">↓ 2 from peak</div>
          <div className="stat-icon">🪑</div>
        </div>
        <div className="stat-card c4">
          <div className="stat-label">Avg Order Value</div>
          <div className="stat-value">₹{analytics.avgOrderValue}</div>
          <div className="stat-delta up">↑ ₹22 vs last week</div>
          <div className="stat-icon">📈</div>
        </div>
      </div>

      <div className="main-grid">
        {/* Orders Card - migrate full HTML table + mini chart */}
        <div>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Recent Orders</div>
              <div className="card-action" style={{ cursor: "pointer" }}>
                View all →
              </div>
            </div>
            <div className="order-table">
              {/* Static sample data - later fetch /api/orders */}
              <div className="order-row header">
                <div>#</div>
                <div>Items</div>
                <div>Table</div>
                <div>Status</div>
                <div>Amount</div>
                <div>Time</div>
              </div>
              <div className="order-row">
                <div className="order-id">#084</div>
                <div>Biryani, Raita, Lassi</div>
                <div>
                  <div className="table-num">T-4</div>
                </div>
                <div>
                  <div className="status-pill s-preparing">Preparing</div>
                </div>
                <div className="price">₹620</div>
                <div className="time-ago">4m ago</div>
              </div>
              {/* More rows... */}
            </div>
            {/* Mini chart... */}
          </div>
        </div>

        {/* Right panel - Kitchen + Table map */}
        <div className="right-panel">{/* Full migration... */}</div>
      </div>
    </div>
  );
};

export default Dashboard;
