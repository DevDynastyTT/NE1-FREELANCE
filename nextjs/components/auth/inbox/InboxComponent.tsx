'use client'

import '@styles/inbox/inbox.css'
import GlobalNavbar from "@components/GlobalNavbar";
import { getAllUserInfo, receiveMessageRoute, sendMessageRoute, searchUsers } from "@utils/APIRoutes";
import { getUserSession } from "@utils/reuseableCode";
import { MessagesType, SessionType } from "@utils/types";
import axios from "axios";
import { FormEvent, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-regular-svg-icons'
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import io from "socket.io-client";
import {useRouter} from 'next/navigation';

const server = process.env.NODE_ENV === "development" ? "http://localhost:3002" : "https://ne1freelance.onrender.com";
const socket = io(server);


export default function InboxComponent() {
    
    const router = useRouter()

    const [session, setSession] = useState<SessionType>()
    const [receiver, setReceiver] = useState<SessionType>()
    const [users, setUsers] = useState<SessionType[]>([])

    const [message, setMessage] = useState<string>("");
    const [chatName, setChatName] = useState<string>();
    
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>("")
    const [receivedMessages, setReceivedMessages] = useState<MessagesType[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(true);
   
    function setOnlineUser(userSession:SessionType){ socket.emit('online-users', {userID: userSession?._id}) }
    function sendTypingAlert(){
      if(session?._id && receiver?._id)
        socket.emit('typing-alert', ({
          senderID: session._id, receiverID: receiver._id
        }))
    }

    function handleOpenChat(currentUser: SessionType) {
        setReceivedMessages([]); 
        setReceiver(currentUser);
        setChatName(`${currentUser?.username}`);
        router.push(`/inbox/${currentUser?._id}`);
    }
    function handleEmit() {
      const isAuthenticated = getUserSession();

      //User authentication 
      if (isAuthenticated?._id) {
        setSession(isAuthenticated); //Assign user information to session
        setOnlineUser(isAuthenticated); //Send an online-emit event to tell all users that the user is online
      } 

      setIsLoading(false);

    }
   
    async function sendMessage (event: FormEvent<HTMLFormElement>) {
      event.preventDefault()
      //If user if logged in and selected a person to chat with, send the message
      if(session && session?._id && receiver && receiver?._id){
          try{
              const response = await axios.post(sendMessageRoute, {
                sender: session?.username, 
                receiver: receiver?.username, 
                senderID: session?._id,
                receiverID: receiver?._id,
                content: message
              })
              const data = response.data
              
              if(response.status !== 200){
                console.error(data.error);
                return
              }
              socket.emit('send-message', {
                message, 
                sender: session._id,
                receiver: receiver._id,
                senderID: session._id,
                receiverID: receiver._id,
              })


              const receivedMessage = {
                content: message,
                sender: session?.username,
                receiver: receiver?.username,
                isSender: true,
                sentAt: new Date().toISOString(),
              };
              
              //Append the new messages to the current messages array
              setReceivedMessages((prevMessages) => [
                ...prevMessages,
                receivedMessage,
              ]);

          }catch(error){
            alert('Server down')
            console.error(error)
          }
          // Clear the input field
          setMessage("");
          
      }
      else alert('Login to send-messages or select user')
    
    }

    async function fetchAllMessages(isAuthenticated: SessionType, currentReceiver: SessionType) {
      try {
        if (currentReceiver) { // Check if the receiver state is defined
          const response = await axios.get(
            `${receiveMessageRoute}/${isAuthenticated?._id}/${currentReceiver._id}`
          );
    
          const data = response.data;
          if (response.status !== 200) {
            console.error(data.error);
            return;
          }
    
          const messages = data.messages.map((message: any) => ({
            content: message.content,
            sender: message.sender,
            receiver: message.receiver,
            isSender: message.senderID === isAuthenticated?._id,
            sentAt: message.sentAt
          }));
    
          setReceivedMessages((prevMessages: any) => [
            ...prevMessages,
            ...messages
          ]);
        }
      } catch (error) {
        console.error(error);
      }
    }

    async function handleSearchUsers(event: FormEvent<HTMLInputElement>) {
      setKeyword(event.currentTarget.value)
      try {
        const response = await axios.get(`${searchUsers}/${keyword}`);
        const data = response.data;
        if (response.status !== 200) {
          console.error(data.error);
          return;
        }
        setUsers(data.userInfo);
      } catch (error) {
        console.error(error);
      }
    }

    useEffect(() => {
      handleEmit()
    
      return () => {
        socket.disconnect()
      }
    }, [])
    
    useEffect(() => {
      if (session && receiver) {
        fetchAllMessages(session, receiver);

        
        socket.on("receive-message", (data) => {
            setIsTyping(false)
              const { newMessage, sender } = data;
              const receivedMessage = {
                content: newMessage,
                sender: sender,
                receiver: session?.username || '',
                isSender: false,
                sentAt: new Date().toISOString(),
              };
              
              //Append the new messages to the current messages array
              setReceivedMessages((prevMessages) => [
                ...prevMessages,
                receivedMessage,
              ]);
        });


        socket.on('receive-typing-alert', (data) => {
          if (data.isTyping && receiver?._id) setIsTyping(true);
          else if(!data.isTyping && receiver?._id) setIsTyping(false);
        });
      }
    }, [session, receiver]);
  
    useEffect(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end'  });
      }
    }, [receivedMessages]);

    if(isLoading) return <div>Loading...</div>
    
    if (isLoading === false && session?.isStaff === false) return <p>Under Maintenance, Coming Back Soon...</p>;
   
   
    return (
          <>
            {session && session?._id && (
              <>
                <GlobalNavbar session={session} />

                <div className="inbox-container">
                  <form className='search-form'>
                    <input
                        className='search-input'
                        type="text"
                        placeholder="Search for users"
                        onChange={handleSearchUsers}
                      />

                      
                  </form>

                  

                  <main className='inbox-main-container'>
                        
                    {users?.length > 0 && keyword?.length > 0 && (
                        <ul className={`user-dropdown ${isMenuOpen ? '' : 'closed'}`}>
                          <li className='close-button-list'>
                            <FontAwesomeIcon 
                              className='close-button'
                              onClick={() => setIsMenuOpen(false)}
                              icon={faCircleXmark} 
                              />
                          </li>
                          {users?.map((currentUser, currentIndex) =>
                            currentUser._id !== session?._id ? (
                              <li
                                key={currentIndex}
                                style={{ cursor: "pointer" }}
                                onClick={() => handleOpenChat(currentUser)}
                              >
                                {currentUser.username} 
                                {currentUser.isActive && <FontAwesomeIcon 
                                  style={{ 
                                    color: "rgb(0, 255, 0)", 
                                    backgroundColor: "rgb(0, 255, 0)", 
                                    borderRadius: "50%",
                                    fontSize: ".7rem",
                                    margin: "0 0 0 5px",
                                  }}
                                  icon={faCircle} 
                                /> }
                              </li>
                            ) : null
                          )}
                        </ul>
                      )}

                      <ul className='contacts'>
                        <li>User Chat 1</li>
                        <li>User Chat 2</li>
                        <li>User Chat 3</li>
                        <li>User Chat 4</li>
                        <li>User Chat 5</li>
                      </ul>
                  </main>
                </div>
                


              </>
            )}
          </>
    );
  }

  /*
<div>
                  <div>
                    <div style={{ marginLeft: "8%", height: "50px"}}>
                      <span style={{fontSize: '2rem'}}>
                        {chatName}
                        {receiver?.isActive && <FontAwesomeIcon 
                                  style={{ 
                                    color: "rgb(0, 255, 0)", 
                                    backgroundColor: "rgb(0, 255, 0)", 
                                    borderRadius: "50%",
                                    fontSize: ".7rem",
                                    margin: "0 0 0 5px",
                                  }}
                                  icon={faCircle} />
                        }
                        </span>
                      
                      {isTyping && <span style={{color: 'grey'}}>typing...</span>}
                    </div>

                    <div
                      style={{
                        border: "1px solid black",
                        height: "40vh",
                        overflowY: "scroll",
                        padding: "3%",
                        margin: "0 auto",
                        width: "80%",
                      }}
                    >
                      {receivedMessages?.map((msg: any, index: any) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: msg.isSender ? "flex-end" : "flex-start",
                            marginBottom: "10px",
                          }}
                        >
                          <div
                            style={{
                              background: msg.isSender ? "#00bfff" : "#f5f5f5",
                              color: msg.isSender ? "#fff" : "#000",
                              borderRadius: "5px",
                              padding: "5px 10px",
                            }}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={sendMessage} style={{ marginLeft: "10%" }}>
                      <input
                        type="text"
                        value={message}
                        placeholder="Enter a message"
                        required
                        onChange={(e) => {
                          setMessage(e.target.value)
                          sendTypingAlert()
                        }}
                      />
                      <button type="submit">Send Message</button>
                    </form>
                  </div>

                  <form style={{ marginLeft: "3%", marginTop: "5%" }}>
                      <input
                        type="text"
                        name="keyword"
                        placeholder="Search for user"
                        required
                        onChange={handleSearchUsers} // Add onChange event listener
                        />
                    </form>

                    {users?.length > 0 && keyword?.length > 0 && (
                      <div>
                        <ul>
                          {users?.map((currentUser, currentIndex) =>
                            currentUser._id !== session?._id ? (
                              <li
                                key={currentIndex}
                                style={{ cursor: "pointer" }}
                                onClick={() => handleOpenChat(currentUser)}
                              >
                                {currentUser.username} 
                                {currentUser.isActive && <FontAwesomeIcon 
                                  style={{ 
                                    color: "rgb(0, 255, 0)", 
                                    backgroundColor: "rgb(0, 255, 0)", 
                                    borderRadius: "50%",
                                    fontSize: ".7rem",
                                    margin: "0 0 0 5px",
                                  }}
                                  icon={faCircle} 
                                /> }
                              </li>
                            ) : null
                          )}
                        </ul>
                      </div>
                    )}
                </div> 
  */
  