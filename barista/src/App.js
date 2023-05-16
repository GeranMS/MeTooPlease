import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // fetch orders from the server
    fetch('/api/orders')
      .then(response => response.json())
      .then(data => setOrders(data));
      
  }, []);  

  const markOrderAsComplete = async (orderId) => {
    try {
      
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed' }),
      };
      const response = await fetch(`/api/orders/${orderId}/status`, requestOptions);
      const updatedOrder = await response.json();
      setOrders(orders.map((order) => (order._id === updatedOrder._id ? updatedOrder : order)));
      
    } catch (error) {
      console.error(error);
    }
  };  

  return (
    <div className="App">
      <h1>Outstanding Orders</h1>
      <ul>
      {orders
        .filter((order) => order.status === "Pending") // Filter orders with status "Pending"
        .map((order) => (
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
