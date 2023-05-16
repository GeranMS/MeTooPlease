import React, { useState } from 'react';

async function submitOrder(order) {
    const orderWithStatus = { ...order, status: "Pending" };
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderWithStatus),
    });
    if (!response.ok) {
      throw new Error('Failed to submit order');
    }
    const data = await response.json();
    return data;
  }
  
function Order() {
  const [name, setName] = useState('');
  const [coffeeType, setCoffeeType] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const order = { name, coffeeType, specialRequirements };
    try {
      const data = await submitOrder(order);
      console.log('Order submitted:', data);
      // TODO: show a success message to the user
    } catch (error) {
      console.error('Failed to submit order:', error);
      // TODO: show an error message to the user
    }
    setName('');
    setCoffeeType('');
    setSpecialRequirements('');
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleCoffeeTypeChange = (event) => {
    setCoffeeType(event.target.value);
  };

  const handleSpecialRequirementsChange = (event) => {
    setSpecialRequirements(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={name} onChange={handleNameChange} />
      </label>
      <br />
      <label>
        Coffee Type:
        <select value={coffeeType} onChange={handleCoffeeTypeChange}>
          <option value="">Select a coffee type</option>
          <option value="cortado">Cortado</option>
          <option value="flat-white">Flat White</option>
          <option value="latte">Latte</option>
          <option value="red-cap">Red Cap</option>
          <option value="espresso">Espresso</option>
        </select>
      </label>
      <br />
      <label>
        Special Requirements:
        <textarea value={specialRequirements} onChange={handleSpecialRequirementsChange} />
      </label>
      <br />
      <button type="submit">Place Order</button>
    </form>
  );
}

export default Order;
