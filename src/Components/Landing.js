import { Link } from "react-router-dom"
const Landing = () => {
    return (
        <div className="landing-page">
            <div className="landing-div mt-auto mb-auto">
                <h1 className="landing-h1">Welcome to Organ Donation</h1>
                <Link to={"/home"}><button className='btn btn-success btn-lg'>Get Started</button></Link>
            </div>
            <div className="landing-img landing-div mt-auto mb-auto">
                <img className="img" src="/organ-donation.jpg" alt=""></img>
            </div>
        </div>
    );
}
export default Landing;