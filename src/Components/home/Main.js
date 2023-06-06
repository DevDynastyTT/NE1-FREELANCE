import ServicesBanner from './ServicesBanner';
import Reassurance from './Reassurance';
import GetStarted from './GetStarted';
import GlobalFooter from '../GlobalFooter'

function Main(){
    return(
                // Main container to hold everything
        <main className="home-main-container">

        {/* flexbox container that displays 4 SERVICES */}
        <ServicesBanner/>
            
            {/* text ABOUT THE SERVICES */}
            <Reassurance />

                {/* Login/Sign up banner */}
                <GetStarted />

        <br/><br/>

        <GlobalFooter/>

        </main>
    )
}

export default Main;