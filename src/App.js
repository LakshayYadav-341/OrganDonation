import './App.css';

import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import OrganDonation from "./Contracts/OrganDonation.json";
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
  const [ContractState, setContractState] = useState({
    provider: null,
    signer: null,
    contract: null
  });
  const [account, setAccount] = useState("None");

  const navigate = useNavigate();

  useEffect(() => {
    const connectWallet = async () => {
      try {
        const { ethereum } = window;

        if (ethereum) {
          const [account] = await ethereum.request({
            method: "eth_requestAccounts",
          });

          window.ethereum.on("chainChanged", () => {
            navigate('/');
          });

          window.ethereum.on("accountsChanged", () => {
            navigate('/');
          });

          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const Contract = new ethers.Contract(
            OrganDonation.address,
            OrganDonation.abi,
            signer
          );
          setAccount(account);
          setContractState({ provider, signer, Contract });
        } else {
          alert("Please install MetaMask and then reload the app");
        }
      } catch (error) {
        console.error(error);
      }
    };

    connectWallet();
  }, []);

  return (
    <div>
      <Navbar bg="dark" data-bs-theme="dark" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home"><h1>Organ Donation</h1></Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            <h6 className='alert alert-info'>Signed in with: {account}</h6>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
      <Router>
        <Routes>
          <Route path='/' element={<Landing/>}></Route>
          <Route path='/home' element={<Home _Contract={ContractState} Account={account} />} />
          <Route path='/donor-registration' element={<DonorRegistration DonationState={ContractState} />} />
          <Route path='/recipient-registration' element={<RecipientRegistration RecipientState={ContractState} />} />
          <Route path='/donor-dashboard' element={<DonorDashboard _Contract={ContractState} Account={account}/>} />
          <Route path='/recipient-dashboard' element={<RecipientDashboard _Contract={ContractState} Account={account}/>}></Route>
        </Routes>
      </Router>
      <Footer></Footer>
    </div>
  );
}

export default App;
