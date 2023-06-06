import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../../static/css/home/index.css';
import Header from './Header';
import Main from './Main';

export default function Home({ currentUser }) {
  const navigate = useNavigate();
  useEffect(()=> { 
    if(currentUser && !currentUser.is_staff) navigate('/jobs/search') 

  }, [currentUser, navigate])

  return (
     <>
        {/* {!currentUser || currentUser == undefined || currentUser == null || currentUser.is_staff && ( */}
          <>
            <div className="Home">
                <Header />
                <Main />
            </div>
          </>
        {/* )} */}
    </>
)}  // End stateless function component
