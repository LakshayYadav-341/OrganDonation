import './App.css';
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { ethers } from "ethers";
import OrganDonation from "./Contracts/OrganDonation.json";
import Landing from './Components/Landing';
import DonorRegistration from './Components/DonorRegistration';
import RecipientRegistration from './Components/RecipientRegistration';
import Home from './Components/Home';
import RecipientDashboard from './Components/RecipientDashboard';
import DonorDashboard from './Components/DonorDashboard';

function App() {
  const [ContractState, setContractState] = useState({
    provider: null,
    signer: null,
    contract: null
  });
  const [account, setAccount] = useState("None");

  useEffect(() => {
    const connectWallet = async () => {
      try {
        const { ethereum } = window;

        if (ethereum) {
          const [account] = await ethereum.request({
            method: "eth_requestAccounts",
          });

          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });

          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
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
          alert("Please install MetaMask");
        }
      } catch (error) {
        console.error(error);
      }
    };

    connectWallet();
  }, []);

  return (
    <div className="container">
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
    </div>
  );
}

export default App;
