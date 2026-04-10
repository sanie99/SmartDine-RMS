import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Orders from "./components/Orders.jsx";

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
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url(/assets/rest_img_1.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-3xl font-bold mb-4 text-[#eee4da]">
          SmartDine RMS
        </h1>
        <div className="text-center p-8 rounded-3xl shadow-2xl bg-[#4d0e1d]/90 backdrop-blur-md border border-[#c8a49f]/50 max-w-md mx-auto">
          <p className="text-[#eee4da] text-lg">
            Starting backend... Run{" "}
            <code className="bg-[#d8a4ac] text-[#4d0e1d] px-2 py-1 rounded font-mono">
              cd server && venv\Scripts\activate.bat && python app.py
            </code>
          </p>
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
          <Sidebar activePage={activePage} onPageChange={setActivePage} />
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
              {activePage === "menu" && <div>Menu Page (to migrate)</div>}
              {activePage === "tables" && <div>Tables Page (to migrate)</div>}
              {activePage === "inventory" && (
                <div>Inventory Page (to migrate)</div>
              )}
              {activePage === "analytics" && (
                <div>Analytics Page (to migrate)</div>
              )}
              {activePage === "ai" && <div>AI Insights Page (to migrate)</div>}
            </div>
          </main>
        </div>
      ) : (
        <div
          className="min-h-screen flex items-center justify-center p-8"
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
