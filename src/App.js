// App.js
import './App.css';
import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import OrganDonation from './Contracts/OrganDonation.json';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Landing from './Components/Landing';
import DonorRegistration from './Components/DonorRegistration';
import RecipientRegistration from './Components/RecipientRegistration';
import Home from './Components/Home';
import RecipientDashboard from './Components/RecipientDashboard';
import DonorDashboard from './Components/DonorDashboard';
import Footer from './Components/footer';

function App() {
  const [contractState, setContractState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [account, setAccount] = useState('None');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const connectWallet = async () => {
      try {
        const { ethereum } = window;

        if (ethereum) {
          setLoading(true);

          const [connectedAccount] = await ethereum.request({
            method: 'eth_requestAccounts',
          });

          window.ethereum.on('chainChanged', () => {
            navigate('/');
          });

          window.ethereum.on('accountsChanged', () => {
            navigate('/');
          });

          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            OrganDonation.address,
            OrganDonation.abi,
            signer
          );

          setAccount(connectedAccount);
          setContractState({ provider, signer, contract });
        } else {
          alert('Please install MetaMask and then reload the app');
        }
      } catch (error) {
        console.error(error);
        alert('Error connecting wallet. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    connectWallet();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar bg="dark" data-bs-theme="dark" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">
            <h1>Organ Donation</h1>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <h6 className="alert alert-info">Signed in with: {account}</h6>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/home"
          element={<Home _Contract={contractState} Account={account} />}
        />
        <Route
          path="/donor-registration"
          element={<DonorRegistration DonationState={contractState} />}
        />
        <Route
          path="/recipient-registration"
          element={<RecipientRegistration RecipientState={contractState} />}
        />
        <Route
          path="/donor-dashboard"
          element={<DonorDashboard _Contract={contractState} Account={account} />}
        />
        <Route
          path="/recipient-dashboard"
          element={<RecipientDashboard _Contract={contractState} Account={account} />}
        />
      </Routes>
      <Footer></Footer>
    </div>
  );
}

export default App;
