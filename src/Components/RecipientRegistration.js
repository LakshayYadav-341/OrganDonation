import React, { useState } from 'react';
import { Form, Alert, Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const RecipientRegistration = ({ RecipientState }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    organType: '',
    email: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegistration = async (event) => {
    event.preventDefault();

    const { name, age, organType, email } = formData;

    if (!name || !age || !organType || !email) {
      setErrorMessage('All fields are required');
      return;
    }

    const { Contract } = RecipientState;

    try {
      setLoading(true);
      await Contract.registerRecipient(name, age, organType, email);
      const donorList = await Contract.findDonorsMatch(organType);

      if (donorList) {
        const response = await fetch('http://localhost:3001/send-mail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ donorList }),
        });

        if (response.ok) {
          alert('Recipient Registered! Please wait till the transaction is confirmed.');
          navigate('/home');
        } else {
          setErrorMessage('Failed to send data to the backend');
        }
      } else {
        setErrorMessage('No donorList available. Cannot send email.');
      }
    } catch (e) {
      setErrorMessage(e.reason || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Recipient Registration</h2>
      <form>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleFieldChange}
            required
          />
        </div>
        <div className="form-group mt-2">
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            className="form-control"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleFieldChange}
            required
          />
        </div>
        <div className="form-group mt-2">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleFieldChange}
            required
          />
        </div>
        <div className="form-group mt-2">
          <Form.Label>Organ Type:</Form.Label>
          <Form.Select
            id="organType"
            name="organType"
            value={formData.organType}
            onChange={handleFieldChange}
            required
            as="select"
          >
            <option value="">Select an organ type</option>
            <option value="Heart">Heart</option>
            <option value="Lung">Lung</option>
            <option value="Liver">Liver</option>
            <option value="Kidneys">Kidneys</option>
            <option value="Pancreas">Pancreas</option>
            <option value="Intestines">Intestines</option>
            <option value="Stomach">Stomach</option>
            <option value="Eyes">Eyes</option>
            <option value="Skin">Skin</option>
            <option value="Bones">Bones</option>
            <option value="Heart valves">Heart valves</option>
            <option value="Blood vessels">Blood vessels</option>
            <option value="Tendons">Tendons</option>
            <option value="Ligaments">Ligaments</option>
            <option value="Cartilage">Cartilage</option>
          </Form.Select>
        </div>
        <Alert variant="danger" show={errorMessage}>
          {errorMessage}
        </Alert>
        <Button type="button" variant="primary" className="mt-2" onClick={handleRegistration}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Register Recipient'}
        </Button>
      </form>
    </div>
  );
};

export default RecipientRegistration;
