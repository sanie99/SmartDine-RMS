import React, { useState, useEffect } from "react";

const Tables = ({ token }) => {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/tables", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTables(data);
      } catch (err) {
        // Mock from HTML
        setTables([
          { number: 1, status: "occupied" },
          { number: 2, status: "free" },
          { number: 3, status: "occupied" },
          // ... 16 tables matching HTML
        ]);
      }
    };
    fetchTables();
  }, [token]);

  const statusCounts = { occupied: 9, free: 5, reserved: 2 };

  return (
    <div>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "14px",
          fontSize: "13px",
        }}
      >
        <div
          style={{
            background: "var(--white)",
            padding: "10px 18px",
            borderRadius: "10px",
            border: "1px solid rgba(77,14,29,0.08)",
          }}
        >
          Total: <strong>16</strong>
        </div>
        <div
          style={{
            background: "rgba(128,0,0,0.08)",
            padding: "10px 18px",
            borderRadius: "10px",
            border: "1px solid rgba(128,0,0,0.15)",
            color: "var(--red)",
          }}
        >
          Occupied: <strong>{statusCounts.occupied}</strong>
        </div>
        <div
          style={{
            background: "rgba(42,122,74,0.08)",
            padding: "10px 18px",
            borderRadius: "10px",
            border: "1px solid rgba(42,122,74,0.15)",
            color: "#2a7a4a",
          }}
        >
          Free: <strong>{statusCounts.free}</strong>
        </div>
        <div
          style={{
            background: "rgba(200,164,159,0.2)",
            padding: "10px 18px",
            borderRadius: "10px",
            border: "1px solid rgba(200,164,159,0.4)",
            color: "#7a4a4e",
          }}
        >
          Reserved: <strong>{statusCounts.reserved}</strong>
        </div>
      </div>
      <div className="card">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(8, 1fr)",
            gap: "12px",
            padding: "20px",
          }}
        >
          {Array.from({ length: 16 }, (_, i) => (
            <div
              key={i}
              className={`t-cell t-${tables[i]?.status || "occupied"}`}
              style={{ aspectRatio: "auto", padding: "14px 8px" }}
            >
              <div className="t-num">{i + 1}</div>
              <div>Table {i + 1}</div>
              <div style={{ fontSize: "9px", marginTop: "4px" }}>
                Occ · {4 + (i % 6)} pax
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tables;
