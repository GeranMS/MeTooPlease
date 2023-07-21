import React, { useState, useEffect } from 'react';
import './Order.css';
const SESSION_STORAGE_KEY = 'order_names';
const coffeeOptions = [
  { value: 'Usual', description: 'GOTO' },
  { value: 'Cappucino', description: 'Espresso with steamed milk and a layer of foam' },
  { value: 'Latte', description: '2x Espresso with a lot of steamed milk and a small amount of foam' },
  { value: 'KG', description: 'Iykyk' },
  { value: 'Cortado', description: '2x Espresso, steamed milk' },
  { value: 'Flat White', description: '2x Espresso with steamed milk' },
  { value: 'Americano', description: '2x Espresso with hawt water' },
  { value: 'Macchiato', description: 'Espresso with foam' },
  { value: 'Dirty Coffee', description: '2x Espresso poured over cold milk' },
  { value: 'Mocha', description: '2x Espresso, chocolate and steamed milk' },
  { value: 'Piccolo', description: 'Single cortado' },
  { value: 'Espresso', description: 'Espresso' },
  { value: 'Doppio', description: '2x Espresso' },
  { value: 'Tea', description: 'T' },
  { value: 'Red Cappucino', description: 'Red Espresso with steamed milk and a layer of foam' },
  { value: 'Ice Coffee', description: 'All right stop; collaborate and listen...' },
  { value: 'Hot Chocolate', description: 'Hot chockey powder with steamed milk' }
];
async function submitOrder(order) {
  const orderWithStatus = { ...order, status: "Pending" };
  const response = await fetch('https://hopaserver.azurewebsites.net/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderWithStatus),
  });
  if (!response.ok) {
    //throw new Error('Failed to submit order');
  }
  const data = await response.json();
  return data;
}
function Order() {
  const [name, setName] = useState('');
  const [coffeeType, setCoffeeType] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cachedNames, setCachedNames] = useState([]);
  useEffect(() => {
    // Retrieve cached names from sessionStorage
    const cachedNamesJSON = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (cachedNamesJSON) {
      setCachedNames(JSON.parse(cachedNamesJSON));
    }
  }, []);
  useEffect(() => {
    // Update cached names in sessionStorage
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(cachedNames));
  }, [cachedNames]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name) {
      setError('Please enter a name');
      return;
    }
    const order = { name, coffeeType, specialRequirements };
    try {
      const data = await submitOrder(order);
      setSuccess('Order submitted successfully');
      console.log('Order submitted:', data);
    } catch (error) {
      // setError('Failed to submit order');
      console.error('Failed to submit order:', error);
    }
    setError('')
    setName('');
    setCoffeeType('');
    setSpecialRequirements('');
    if (!cachedNames.includes(name)) {
      setCachedNames([...cachedNames, name]);
    }
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
    <div className="order-container">
      <form className="order-form" onSubmit={handleSubmit} style={{ backgroundImage: `url('/images/coffePhoto.png')` }}>
        <label>
          Name:
          <input type="text" className="input-field" value={name} onChange={handleNameChange} list="nameList" />
          <datalist id="nameList">
            {cachedNames.map((cachedName) => (
              <option key={cachedName} value={cachedName} />
            ))}
          </datalist>
        </label>
        <br />
        <label>
          Coffee Type:
          <select className="input-field" value={coffeeType} onChange={handleCoffeeTypeChange}>
            {coffeeOptions.map((option) => (
              <option key={option.value} value={option.value} title={option.description}>
                {option.value}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Special Requirements:
          <textarea className="input-field" value={specialRequirements} onChange={handleSpecialRequirementsChange} />
        </label>
        <br />
        <button type="submit" className="submit-button">Place Order</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
}
export default Order;