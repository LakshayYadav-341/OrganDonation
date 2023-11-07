import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = ({ _Contract, Account }) => {
    const { Contract } = _Contract;
    const [registeredRecipient, setRegisteredRecipient] = useState(false);
    const [registeredDonor, setRegisteredDonor] = useState(false);

    useEffect(() => {
        const checkRegistrationStatus = async () => {
            try {
                if (Contract) {
                    const DonorRegistered = await Contract.isDonorRegistered(Account);
                    const RecipientRegistered = await Contract.isRecipientRegistered(Account);
                    setRegisteredDonor(DonorRegistered);
                    setRegisteredRecipient(RecipientRegistered);
                }
            } catch (error) {
                console.error("Error checking registration status:", error);
            }
        };

        checkRegistrationStatus();
    }, [Contract, Account]);

    return (
        <div className="home">
            <div className="home-main">
                <div className="home-container mt-auto mb-auto">
                    <h1 className="home-h1">Log In As</h1>
                    <div className="home-btn mt-3">
                        {registeredDonor
                            ?
                            <Link to={"/donor-dashboard"}><button className="donor-btn btn btn-success btn-lg me-2">Donor</button></Link>
                            :
                            <Link to={"/donor-registration"}><button className="donor-btn btn btn-success btn-lg me-2">Donor</button></Link>
                        }
                        {registeredRecipient
                            ?
                            <Link to={"/recipient-dashboard"}><button className="recipient-btn btn btn-success btn-lg ms-2">Recipient</button></Link>
                            :
                            <Link to={"/recipient-registration"}><button className="recipient-btn btn btn-success btn-lg ms-2">Recipient</button></Link>
                        }
                    </div>
                </div>
                <div className="home-container">
                </div>
            </div>
        </div>
    );
};

export default Home;
