import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import logo from './static/images/N.png'

import Home from './Components/home/Home';

import Login from './Components/members/Login';
import Signup from './Components/members/Signup';
import Profile from './Components/members/Profile'
import PaymentGateway from './Components/members/PaymentGateway/PaymentGateway'
import ServicesDisplay from './Components/admin/ServicesDisplay';

import CreateJob from './Components/jobs/CreateJob'
import JobDetails from './Components/jobs/JobDetails'
import Search from './Components/jobs/Search';
import Results from './Components/jobs/Results';

import Contact from './Components/contact/Contact';
import Admin from './Components/admin/Admin';
import AboutUsContent from './Components/admin/AboutUsContent';
import AboutUs from './Components/aboutUs/AboutUs';
import UserInfo from './Components/admin/UserInfo';

import Chat from './Components/members/chat/pages/Chat'
import SellerChat from './Components/members/sellerChat/pages/Chat'

import Unauthorized from './Unauthorized';
import { useEffect, useState } from 'react';
import { userSession, heartBeat } from './Components/utils/APIRoutes';

export default function App(){
  const [currentUser, setCurrentUser] = useState();
  const [isServerAlive, setServerAlive] = useState(true);

  function fetchCurrentUser() {
    axios.get(userSession, {withCredentials: true}) //Include credentials for session handling
      .then(response => {
        const data = response.data
        if(!data.status) {
          console.log(data.error)
          return
        }
        setCurrentUser(data.user)
        console.log(data.user.username || data.user)
      })
    
  
  }
let count = 1
  async function checkServerStatus(){
    try {
      const response = await axios.get(heartBeat, { withCredentials: true });
      setServerAlive(true);
    } catch (error) {
      if(currentUser) {
        alert('You session has ended')
      }
      setCurrentUser(null)
      setServerAlive(false);
    }
  }

  useEffect(() => {
    const interval = setInterval(checkServerStatus, 5000);
    fetchCurrentUser();
  
    if (!isServerAlive) {
      clearInterval(interval);
    }
  
    return () => {
      clearInterval(interval);
    };
  }, []);
  

  useEffect(() => {
    if (isServerAlive == false  && currentUser) {
      alert('Your session has ended');
      setCurrentUser(null);
    }
  }, [isServerAlive]);

  return (
    <div className="App">
        <Router>
        <Helmet>
        <link rel="shortcut icon" href={logo} type="image/png" style={{ width: '32px', height: '32px' }}/>
        </Helmet>
          <Routes>
            <Route path="/" element={<Home currentUser={currentUser} setCurrentUser={setCurrentUser}/>} />
            <Route path="/:loggedOut" element={<Home currentUser={currentUser} setCurrentUser={setCurrentUser}/>} />
            <Route path="/members/login" element={<Login currentUser={currentUser} /> }/>
            <Route path="/members/signup" element={<Signup currentUser={currentUser} /> }/>
            <Route path="/members/profile" element={<Profile currentUser={currentUser} setCurrentUser={setCurrentUser}/>} />
            <Route path="/members/chat" element={<Chat currentUser={currentUser} setCurrentUser={setCurrentUser}/>} />
            <Route path="/members/checkout/:jobID" element={<PaymentGateway currentUser={currentUser} setCurrentUser={setCurrentUser}/>} />
            <Route path="/members/chat/:seller_id" element={<SellerChat currentUser={currentUser} setCurrentUser={setCurrentUser}/>} /> //TODO

            <Route path="/jobs/createjob" element={<CreateJob currentUser={currentUser} setCurrentUser={setCurrentUser}/>} />
            <Route path="/jobs/search" element={<Search currentUser={currentUser} setCurrentUser={setCurrentUser}/>} />  
            <Route path="/jobs/search/:category/:term" element={<Results currentUser={currentUser} setCurrentUser={setCurrentUser}/>} />
            <Route path="/jobs/search/:term/" element={<Results  currentUser={currentUser} setCurrentUser={setCurrentUser}/>} />
            <Route path="/jobs/search/details/:jobID" element={<JobDetails currentUser={currentUser} setCurrentUser={setCurrentUser}/>} />
            <Route path="/about" element={<AboutUs currentUser={currentUser} setCurrentUser={setCurrentUser}/>} />
            <Route path="/contact" element={<Contact currentUser={currentUser} setCurrentUser={setCurrentUser}/>} />

            {currentUser && currentUser.is_staff ? (
              <> 
                <Route path="/admin" element={<Admin currentUser={currentUser} setCurrentUser={setCurrentUser} />}/>
                <Route path="/admin/AboutUsContent/add" element={<AboutUsContent currentUser={currentUser}  setCurrentUser={setCurrentUser}/>}/>
                <Route path="/admin/UserInfo" element={<UserInfo currentUser={currentUser}  setCurrentUser={setCurrentUser}/>}/>
                <Route path="/admin/HomeServices" element={<ServicesDisplay currentUser={currentUser}  setCurrentUser={setCurrentUser}/>}/>
                </> 
             ): (
              <>
                <Route path="/admin" element={<Unauthorized/>}/>
                <Route path="/admin/AboutUsContent/add" element={<Unauthorized/>}/>
                <Route path="/admin/UserInfo" element={<Unauthorized/>}/>
                <Route path="/admin/HomeServices" element={<Unauthorized/>}/>
              </> 
            )}
        
          </Routes>
        </Router>
    </div>
  );
}

