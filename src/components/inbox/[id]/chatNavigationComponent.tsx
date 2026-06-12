'use client'
import { faArrowLeftLong, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io();
export default function ChatNavigationComponent(props: any) {

   
    
  return (
    <nav className="chat-navigation">
        <div className='back-arrow-container'>
            <FontAwesomeIcon 
                className='back-arrow'
                icon={faArrowLeftLong} 
                onClick={() => props.router.back()} 
            />
        </div>
                

        <div className="userInfoContainer">
          <div className="username-container">
            <FontAwesomeIcon className='active-status'icon={faCircle} />
              <span className="username">{props.receiverUsername}</span>
          </div>

          {props.isTyping && <span className="typing-alert">typing...</span>}

        </div>
    </nav>
  )
}
