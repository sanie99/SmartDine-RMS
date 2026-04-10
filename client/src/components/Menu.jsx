import React, { useState, useEffect } from "react";

const Menu = ({ token }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  const tabs = ["all", "starters", "mains", "biryani", "desserts", "drinks"];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/menu", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMenuItems(data);
      } catch (err) {
        // Mock data from HTML
        setMenuItems([
          {
            name: "Chicken Biryani",
            cat: "Biryani · Main Course",
            price: 320,
            available: true,
          },
          {
            name: "Paneer Tikka",
            cat: "Starter · Veg",
            price: 240,
            available: true,
          },
          {
            name: "Dal Makhani",
            cat: "Main Course · Veg",
            price: 180,
            available: true,
          },
          {
            name: "Butter Chicken",
            cat: "Main Course · Non-Veg",
            price: 290,
            available: true,
          },
          { name: "Gulab Jamun", cat: "Desserts", price: 90, available: true },
          {
            name: "Mango Lassi",
            cat: "Beverages",
            price: 120,
            available: false,
          },
        ]);
      }
    };
    fetchMenu();
  }, [token]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div className="tabs" style={{ marginBottom: 0 }}>
          {tabs.map((tab) => (
            <div
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </div>
          ))}
        </div>
        <button
          style={{
            background: "var(--dark)",
            color: "var(--cream)",
            border: "none",
            padding: "9px 18px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          + Add Item
        </button>
      </div>
      <div className="menu-grid">
        {menuItems
          .filter(
            (item) =>
              activeTab === "all" || item.cat.toLowerCase().includes(activeTab),
          )
          .map((item, idx) => (
            <div key={idx} className="menu-card">
              <div className="menu-thumb">🍛</div>
              <div className="menu-body">
                <div className="menu-name">{item.name}</div>
                <div className="menu-cat">{item.cat}</div>
                <div className="menu-row">
                  <div className="menu-price">₹{item.price}</div>
                  <div
                    className="menu-avail"
                    style={{
                      background: item.available ? "#4caf50" : "#e53935",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Menu;
