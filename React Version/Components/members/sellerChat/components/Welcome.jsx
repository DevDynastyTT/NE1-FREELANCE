import '../../../../static/css/members/chat/welcome.css'

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
export default function Welcome() {
  const [userName, setUserName] = useState(undefined);
  useEffect(() => {
    function fetchUser(){
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        alert('Please login to view this page')
        navigate("/members/login")
        return
      } 

        console.log('User has authToken')
        const user = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
        setUserName(user.username)

    }

    fetchUser()
   
  }, []);
  return (
    <div className = "welcome-main-container">
      <h3>Please select a chat to Start messaging.</h3>
    </div>
  );
}
