import '../../../../static/css/members/chat/contacts.css'

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import {useParams} from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from "axios"

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = () => {
      const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
      setCurrentUserName(data.username);
      if(data.profile_picture === 'undefined') setCurrentUserImage('http://localhost:3000/images/default.jpeg')
      else setCurrentUserImage(data.profile_picture);

    };
  
    fetchData();
  }, []);

  useEffect(()=>{
    console.log(currentUserImage)
  }, [currentUserImage])
  
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  
  return (
    <div className="contacts-main-container">
      {/* {currentUserImage && currentUserImage && ( */}
        {/* <Container> */}
          <div className="heading">
            <h3
              onClick={()=> navigate('/members/chat')}
            
            >Messages</h3>
            
          </div>
          <br />


          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div key={contact._id} className={`contact ${index === currentSelected ? "selected" : ""}`}
                  onClick={() => changeCurrentChat(index, contact)}>
                  
                  <div className="avatar">

                    {contact.profile_picture !== undefined ? (
                      <img src={`data:image/svg+xml;base64,${contact.profile_picture}`} alt=""/>
                      ) : 
                      <img src={'http://localhost:3000/images/default.jpeg'} alt="defaultImage"/>  
                      }
                    
                  </div>


                  <div className="username">
                    <h2>{contact.username}</h2>
                  </div>
                </div>
              );
            })}
          </div>


        {/* </Container> */}
      {/* )} */}
    </div>
  );
}
