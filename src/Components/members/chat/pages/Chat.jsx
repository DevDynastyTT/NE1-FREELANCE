import "../../.././../static/css/members/chat/chat.css"
import React, { useEffect, useState, useRef } from "react"
import { io } from "socket.io-client"
import axios from 'axios'
import { getUserProfile, allUsersRoute, host } from "../../../utils/APIRoutes"
import ChatContainer from "../components/ChatContainer"
import Contacts from "../components/Contacts"
import Welcome from "../components/Welcome";
import ChatGlobalNavBar from "../../ChatGlobalNavBar"
import { useNavigate } from "react-router-dom"

export default function Chat({currentUser, setCurrentUser}) {
  const navigate = useNavigate()
  useEffect(()=> { 
    if(!currentUser || currentUser == null || currentUser == undefined) navigate('/members/login') 
  }, [currentUser, navigate])

  const socket = useRef()
  const [contacts, setContacts] = useState([])
  const [currentChat, setCurrentChat] = useState(undefined)
  const [userProfilePicture, setUserProfilePicture] = useState()

  function profile() {

    axios
      .get(`${getUserProfile}/${currentUser._id}`)
      .then((response) => {
        const data = response.data;
        if (data.error) {
          alert(data.error);
          console.log(data.error);
          setMessage(data.error);
        } else {
          console.log('User profile', data.user_profile.profile_picture);
          setUserProfilePicture(data.user_profile.profile_picture);
        }
      })
      .catch((error) => {
        console.error(error);
        setMessage("Internal server error");
      });
  }

 
  useEffect(() => {
    if (currentUser) {
        profile()
      console.log('Checking socket')
      socket.current = io(host)
      socket.current.emit("add-user", currentUser._id)
      console.log('Socket checked successfully')
      console.log('Current user changed:', currentUser)
        
      async function fetchData() {
        /*
          Fetch the seller ID from the url
          send the seller id to the database
        */
        const response = await axios.get(`${allUsersRoute}/${currentUser._id}`)
        const data = response.data
        console.log('Contacts data:', data.users)
        setContacts(data.users) //Array of user objects
      }
      fetchData()
    }

  }, [currentUser])
  
  
  const handleChatChange = (chat) => {
    setCurrentChat(chat)
    console.log(chat)
  }

  return (
    <>
      {currentUser && userProfilePicture && (
        <div className="chat">
          <ChatGlobalNavBar 
            currentUser={currentUser} 
            setCurrentUser={setCurrentUser}
            userProfilePicture={userProfilePicture}/>

            <main className="chat-main-container">

            {/* <Container> */}
              <div className="container">
                <Contacts 
                  username={currentUser?.username} 
                  userProfilePicture={userProfilePicture} 
                  contacts={contacts} 
                  changeChat={handleChatChange} />

                {currentChat === undefined ? (
                  
                    <Welcome />
                  ) : (
                    
                    <ChatContainer 
                      currentUser={currentUser}
                      currentChat={currentChat} 
                      socket={socket} />
                  )}        
                  </div>


            </main>
        </div>
      )}
    </>

)
}
