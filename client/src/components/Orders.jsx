import React, { useState, useEffect } from "react";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        // Mock data
        setOrders([
          {
            id: 84,
            items: "Biryani, Raita, Lassi",
            table: "T-4",
            status: "preparing",
            amount: 620,
            time: "4m ago",
          },
          // More mock...
        ]);
      }
    };
    fetchOrders();
  }, [token]);

  return (
    <div>
      <div className="tabs">
        <div className="tab active">All Orders</div>
        <div className="tab">Pending</div>
        <div className="tab">Preparing</div>
      </div>
      <div className="card">
        <div className="order-table">
          <div className="order-row header">
            <div>#</div>
            <div>Items</div>
            <div>Table</div>
            <div>Status</div>
            <div>Amount</div>
            <div>Time</div>
          </div>
          {orders.map((order) => (
            <div key={order.id} className="order-row">
              <div className="order-id">#{order.id}</div>
              <div>{order.items}</div>
              <div>
                <div className="table-num">{order.table}</div>
              </div>
              <div>
                <div className={`status-pill s-${order.status}`}>
                  {order.status}
                </div>
              </div>
              <div className="price">₹{order.amount}</div>
              <div className="time-ago">{order.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
