import '../../../../static/css/members/chat/chat.css'
import React, { useEffect, useState, useRef } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { io } from "socket.io-client"
import styled from "styled-components"
import { allUsersRoute, currentSellerRoute, host } from "../../../utils/APIRoutes"
import ChatContainer from "../components/ChatContainer"
import Contacts from "../components/Contacts"
import Welcome from "../components/Welcome";
import GlobalNavBar from "../../../GlobalNavbar"


export default function Chat() {
  const navigate = useNavigate()
  const socket = useRef()
  const [contacts, setContacts] = useState([])
  const [currentChat, setCurrentChat] = useState(undefined)
  const [currentUser, setCurrentUser] = useState(undefined)
  const { seller_id } = useParams()


  console.log(seller_id)

  useEffect(() => {
    function fetchData() {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        alert('Please login to view this page')
        navigate("/members/login")
        return
      } 

      console.log('User has authToken')
      const user = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
      console.log('User:', user)
      setCurrentUser(user)

    }
    fetchData()
  }, [])
  

  useEffect(() => {
    if (currentUser) {
      console.log('Checking socket')
      socket.current = io(host)
      socket.current.emit("add-user", currentUser._id)
      console.log('Socket checked successfully')
      console.log('Current user changed:', currentUser)
        
      async function fetchData() {
        /*
        create a route that will get the user with that id
          send the seller id to the database
        */
        const response = await axios.get(`${allUsersRoute}/${currentUser._id}`)
        const data = response.data
        console.log('Contacts data:', data.users)
        // If there is a seller_id in the URL, filter contacts to get the contact with the seller_id
        const filteredContacts = seller_id ? data.users.filter((contact) => contact._id === seller_id) : data.users
        setContacts(filteredContacts) //Array of user objects
      }
      fetchData()
    }
  }, [currentUser, seller_id])
  
  
  const handleChatChange = (chat) => {
    setCurrentChat(chat)
  }

  return (
    <>
      <GlobalNavBar/>
      <br />
      <main className="chat-main-container">

      {/* <Container> */}
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          <Welcome />
        </div>


    </main>
    </>

  )
}
// {currentChat === undefined ? (
            
//   <Welcome />
// ) : (
  
//   <ChatContainer currentChat={currentChat} socket={socket} />
// )}