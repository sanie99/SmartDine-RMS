import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Activity,
  TrendingUp,
  Menu as MenuIcon,
} from "lucide-react";
import Navbar from "./Navbar.jsx";
import Menu from "./Menu.jsx";

const COLORS = ["#4d0e1d", "#800000", "#d8a4ac", "#c8a49f", "#eee4da"];

export default function Dashboard({ token }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [analyticsRes, sentimentRes] = await Promise.all([
          fetch("http://localhost:5000/api/analytics", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/sentiment", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const analytics = await analyticsRes.json();
        const sentiment = await sentimentRes.json();

        setData({
          analytics: analytics,
          pie_data: analytics.pie_data,
          sentiment_pct: sentiment.data?.positive_pct || 85,
        });
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
        // Complete fallback mock
        setData({
          analytics: {
            todaySales: 12450,
            todayOrders: 187,
            avgOrderValue: 66.58,
            tableOccupancy: 78,
            salesTrend: [
              { day: "Mon", sales: 8000 },
              { day: "Tue", sales: 9500 },
              { day: "Wed", sales: 12450 },
              { day: "Thu", sales: 11000 },
              { day: "Fri", sales: 15000 },
              { day: "Sat", sales: 18000 },
              { day: "Sun", sales: 20000 },
            ],
          },
          pie_data: {
            Order_Category: [
              "Mains",
              "Desserts",
              "Drinks",
              "Appetizers",
              "Salads",
            ],
            No_of_Orders: [75, 45, 30, 25, 12],
          },
          sentiment_pct: 85,
        });
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#4d0e1d] to-[#800000] flex items-center justify-center">
        <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-[#eee4da]" />
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <div className="bg-[#eee4da] rounded-xl shadow-lg p-6 hover:shadow-xl transition">
      <div className="flex items-start justify-between mb-4">
        <div className={`${color} text-white p-3 rounded-lg`}>
          {<Icon className="w-12 h-12" />}
        </div>
        <span
          className={`text-sm font-semibold ${change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
        >
          {change}
        </span>
      </div>
      <h3 className="text-[#4d0e1d] text-sm font-semibold mb-1">{title}</h3>
      <p className="text-3xl font-bold text-[#800000]">{value}</p>
    </div>
  );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <header className="bg-gradient-to-r from-[#4d0e1d] to-[#800000] text-[#eee4da] p-8 rounded-2xl mb-8 shadow-2xl">
        <h1 className="text-5xl font-black text-center">
          SmartDine AI Dashboard
        </h1>
      </header>

      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "dashboard" && (
        <div className="space-y-8 max-w-7xl mx-auto">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={DollarSign}
              title="Today's Sales"
              value={`$${data.analytics?.todaySales?.toLocaleString() || "0"}`}
              change="+12.5%"
              color="bg-[#800000]"
            />
            <StatCard
              icon={ShoppingCart}
              title="Orders"
              value={data.analytics?.todayOrders || 0}
              change="+8.3%"
              color="bg-[#4d0e1d]"
            />
            <StatCard
              icon={Users}
              title="Avg Order Value"
              value={`$${(data.analytics?.avgOrderValue || 0).toFixed(2)}`}
              change="+5.1%"
              color="bg-[#d8a4ac]"
            />
            <StatCard
              icon={Activity}
              title="Table Occupancy"
              value={`${data.analytics?.tableOccupancy || 0}%`}
              change="-2.4%"
              color="bg-[#c8a49f]"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[#4d0e1d]">
                <TrendingUp className="w-8 h-8" />
                Sales Trend
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data.analytics?.salesTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#d8a4ac"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[#4d0e1d]">
                <MenuIcon className="w-8 h-8" />
                Category Distribution
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={
                      data.pie_data?.Order_Category?.map((name, i) => ({
                        name,
                        value: data.pie_data?.No_of_Orders[i] || 0,
                      })) || []
                    }
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {(data.pie_data?.Order_Category || []).map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ),
                    )}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "2rem",
              background: "linear-gradient(90deg, #4d0e1d, #800000)",
              color: "#eee4da",
              padding: "2rem",
              borderRadius: "16px",
              boxShadow: "0 15px 40px rgba(77, 14, 29, 0.5)",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h4
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "800",
                  marginBottom: "1rem",
                }}
              >
                Peak Hours
              </h4>
              <div
                style={{
                  background: "rgba(216, 164, 172, 0.3)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  fontSize: "1.5rem",
                  fontWeight: "900",
                }}
              >
                6-9 PM
              </div>
              <p
                style={{ marginTop: "0.8rem", opacity: 0.9, fontSize: "1rem" }}
              >
                85% occupancy
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <h4
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "800",
                  marginBottom: "1rem",
                }}
              >
                Top Dish
              </h4>
              <div
                style={{
                  background: "rgba(216, 164, 172, 0.3)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  fontSize: "1.5rem",
                  fontWeight: "800",
                }}
              >
                Truffle Pasta
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <h4
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "800",
                  marginBottom: "1rem",
                }}
              >
                Sentiment
              </h4>
              <div
                style={{
                  background: "rgba(238, 228, 218, 0.3)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  fontSize: "1.5rem",
                  fontWeight: "900",
                  color: "#d8a4ac",
                }}
              >
                {data.sentiment_pct}%
              </div>
              <p
                style={{ marginTop: "0.8rem", opacity: 0.9, fontSize: "1rem" }}
              >
                Positive
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "menu" && <Menu token={token} />}

      {activeTab === "tables" && (
        <div
          style={{
            padding: "4rem",
            fontSize: "1.5rem",
            textAlign: "center",
            color: "#eee4da",
          }}
        >
          Dynamic Table Heat Map
          <br />
          D3.js powered - ML allocation
        </div>
      )}

      {activeTab === "inventory" && (
        <div
          style={{
            padding: "4rem",
            fontSize: "1.5rem",
            textAlign: "center",
            color: "#eee4da",
          }}
        >
          Inventory Prediction (ML)
          <br />
          Low stock alerts
        </div>
      )}

      {activeTab === "feedback" && (
        <div
          style={{
            padding: "4rem",
            fontSize: "1.5rem",
            textAlign: "center",
            color: "#eee4da",
          }}
        >
          Feedback Sentiment (NLP)
          <br />
          HuggingFace pipeline
        </div>
      )}

      {activeTab === "qr" && (
        <div
          style={{
            padding: "4rem",
            fontSize: "1.5rem",
            textAlign: "center",
            color: "#eee4da",
          }}
        >
          QR Ordering & Stripe
          <br />
          Contactless payments
        </div>
      )}

      {activeTab === "payments" && (
        <div
          style={{
            padding: "4rem",
            fontSize: "1.5rem",
            textAlign: "center",
            color: "#eee4da",
          }}
        >
          Billing & Reports
          <br />
          GST invoices
        </div>
      )}

      {/* <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <p
          style={{
            color: "#eee4da",
            opacity: 0.7,
            fontSize: "1rem",
            fontStyle: "italic",
            maxWidth: "700px",
            margin: "0 auto",
          }}
        >
          ✅ Analytics working! Login as admin/admin. Run `cd server &amp;&amp;
          python app.py`. Seed data: POST /api/seed_orders with admin token.
          Frontend: `cd client &amp;&amp; npm run dev`
        </p>
      </div> */}
    </div>
  );
}
