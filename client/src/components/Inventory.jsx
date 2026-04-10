import React from "react";

const Inventory = ({ token }) => {
  const inventoryItems = [
    {
      name: "Basmati Rice",
      sub: "Grains · 25 kg left",
      stock: "25 kg",
      level: 62,
      status: "OK",
    },
    {
      name: "Chicken (Fresh)",
      sub: "Protein · 4 kg left",
      stock: "4 kg",
      level: 18,
      status: "Low!",
    },
    {
      name: "Tomatoes",
      sub: "Vegetables · 3 kg left",
      stock: "3 kg",
      level: 22,
      status: "Low",
    },
    {
      name: "Paneer",
      sub: "Dairy · 8 kg left",
      stock: "8 kg",
      level: 53,
      status: "OK",
    },
    {
      name: "Onions",
      sub: "Vegetables · 2 kg left",
      stock: "2 kg",
      level: 10,
      status: "Low!",
    },
    // ... more from HTML
  ];

  const getStatusColor = (status) => {
    if (status === "OK") return "#d4edda";
    if (status === "Low") return "#fff3e0";
    return "#fce4e4";
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">Inventory Stock Levels</div>
          <div className="card-action">+ Add Item</div>
        </div>
        <div className="inv-row header">
          <div>Item</div>
          <div>Stock</div>
          <div>Level</div>
          <div>Status</div>
        </div>
        {inventoryItems.map((item, idx) => (
          <div key={idx} className="inv-row">
            <div>
              <div className="inv-name">{item.name}</div>
              <div className="inv-sub">{item.sub}</div>
            </div>
            <div>{item.stock}</div>
            <div>
              <div className="stock-bar-wrap">
                <div
                  className="stock-bar"
                  style={{
                    width: `${item.level}%`,
                    background:
                      item.level > 50
                        ? "#4caf50"
                        : item.level > 20
                          ? "#ff9800"
                          : "#e53935",
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div
                className="alert-tag"
                style={{
                  background: getStatusColor(item.status),
                  color:
                    item.status === "OK"
                      ? "#1a5e30"
                      : item.status === "Low"
                        ? "#7a3010"
                        : "#b71c1c",
                }}
              >
                {item.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
