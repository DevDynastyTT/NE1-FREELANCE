'use client'

import GlobalNavbar from "@components/GlobalNavbar"
import { faArrowLeftLong, faPaperclip } from "@fortawesome/free-solid-svg-icons"
import { faCircle, faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { getUserSession } from "@utils/reuseableCode"
import { MessagesType, SessionType } from "@utils/types"
import { useParams, useRouter } from "next/navigation"
import { FormEvent, useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import { getReceiver, receiveMessageRoute, searchUsers, sendMessageRoute } from '@utils/APIRoutes'
import axios from 'axios'

const server = process.env.NODE_ENV === "development" ? "http://localhost:3002" : "https://ne1freelance.onrender.com";
const socket = io(server);
export default function ChatComponent() {
    const {id: receiverID} = useParams()
    const chatContainerRef = useRef<HTMLDivElement>(null);

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
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true)

    function setOnlineUser(userSession:SessionType){ socket.emit('online-users', {userreceiverID: userSession?._id}) }
    function sendTypingAlert(){
      if(session?._id && receiverID)
        socket.emit('typing-alert', ({
          senderID: session._id, receiverID: receiverID
        }))
    }

    function handleOpenChat(currentUser: SessionType) {
        setReceivedMessages([]); 
        setReceiver(currentUser);
        setChatName(`${currentUser?.username}`);
        router.push(`/auth/inbox/${receiverID}`);
    }

    async function sendMessage(event: FormEvent<HTMLFormElement>){
      event.preventDefault()
      const body = {
        sender: session?.username, 
        receiver: receiver?.username, 
        senderID: session?._id,
        receiverID: receiverID,
        content: message
      }
      //If user if logged in and selected a person to chat with, send the message
          try{
              const response = await axios.post(sendMessageRoute, body)
              const data = response.data
              
              if(response.status !== 200){
                console.error(data.error);
                return
              }
              socket.emit('send-message', {
                message, 
                sender: session?._id,
                receiver: receiverID,
                senderID: session?._id,
                receiverID: receiverID,
              })

              const receivedMessage = {
                content: message,
                sender: session?.username,
                receiver: receiver?.username,
                isSender: true,
                sentAt: new Date().toISOString(),
              };
              
              //Append the new messages to the current messages array
              setReceivedMessages((prevMessages:any) => [
                ...prevMessages,
                receivedMessage,
              ]);

          }catch(error){
            alert('Server down')
            console.error(error)
          }finally{
            // Clear the input field
            setMessage("");
          }
    }
    

    async function fetchAllMessages() {
      try {
        if (receiverID) { // Check if the receiver state is defined
          const response = await axios.get(
            `${receiveMessageRoute}/${session?._id}/${receiverID}`
          );
    
          const data = response.data;
          if (response.status !== 200) {
            console.error(data.error);
            return;
          }
          console.log(data.messages)
          const messages = data.messages.map((message: any) => ({
            content: message.content,
            sender: message.sender,
            receiver: message.receiver,
            isSender: message.senderID === session?._id,
            sentAt: message.sentAt
          }));
    
          setReceivedMessages((prevMessages: any) => [
            ...prevMessages,
            ...messages
          ]);

          setIsLoading(false);

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

    async function fetchReceiver(){
      try{
          const response = await axios.get(`${getReceiver}/${receiverID}`)
          const data = response.data
          if(response.status !== 200){
              console.error(data.error);
              return
          }

          console.log(data.receiver)
          setReceiver(data.receiver)
      }catch(error){
        console.log(error)
      }
    }

    async function authenticateMessages(){
        await fetchReceiver()  
        await fetchAllMessages();

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
          if (data.isTyping && receiverID) setIsTyping(true);
          else if(!data.isTyping && receiverID) setIsTyping(false);
        });
    }

    useEffect(() => {
      if (session && receiverID) authenticateMessages()
      return () => { socket.disconnect() }
    }, [session, receiverID]);
  
    useEffect(() => {
      if (chatContainerRef.current) 
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      
    }, [receivedMessages]);
    


    useEffect(() => {
        const isAuthenticated = getUserSession();

        //User authentication 
        if (isAuthenticated?._id) {
          setSession(isAuthenticated); //Assign user information to session
        }else{
          router.push('/auth/login')
        }    
    }, [])

    if(isLoading) return <div>Loading...</div>
    

    return (
        <>
            <GlobalNavbar session={session}/>

            <nav className="chat-navigation">
                <div className='back-arrow-container'>
                    <FontAwesomeIcon 
                        className='back-arrow'
                        icon={faArrowLeftLong} 
                        onClick={() => router.back()} 
                    />
                </div>
                

                <div className="userInfoContainer">
                    <FontAwesomeIcon className='active-status'icon={faCircle} />
                    <span className="username">{receiver?.username}</span>
                </div>
            </nav>

            <main className="chat-main-container">
                <div className="chat-box" ref={chatContainerRef}>
                    {receivedMessages?.map((msg: any, index: any) => (
                    <div 
                      className="message-container" 
                      key={index}
                      style={{justifyContent: msg.isSender ? "flex-end" : "flex-start",}}>
                      
                      <div
                        className="message"
                        style={{
                            background: msg.isSender ? "#00bfff" : "#f5f5f5",
                            color: msg.isSender ? "#fff" : "#000",
                        }}> {msg.content}
                      </div>
                    </div>
                    ))}

                    <div ref={messagesEndRef} />
                </div>

                <br/>

                <form className="message-form" onSubmit={sendMessage} >
                  <input
                    className="message-input"
                    type="text"
                    value={message}
                    placeholder="Enter a message"
                    required
                    onChange={(e) => {
                      setMessage(e.target.value)
                      sendTypingAlert()
                    }}
                  />

                  <button className="file-upload-btn btn" type="submit">
                    <FontAwesomeIcon className="icon" icon={faPaperclip} />                  
                  </button>

                  <button className="send-btn btn" type="submit">
                    <FontAwesomeIcon className="icon" icon={faPaperPlane} />
                  </button>
                </form>
            </main>
        </>
    )
}
