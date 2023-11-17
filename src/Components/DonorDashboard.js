import React, { useEffect, useState } from "react";
import web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';

const DonorDashboard = ({ _Contract, Account }) => {
    const { Contract } = _Contract;
    const [donorObj, setDonorObj] = useState({});
    const [matched, setMatched] = useState(null);
    const [availableRecipients, setAvailableRecipients] = useState([]);
    const [recipientDetails, setRecipientDetails] = useState({});
    const [fetchingRecipientDetailsError, setFetchingRecipientDetailsError] = useState(null);

    const navigate = useNavigate();

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
            if (donorObj && !donorObj.isAvailable && web3.utils.isAddress(donorObj.matchedAddress[0])) {
                const arr = donorObj.matchedAddress;
                const _matchedAddress = arr[arr.length - 1];
                try {
                    const details = await Contract.getRecipientDetails(_matchedAddress);
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

        if (donorObj && donorObj.isAvailable) {
            checkAvailableRecipients();
        }
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
            if (req) {
                alert("Request sent! Please wait until the transaction is confirmed. Then click OK");
                navigate('/home');
            }
        } catch (error) {
            console.error("Error sending match request:", error);
            alert(error.reason || "An error occurred while sending the match request.");
        }
    };

    return (
        <div className="donor-dashboard">
            <h1 className="donor-h1">Donor Dashboard</h1>
            {donorObj.isAvailable && (
                <>
                    {availableRecipients.length > 0 ? (
                        <>
                            <h2 className="available-recipients-title">Available Recipients:</h2>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Organ Required</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {availableRecipients.map((recipient, index) => (
                                        <tr key={index}>
                                            <td>{recipientDetails[recipient]?.name}</td>
                                            <td>{recipientDetails[recipient]?.organType}</td>
                                            <td>
                                                <button
                                                    className="btn btn-primary send-request-button"
                                                    onClick={() => sendRequest(recipient)}
                                                >
                                                    Send Match Request
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    ) : (
                        <h3 className="alert alert-info">No available Recipients!</h3>
                    )}
                </>
            )}
            {!donorObj.isAvailable && matched && (
                <div className="alert alert-info matched-recipient-info">
                    You are already matched to <span id="matched-recipient-name">{matched.name}</span>.
                    The Email address of Recipient is <span id="matched-recipient-email">{matched.email}</span>
                    <p>Do you want to get a new organ? <button className="btn btn-success btn-sm" onClick={() => navigate('/donor-registration')}>new organ registration</button></p>
                </div>
            )}
            {fetchingRecipientDetailsError && (
                <div className="alert alert-danger fetching-error">{fetchingRecipientDetailsError}</div>
            )}
        </div>
    );
};

export default DonorDashboard;
