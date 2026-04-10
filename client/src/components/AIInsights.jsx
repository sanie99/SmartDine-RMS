import React from "react";

const AIInsights = ({ token }) => {
  const insights = [
    {
      tag: "Demand Prediction",
      text: "Biryani demand +40% Saturday. Order 15kg rice.",
      icon: "📈",
    },
    {
      tag: "Sentiment Analysis",
      text: '82% positive reviews. "Slow service" common complaint.',
      icon: "💬",
    },
    {
      tag: "Menu Recommendation",
      text: "Biryani + Raita bundle as Weekend Feast ₹480.",
      icon: "🍽",
    },
    // More from HTML
  ];

  return (
    <div className="main-grid">
      <div className="card">
        <div className="card-header">
          <div className="card-title">✦ AI-Powered Insights</div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            Updated 2 min ago
          </div>
        </div>
        {insights.map((insight, idx) => (
          <div key={idx} className="insight-item">
            <div
              className="insight-icon"
              style={{ background: "rgba(128,0,0,0.1)" }}
            >
              {insight.icon}
            </div>
            <div>
              <div className="insight-tag">{insight.tag}</div>
              <div className="insight-text">{insight.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsights;
