import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Orders from "./components/Orders.jsx";
import Menu from "./components/Menu.jsx";
import Tables from "./components/Tables.jsx";
import Inventory from "./components/Inventory.jsx";
import Analytics from "./components/Analytics.jsx";
import AIInsights from "./components/AIInsights.jsx";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [activePage, setActivePage] = useState("dashboard");
  const titles = {
    dashboard: "Dashboard Overview",
    orders: "Order Management",
    menu: "Menu Management",
    tables: "Table Management",
    inventory: "Inventory Management",
    analytics: "Reports & Analytics",
    ai: "AI Insights",
  };
  const [backendReady, setBackendReady] = useState(false);

  useEffect(() => {
    // Check backend
    fetch("http://localhost:5000/")
      .then((res) => res.json())
      .then(() => setBackendReady(true))
      .catch(() => setBackendReady(false));
  }, []);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  if (!backendReady) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url(/assets/rest_img_1.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#d8a4ac70",
            color: "#4d0e1d",
            fontSize: "18px",
            textAlign: "center",
            padding: "2rem 2rem",
            borderRadius: "1rem",
            backdropFilter: "blur(10px)",
            border: "1px solid #c8a49f50",
            gap: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1 className="text-3xl font-bold mb-4 text-[#eee4da]">
            SmartDine RMS
          </h1>
          <div style={{ marginTop: "1rem" }}>
            <p className="text-[#eee4da] text-lg">
              Start backend... Run{" "}
              <code
                style={{
                  backgroundColor: "#d8a4ac",
                  color: "#4d0e1d",
                  padding: "0.2rem 0.3rem",
                  fontFamily: "monospace",
                }}
              >
                cd server && venv\Scripts\activate.bat && python app.py
              </code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {token ? (
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            width: "100%",
            backgroundColor: "var(--cream, #eee4da)",
          }}
        >
          <Sidebar
            activePage={activePage}
            onPageChange={setActivePage}
            handleLogout={handleLogout}
          />
          <main
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
              maxWidth: "100vw",
              overflow: "hidden",
            }}
          >
            <header
              style={
                {
                  /* HTML header styles */
                }
              }
            >
              <div className="page-title" id="page-title">
                {titles[activePage] || "Dashboard Overview"}
              </div>
              <div className="header-right">
                <div className="status-dot"></div>
                <div className="live-label">Live • 3 kitchen orders</div>
              </div>
            </header>
            <div className="content">
              {activePage === "dashboard" && <Dashboard token={token} />}
              {activePage === "orders" && <Orders token={token} />}
              {activePage === "menu" && <Menu token={token} />}
              {activePage === "tables" && <Tables token={token} />}
              {activePage === "inventory" && <Inventory token={token} />}
              {activePage === "analytics" && <Analytics token={token} />}
              {activePage === "ai" && <AIInsights token={token} />}
            </div>
          </main>
        </div>
      ) : (
        <div
          className="h-screen w-screen flex items-center justify-center p-0 overflow-hidden"
          style={{
            backgroundImage: `url(/assets/rest_img_1.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Login onLogin={handleLogin} />
        </div>
      )}
    </>
  );
}

export default App;
