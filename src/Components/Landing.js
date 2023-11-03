import { Link } from "react-router-dom"
const Landing = () => {
    return (
        <div className="landing-page">
            <div className="landing-center-div">
                <h1 className="landing-h1">Welcome to Organ Donation</h1>
                <Link to={"/home"}><button className='btn btn-success btn-lg'>Get Started</button></Link>
            </div>
        </div>
    );
}
export default Landing;