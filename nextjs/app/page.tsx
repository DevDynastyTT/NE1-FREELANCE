import '@styles/home/style.css';
import Header from '@components/home/Header';
import ServicesBanner from '@components/home/ServicesBanner';
import Reassurance from '@components/home/Reassurance';
import GetStarted from '@components/home/GetStarted';
import GlobalFooter from '@components/GlobalFooter'
import { Metadata } from 'next'

export const metadata:Metadata = {
  title: 'NE1-FREELANCE'
}
export default function HomePage() {
  return (
    <div className="Home">
      <Header />
      <main className="home-main-container">
        {/*Displays 4 SERVICES */}
        <ServicesBanner/>
            {/* Text ABOUT THE SERVICES */}
            <Reassurance />
                {/* Login/Sign up banner */}
                <GetStarted /><br/><br/>
                <GlobalFooter/>
        </main>
    </div>  
    )
}
