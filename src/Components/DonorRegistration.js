import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

const DonorRegistration = ({ DonationState }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [organType, setOrganType] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegistration = async (event) => {
    event.preventDefault();

    if (!name || !age || !organType || !email) {
      setErrorMessage('All fields are required');
      return;
    }

    const { Contract } = DonationState;
    let transaction;
    try {
      transaction = await Contract.registerDonor(name, age, organType, email);
      if(transaction){
        alert("Donor Registered!");
        window.location.replace('http://localhost:3000/');
      }
    } catch (e) {
      alert(e.reason);
    }
  };

  return (
    <div className="container">
      <h4 className='alert alert-danger mt-4 donor-registration-h4'>Your are not a registered Donor. Please register first.</h4>
      <h1 className="donor-registration-h1">Donor Registration</h1>
      <form>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group mt-2">
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            className="form-control"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div className="form-group mt-2">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group mt-2">
          <label htmlFor="organType">Organ Type:</label>
          <Form.Select
            id="organType"
            value={organType}
            onChange={(e) => setOrganType(e.target.value)}
            required
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
        {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
        <button type="button" className="btn btn-primary mt-2" onClick={handleRegistration}>
          Register Donor
        </button>
      </form>
    </div>
  );
};

export default DonorRegistration;
