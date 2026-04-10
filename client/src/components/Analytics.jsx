import React from "react";

const Analytics = ({ token }) => {
  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card c1">
          <div className="stat-label">This Week Revenue</div>
          <div className="stat-value">₹1.82L</div>
          <div className="stat-delta up">↑ 8.2% vs last week</div>
        </div>
        <div className="stat-card c2">
          <div className="stat-label">Avg Daily Orders</div>
          <div className="stat-value">76</div>
          <div className="stat-delta up">↑ 4 from prev week</div>
        </div>
        <div className="stat-card c3">
          <div className="stat-label">Customer Satisfaction</div>
          <div className="stat-value">4.7★</div>
          <div className="stat-delta up">↑ 0.2 this month</div>
        </div>
        <div className="stat-card c4">
          <div className="stat-label">Table Turnover</div>
          <div className="stat-value">3.2×</div>
          <div className="stat-delta dn">↓ 0.1 vs avg</div>
        </div>
      </div>
      <div className="analytics-grid">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Weekly Revenue Trend</div>
          </div>
          <div className="chart-area">
            <div className="chart-bars">
              {/* Bar chart from HTML */}
              <div className="ch-bar-wrap">
                <div className="ch-val">₹22K</div>
                <div
                  className="ch-bar"
                  style={{ height: "55%", background: "rgba(128,0,0,0.3)" }}
                ></div>
                <div className="ch-label">Mon</div>
              </div>
              {/* More bars... */}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Top Items</div>
          </div>
          <div className="top-items">
            {/* Top items list from HTML */}
            <div className="top-item">
              <div className="top-rank gold">1</div>
              <div className="top-name">Chicken Biryani</div>
              <div className="top-cnt">142 ×</div>
              <div className="top-rev">₹45K</div>
            </div>
            {/* More... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
