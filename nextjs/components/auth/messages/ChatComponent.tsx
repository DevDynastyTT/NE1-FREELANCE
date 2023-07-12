'use client'

import GlobalNavbar from "@components/GlobalNavbar";
import { getAllUserInfo, receiveMessageRoute, sendMessageRoute } from "@utils/APIRoutes";
import { getUserSession } from "@utils/reuseableCode";
import { MessagesType, SessionType } from "@utils/types";
import axios from "axios";
import { FormEvent, useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const server = process.env.NODE_ENV === "development" ? "http://localhost:3002" : "https://ne1freelance.onrender.com";
const socket = io(server);


export default function ChatComponent() {

    const [session, setSession] = useState<SessionType>()
    const [receiver, setReceiver] = useState<SessionType>()
    const [users, setUsers] = useState<SessionType[]>([])

    const [message, setMessage] = useState<string>("");
    const [chatName, setChatName] = useState<string>();
    
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [receivedMessages, setReceivedMessages] = useState<MessagesType[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    
   
    function setOnlineUser(userSession:SessionType){ socket.emit('online-users', {userID: userSession?._id}) }
    function sendTypingAlert(){
      if(session && session?._id && receiver && receiver?._id){
        console.log('ur typing')
        socket.emit('typing-alert', ({senderID: session._id, receiverID: receiver._id}))
      }
    }
    async function fetchUserSession() {
      const userSession = await getUserSession();

      //User authentication 
      if (userSession && userSession?._id) {
        setSession(userSession); //Assign user information to session
        setOnlineUser(userSession); //Send an online-emit event to tell all users that the user is online
        await fetchAllUsers(); //Fetch all users to chat with

        //When user is sent a message, they will receive it
        socket.on("receive-message", (data) => {
          const { newMessage, sender } = data;
          const receivedMessage = {
            content: newMessage,
            sender: sender,
            receiver: userSession?.username || '',
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
          if(data.isTyping) {
            console.log('user typing to u')
            setIsTyping(true)
            setTimeout(() => {
              setIsTyping(false)
            }, 3000)
          }
        })
      } else {
        alert('Login to message');
      }
    }
    async function handleOpenChat(currentUser: SessionType) {

      //If user is logged in, allow them to open a chat
      if (session && session?._id) {
        setReceivedMessages([]); // Clear current chat messages
        setReceiver(currentUser);
        setChatName(`${currentUser?.username}`);
      }
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

    async function fetchAllMessages(userSession: SessionType, currentReceiver: SessionType) {
      try {
        if (currentReceiver) { // Check if the receiver state is defined
          const response = await axios.get(
            `${receiveMessageRoute}/${userSession?._id}/${currentReceiver._id}`
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
            isSender: message.senderID === userSession?._id,
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

    async function fetchAllUsers() {
      try {
        const response = await axios.get(`${getAllUserInfo}`);
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
      fetchUserSession()
    
      return () => {
        socket.disconnect()
      }
    }, [])
    
    

    useEffect(() => {
      if (session && receiver) fetchAllMessages(session, receiver);
    }, [session, receiver])
    
    useEffect(() => {
      if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [receivedMessages])
  
    return (
      <>
        {session && session?._id && (
          <>
            <GlobalNavbar session={session} />

            <div>
              <div>
                <div style={{ marginLeft: "8%", height: "50px"}}>
                  <span style={{fontSize: '2rem'}}>{chatName}</span>
                  <span style={{color: 'grey'}}>{isTyping === false ? '' : '  typing...'}</span>
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

              {users && users?.length > 0 && (
                <div>
                  <h3>Users</h3>
                  <span style={{color: 'red', fontSize: '2rem', marginLeft: '5%'}}>Click on a name to message</span>

                  <ul>
                    {users?.map((currentUser, currentIndex) =>
                      currentUser._id !== session?._id ? (
                        <li
                          key={currentIndex}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleOpenChat(currentUser)}
                        >
                          {currentUser.username}
                        </li>
                      ) : null
                    )}
                  </ul>
                </div>
              )}
            </div>

          </>
        )}
      </>
    );
  }