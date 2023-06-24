import '../../../../static/css/members/chat/welcome.css'


import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
import {useNavigate} from 'react-router-dom'
export default function Welcome() {
  const [userName, setUserName] = useState(undefined);
  const navigate = useNavigate()
 
  return (
   <div className = "welcome-main-container">
    <h3>Please select a chat to Start messaging.</h3>
    </div>
  );
}
