import { useState } from "react";
import Register from "./Register.jsx";

export default function Login({ onLogin }) {
  const [activeTab, setActiveTab] = useState("login");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loginUsername.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.token);
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setError("");
    setLoginUsername("");
    setLoginPassword("");
  };

  const handleLoginSuccess = (token) => {
    onLogin(token);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 50,
        backgroundImage: `url(/assets/rest_img_1.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "28rem",
          margin: "0 auto",
          backgroundColor: "rgba(77,14,29,0.9)",
          backdropFilter: "blur(16px)",
          borderRadius: "24px",
          boxShadow: "0 25px 50px rgba(128,0,0,0.5)",
          padding: "2rem",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "900",
            textAlign: "center",
            marginBottom: "2rem",
            color: "#eee4da",
            textShadow: "0 4px 8px rgba(0,0,0,0.3)",
          }}
        >
          Welcome to SmartDine
        </h1>
        <div
          style={{
            display: "flex",
            backgroundColor: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            borderRadius: "16px",
            padding: "4px",
            marginBottom: "3rem",
            marginLeft: "1rem",
            marginRight: "1rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          }}
        >
          <button
            onClick={() => handleTabSwitch("login")}
            style={{
              flex: 1,
              padding: "0.75rem 1.5rem",
              borderRadius: "12px",
              fontWeight: 600,
              transition: "all 0.3s",
              border: "none",
              cursor: "pointer",
              backgroundColor:
                activeTab === "login" ? "#eee4da" : "transparent",
              color: activeTab === "login" ? "#4d0e1d" : "#eee4da",
              boxShadow:
                activeTab === "login" ? "0 4px 12px rgba(0,0,0,0.2)" : "none",
            }}
          >
            Login
          </button>
          <button
            onClick={() => handleTabSwitch("register")}
            style={{
              flex: 1,
              padding: "0.75rem 1.5rem",
              borderRadius: "12px",
              fontWeight: 600,
              transition: "all 0.3s",
              border: "none",
              cursor: "pointer",
              backgroundColor:
                activeTab === "register" ? "#eee4da" : "transparent",
              color: activeTab === "register" ? "#4d0e1d" : "#eee4da",
              boxShadow:
                activeTab === "register"
                  ? "0 4px 12px rgba(0,0,0,0.2)"
                  : "none",
            }}
          >
            Register
          </button>
        </div>
        <h2
          style={{
            fontSize: "1.875rem",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "2rem",
            background: "linear-gradient(to right, #d8a4ac, #c8a49f)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 4px 8px rgba(0,0,0,0.3)",
          }}
        >
          {activeTab === "register" ? "Create Account" : "Welcome Back"}
        </h2>

        {activeTab === "login" ? (
          <form
            onSubmit={handleLogin}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <input
              type="text"
              placeholder="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "1rem",
                border: "1px solid #d1d5db",
                borderRadius: "12px",
                outline: "none",
                backgroundColor: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(12px)",
                transition: "all 0.3s",
                fontSize: "1rem",
              }}
              required
            />
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "1rem 3rem 1rem 1rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "12px",
                  outline: "none",
                  backgroundColor: "rgba(255,255,255,0.8)",
                  backdropFilter: "blur(12px)",
                  transition: "all 0.3s",
                  fontSize: "1rem",
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.25rem",
                  color: "#6b7280",
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: "linear-gradient(to right, #d8a4ac, #c8a49f)",
                color: "#4d0e1d",
                padding: "1rem 0",
                borderRadius: "12px",
                fontWeight: "bold",
                fontSize: "1.125rem",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 12px 30px rgba(128,0,0,0.4)",
                opacity: loading ? 0.5 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "all 0.3s",
              }}
            >
              <span>{loading ? "Signing In..." : "Login"}</span>
              {loading && (
                <div
                  style={{
                    width: "1.25rem",
                    height: "1.25rem",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTop: "2px solid white",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
              )}
            </button>
            {error && (
              <p
                style={{
                  color: "#f87171",
                  backgroundColor: "rgba(239,68,68,0.1)",
                  padding: "0.75rem",
                  borderRadius: "12px",
                  textAlign: "center",
                  fontWeight: 500,
                }}
              >
                {error}
              </p>
            )}
          </form>
        ) : (
          <Register
            onSuccess={handleLoginSuccess}
            error={error}
            setError={setError}
          />
        )}
      </div>
    </div>
  );
}
