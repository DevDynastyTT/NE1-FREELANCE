import '../../../../static/css/members/chat/contacts.css'

import React, { useState } from "react";

export default function Contacts({ username, userProfilePicture, contacts, changeChat }) {
  const [currentSelected, setCurrentSelected] = useState();


  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  return (
    <div className="contacts-main-container">
            <h2 className="logged-in-username">{username}</h2>
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
    </div>
  );
}