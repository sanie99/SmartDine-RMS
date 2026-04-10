import React from "react";

const Sidebar = ({ activePage, onPageChange, handleLogout }) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "⬛" },
    { id: "orders", label: "Orders", badge: 5 },
    { id: "menu", label: "Menu", icon: "🍽" },
    { id: "tables", label: "Tables", icon: "🪑" },
    { id: "inventory", label: "Inventory", badge: 3, badgeColor: "#c0392b" },
    { id: "analytics", label: "Analytics", icon: "📊" },
    { id: "ai", label: "AI Insights", icon: "✦" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "settings", label: "Settings", icon: "⚙" },
  ];

  const sections = [
    { title: "Main", items: ["dashboard", "orders", "menu", "tables"] },
    { title: "Management", items: ["inventory", "analytics", "ai"] },
    { title: "System", items: ["users", "settings"] },
  ];

  return (
    <aside
      style={{
        width: "220px",
        background: "var(--dark, #4d0e1d)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        fontFamily: '"DM Sans", sans-serif',
        color: "var(--cream, #eee4da)",
      }}
    >
      <div
        className="logo"
        style={{
          padding: "28px 20px 20px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <h1
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: "20px",
            fontWeight: 700,
            color: "var(--cream, #eee4da)",
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          SmartDine
        </h1>
        <span
          style={{
            fontSize: "11px",
            color: "var(--rose, #d8a49f)",
            letterSpacing: "2px",
            textTransform: "uppercase",
            fontWeight: 400,
          }}
        >
          Restaurant
        </span>
      </div>

      <nav style={{ padding: "16px 0", flex: 1, overflowY: "auto" }}>
        {sections.map((section, idx) => (
          <div key={idx}>
            <div
              className="nav-section"
              style={{
                padding: "8px 20px 4px",
                fontSize: "10px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "rgba(216, 164, 159, 0.5)",
                fontWeight: 500,
              }}
            >
              {section.title}
            </div>
            {section.items.map((itemId) => {
              const item = navItems.find((i) => i.id === itemId);
              return (
                <div
                  key={itemId}
                  className={`nav-item ${activePage === itemId ? "active" : ""}`}
                  onClick={() => onPageChange(itemId)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 20px",
                    fontSize: "13.5px",
                    color: "rgba(238, 228, 218, 0.7)",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    borderLeft: "3px solid transparent",
                    fontWeight: 400,
                    ...(activePage === itemId && {
                      background: "rgba(128, 0, 0, 0.25)",
                      color: "var(--cream, #eee4da)",
                      borderLeftColor: "var(--rose, #d8a49f)",
                      fontWeight: 500,
                    }),
                  }}
                  onMouseEnter={(e) => {
                    if (activePage !== itemId) {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.05)";
                      e.currentTarget.style.color = "var(--cream, #eee4da)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activePage !== itemId) {
                      e.currentTarget.style.background = "";
                      e.currentTarget.style.color = "rgba(238, 228, 218, 0.7)";
                    }
                  }}
                >
                  {item?.icon && (
                    <span
                      className="icon"
                      style={{
                        fontSize: "15px",
                        width: "18px",
                        textAlign: "center",
                      }}
                    >
                      {item.icon}
                    </span>
                  )}
                  <span>{item?.label}</span>
                  {item?.badge && (
                    <span
                      className="badge"
                      style={{
                        marginLeft: "auto",
                        background: item.badgeColor || "var(--red, #800000)",
                        color: "var(--cream, #eee4da)",
                        fontSize: "10px",
                        padding: "1px 6px",
                        borderRadius: "20px",
                        fontWeight: 600,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      <div
        className="user-card"
        style={{
          padding: "16px 20px",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
        }}
        onClick={handleLogout}
      >
        <div
          className="avatar"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "var(--red, #800000)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--cream, #eee4da)",
            flexShrink: 0,
          }}
        >
          AD
        </div>
        <div>
          <p
            style={{
              fontSize: "12.5px",
              color: "var(--cream, #eee4da)",
              fontWeight: 500,
              margin: 0,
            }}
          >
            Admin
          </p>
          <span
            style={{
              fontSize: "11px",
              color: "var(--rose, #d8a49f)",
              margin: 0,
            }}
          >
            Logout
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
