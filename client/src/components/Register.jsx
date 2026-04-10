import { useState } from "react";

export default function Register({ onSuccess, error, setError }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (username.length < 3) return "Username must be at least 3 characters";
    if (!email.match(/^[^@]+@[^@]+\.[^@]+$/)) return "Invalid email";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password))
      return "Password must have uppercase, lowercase, number";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valError = validateForm();
    if (valError) {
      setError(valError);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess(data.token);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#eee4da] focus:border-transparent transition-all"
        style={{
          width: "100%",
          padding: "1rem",
          border: "1px solid #d1d5db",
          borderRadius: "12px",
          outline: "none",
          backgroundColor: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(8px)",
          transition: "all 0.3s",
          fontSize: "1rem",
        }}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#eee4da] focus:border-transparent transition-all"
        style={{
          width: "100%",
          padding: "1rem",
          border: "1px solid #d1d5db",
          borderRadius: "12px",
          outline: "none",
          backgroundColor: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(8px)",
          transition: "all 0.3s",
          fontSize: "1rem",
        }}
        required
      />
      <input
        type="password"
        placeholder="Password (8+ chars, upper/lower/number)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#eee4da] focus:border-transparent transition-all"
        style={{
          width: "100%",
          padding: "1rem",
          border: "1px solid #d1d5db",
          borderRadius: "12px",
          outline: "none",
          backgroundColor: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(8px)",
          transition: "all 0.3s",
          fontSize: "1rem",
        }}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#eee4da] text-[#4d0e1d] py-4 rounded-xl font-semibold text-lg hover:bg-[#800000] hover:text-[#eee4da] transition-all duration-300 shadow-lg disabled:opacity-50"
        style={{
          width: "100%",
          background: "linear-gradient(to right, #eee4da, #d8a4ac)",
          color: "#4d0e1d",
          padding: "1rem 0",
          borderRadius: "12px",
          fontWeight: "600",
          fontSize: "1.125rem",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          opacity: loading ? 0.5 : 1,
          transition: "all 0.3s",
        }}
      >
        {loading ? "Creating Account..." : "Register"}
      </button>
    </form>
  );
}
