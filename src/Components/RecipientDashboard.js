import React, { useEffect, useState } from "react";

const RecipientDashboard = ({ _Contract, Account }) => {
    const { Contract } = _Contract;
    const [recipientDetails, setRecipientDetails] = useState(null);
    const [donorObj, setDonorObj] = useState({});
    const [matched, setMatched] = useState(null);

    useEffect(() => {
        const checkAvailableDonors = async () => {
            try {
                const recipientInfo = await Contract.getRecipientDetails(Account);
                setRecipientDetails(recipientInfo);
            } catch (e) {
                alert(e.reason);
            }
        };

        checkAvailableDonors();
    }, [Contract, Account]);

    useEffect(() => {
        const getDonors = async () => {
            if (recipientDetails && recipientDetails.isAvailable) {
                const details = {};
                for (const donorAddress of recipientDetails.requests) {
                    try {
                        const donorDetails = await Contract.getDonorDetails(donorAddress);
                        details[donorAddress] = donorDetails;
                    } catch (error) {
                        alert(error.reason);
                    }
                }
                setDonorObj(details);
            }
        };

        getDonors();
    }, [recipientDetails, Contract]);

    useEffect(() => {
        const findMatched = async () => {
            if (recipientDetails && !recipientDetails.isAvailable) {
                try {
                    const details = await Contract.getDonorDetails(recipientDetails.matchAddress);
                    setMatched(details);
                } catch (error) {
                    alert(error.reason);
                }
            }
        };

        findMatched();
    }, [recipientDetails, Contract]);

    const handleMatch = async (donor) => {
        try {
            await Contract.tryMatch(donor);
            alert("Request accepted!");
            window.location.replace('http://localhost:3000/');
        } catch (error) {
            alert(error.reason)
        }
    };

    return (
        <div className="container">
            <h1 className="home-h1">Recipient dashboard</h1>
            {recipientDetails && recipientDetails.isAvailable && (
                <h1>Received Requests of Donors</h1>
            )}

            <ul className="list-group">
                {recipientDetails && recipientDetails.isAvailable &&
                    recipientDetails.requests.map((donor, index) => (
                        <li key={index} className="list-group-item">
                            {donorObj[donor] && (
                                <div>
                                    <h3>Donor Details</h3>
                                    <p><strong>Name:</strong> {donorObj[donor].name}</p>
                                    <p><strong>Email:</strong> {donorObj[donor].email}</p>
                                    <p><strong>Organ Donated:</strong> {donorObj[donor].organType}</p>
                                </div>
                            )}
                            <button className="btn btn-primary" onClick={() => handleMatch(donor)}>Accept</button>
                        </li>
                    ))}
            </ul>
            {
                recipientDetails && !recipientDetails.isAvailable && (
                    <div className="alert alert-info">You are already matched to {matched?.name}. The Email address of Donor is {matched?.email}</div>
                )
            }
        </div>
    );
};

export default RecipientDashboard;
