import React, { useEffect, useState } from "react";
import web3 from 'web3';

const DonorDashboard = ({ _Contract, Account }) => {
    const { Contract } = _Contract;
    const [availableRecipients, setAvailableRecipients] = useState([]);
    const [recipientDetails, setRecipientDetails] = useState({});
    const [donorObj, setDonorObj] = useState({});
    const [matched, setMatched] = useState(null);
    const [fetchingRecipientDetailsError, setFetchingRecipientDetailsError] = useState(null);

    useEffect(() => {
        const fetchDonorDetails = async () => {
            if (Contract && Account && web3.utils.isAddress(Account)) {
                try {
                    const details = await Contract.getDonorDetails(Account);
                    setDonorObj(details);
                } catch (error) {
                    console.error("Error fetching donor details:", error);
                }
            } else {
                console.error("Invalid or missing Ethereum address for donor details.");
            }
        };

        fetchDonorDetails();
    }, [Contract, Account]);

    useEffect(() => {
        const findMatchedRecipient = async () => {
            if (donorObj && !donorObj.isAvailable && web3.utils.isAddress(donorObj.matchedAddress)) {
                try {
                    const details = await Contract.getRecipientDetails(donorObj.matchedAddress);
                    setMatched(details);
                } catch (error) {
                    console.error("Error fetching matched recipient details:", error);
                }
            } else {
                console.error("Invalid or missing Ethereum address for matching recipient details.");
            }
        };

        if (donorObj && donorObj.isAvailable === false) {
            findMatchedRecipient();
        }
    }, [donorObj, Contract]);

    useEffect(() => {
        const checkAvailableRecipients = async () => {
            try {
                if (donorObj && donorObj.isAvailable && Contract) {
                    const list = await Contract.findMatch();
                    setAvailableRecipients(list);
                }
            } catch (error) {
                console.error("Error fetching available recipients:", error);
            }
        };

        checkAvailableRecipients();
    }, [Contract, donorObj]);

    useEffect(() => {
        const fetchRecipientDetails = async () => {
            const details = {};
            setFetchingRecipientDetailsError(null);

            for (const recipientAddress of availableRecipients) {
                try {
                    const recipientInfo = await Contract.getRecipientDetails(recipientAddress);
                    details[recipientAddress] = recipientInfo;
                } catch (error) {
                    console.error(`Error fetching details for recipient ${recipientAddress}:`, error);
                    setFetchingRecipientDetailsError("Error fetching recipient details. Please try again later.");
                }
            }

            setRecipientDetails(details);
        };

        if (availableRecipients.length > 0 && donorObj.isAvailable) {
            fetchRecipientDetails();
        }
    }, [availableRecipients, Contract, donorObj.isAvailable]);

    const sendRequest = async (recipient) => {
        try {
            const req = await Contract.sendRequest(recipient);
            if(req){
                alert("Request sent!");
                window.location.replace('http://localhost:3000/');
            }
        } catch (error) {
            console.error("Error sending match request:", error);
            alert(error.reason);
        }
    };

    return (
        <div className="container">
            <h1 className="home-h1">Donor dashboard</h1>
            {donorObj && donorObj.isAvailable && (<h2>Available Recipients:</h2>)}
            <ul className="list-group">
                {donorObj.isAvailable === false && matched && (
                    <div className="alert alert-info">
                        You are already matched to {matched.name}. The Email address of Recipient is {matched.email}
                    </div>
                )}
                {donorObj.isAvailable && availableRecipients.map((recipient, index) => (
                    <li key={index} className="list-group-item">
                        {recipientDetails[recipient] && (
                            <div>
                                <h3>Recipient Details</h3>
                                <p><strong>Name:</strong> {recipientDetails[recipient].name}</p>
                                <p><strong>Organ Required:</strong> {recipientDetails[recipient].organType}</p>
                            </div>
                        )}
                        {donorObj.isAvailable && (
                            <button className="btn btn-primary" onClick={() => sendRequest(recipient)}>Send Match Request</button>
                        )}
                    </li>
                ))}
            </ul>
            {fetchingRecipientDetailsError && (
                <div className="alert alert-danger">{fetchingRecipientDetailsError}</div>
            )}
        </div>
    );
};

export default DonorDashboard;
