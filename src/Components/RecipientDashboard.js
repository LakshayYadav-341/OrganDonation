import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner, Alert } from "react-bootstrap";

const RecipientDashboard = ({ _Contract, Account }) => {
    const { Contract } = _Contract;
    const [recipientDetails, setRecipientDetails] = useState(null);
    const [donorDetails, setDonorDetails] = useState({});
    const [matchedDonor, setMatchedDonor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const recipientInfo = await Contract.getRecipientDetails(Account);
                setRecipientDetails(recipientInfo);

                if (recipientInfo.isAvailable) {
                    const donorDetailsMap = {};
                    for (const donorAddress of recipientInfo.requests) {
                        const donorDetails = await Contract.getDonorDetails(donorAddress);
                        donorDetailsMap[donorAddress] = donorDetails;
                    }
                    setDonorDetails(donorDetailsMap);
                } else {
                    const matchedDonorAddress = recipientInfo.matchAddress[recipientInfo.matchAddress.length - 1];
                    const details = await Contract.getDonorDetails(matchedDonorAddress);
                    setMatchedDonor(details);
                }

                setLoading(false);
            } catch (e) {
                setError(e.reason || "An error occurred while fetching data.");
                setLoading(false);
            }
        };

        fetchData();
    }, [Contract, Account]);

    const handleMatch = async (donor) => {
        try {
            await Contract.tryMatch(donor);
            alert("Request accepted! Please wait until the transaction is confirmed. Then click OK");
            navigate('/home');
        } catch (error) {
            setError(error.reason || "An error occurred while accepting the request.");
        }
    };

    return (
        <div className="recipient-dashboard">
            <h1 className="recipient-h1">Recipient Dashboard</h1>

            {loading && <Spinner id="loading-spinner" className="spinner" animation="border" role="status" />}

            {error && <Alert id="error-alert" className="alert danger" variant="danger">{error}</Alert>}

            {recipientDetails && !loading && !error && (
                <>
                    {recipientDetails.isAvailable ? (
                        <>
                            {recipientDetails.requests.length > 0 ? (
                                <>
                                    <h2 className="received-requests-title">Received Requests from Donors</h2>
                                    <ul className="list-group">
                                        {recipientDetails.requests.map((donor, index) => (
                                            <li key={index} className="list-group-item recipient-request">
                                                {donorDetails[donor] && (
                                                    <>
                                                        <h3>Donor Details</h3>
                                                        <p><strong>Name:</strong> {donorDetails[donor].name}</p>
                                                        <p><strong>Email:</strong> {donorDetails[donor].email}</p>
                                                        <p><strong>Organ Donated:</strong> {donorDetails[donor].organType}</p>
                                                    </>
                                                )}
                                                <button className="btn btn-primary accept-button" onClick={() => handleMatch(donor)}>Accept</button>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : (
                                <h3 className="no-request-message">No requests received</h3>
                            )}
                        </>
                    ) : (
                        <div className="alert info">
                            You are already matched to <span id="matched-name">{matchedDonor?.name}</span>. The Email address of Donor is <span id="matched-email">{matchedDonor?.email}</span><br/><br/>
                            <p>Do you want to get a new organ? <button className="btn btn-success btn-sm" onClick={() => navigate('/recipient-registration')}>new organ registration</button></p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default RecipientDashboard;
