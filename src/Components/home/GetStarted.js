import Man from '../../static/images/man.png'
import { Link, useNavigate } from 'react-router-dom';
function GetStarted() {
    const navigate = useNavigate()
    return (
        <div className="getStarted">
        
        <div className="signup-cta">
            <h5>Unlock your business's <i>potential</i> <br/> 
                with the right talent!</h5>
                <br/>
            <button className="getStarted-btn" title="get started button"
                onClick={()=> navigate("/members/signup")}>Get Started
            </button>
        </div>

        <div className="image">
            <img src={Man} alt="Black guy in white jersey excited"/>
        </div>
    
</div>
    )
}

export default GetStarted;