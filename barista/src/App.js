import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // fetch orders from the server
    fetch('/api/orders')
      .then(response => response.json())
      .then(data => setOrders(data))
  }, [orders]);  

  const markOrderAsComplete = async (orderId) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed' }),
      });
      const updatedOrder = await response.json();
      setOrders(orders.map((order) => (order._id === updatedOrder._id ? updatedOrder : order)));
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div className="App">
      <h1>Barista Interface</h1>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            <p>{order.name}</p>
            <p>{order.coffeeType}</p>
            <p>{order.specialRequirements}</p>
            <button onClick={() => markOrderAsComplete(order._id)}>
              Done
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
