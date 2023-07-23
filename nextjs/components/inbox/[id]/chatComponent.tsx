'use client'

import GlobalNavbar from "@components/GlobalNavbar"
import { getUserSession } from "@utils/reuseableCode"
import { MessagesType, SessionType } from "@utils/types"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { getReceiver, receiveMessageRoute } from '@utils/APIRoutes'
import axios from 'axios'
import ChatNavigationComponent from "./chatNavigationComponent"
import ChatBox from "./chatBox"
import io from "socket.io-client"

const server = process.env.NODE_ENV === "development" ? "http://localhost:3002" : "https://ne1freelance.onrender.com";
const socket = io(server);
export default function ChatComponent() {
    const {id: receiverID} = useParams()

    const router = useRouter()
    const [session, setSession] = useState<SessionType>()
    const [receiver, setReceiver] = useState<SessionType>()
    const [users, setUsers] = useState<SessionType[]>([])

    const [chatName, setChatName] = useState<string>();
    
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>("")
    const [receivedMessages, setReceivedMessages] = useState<MessagesType[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true)

    function setOnlineUser(userSession:SessionType){ socket.emit('online-users', {userID: userSession?._id}) }

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
      } catch (error:any) {
        console.error(error.message);
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

          setReceiver(data.receiver)
      }catch(error){
        console.log(error)
      }
    }

    async function authenticateMessages(userSession:SessionType){
        setOnlineUser(userSession)
        await fetchReceiver()  
        await fetchAllMessages();

    }

    useEffect(() => {
      if (session && receiverID) authenticateMessages(session)
    }, [session, receiverID]);
  
    
    


    useEffect(() => {
        const isAuthenticated = getUserSession();

        //User authentication 
        if (isAuthenticated?._id) {
          setSession(isAuthenticated); //Assign user information to session
         
      
        }else{
          router.push('/auth/login')
        }  
        
        return () => { socket.disconnect() }
        
    }, [])

    useEffect(() => {
      socket.on('receive-message', (data: any) => {
        const { senderID, newMessage, file } = data;
        // Append the new message to the current messages array
        setReceivedMessages((prevMessages: any) => [
          ...prevMessages,
          {
            content: newMessage,
            sender: receiver?.username, // The sender is the receiver in this case
            receiver: session?.username,
            isSender: false,
            sentAt: new Date().toISOString(),
            file: file, // Pass the file data to the received message object
          },
        ]);
      });
  
      return () => {
        socket.off('receive-message'); // Cleanup the event listener
      };
    }, [receiver?.username, session?.username]);
  
    if(isLoading) return <div>Loading...</div>
    
    if (isLoading === false && session?.isStaff === false) return <p>Under Maintenance, Coming Back Soon...</p>;
   


    return (
        <>
            <GlobalNavbar session={session}/>

            <ChatNavigationComponent router={router} receiverUsername={receiver?.username}/>

            <ChatBox 
              session={session} receiver={receiver}
              setReceivedMessages={setReceivedMessages}
              receivedMessages={receivedMessages} messagesEndRef={messagesEndRef}
            />
            
        </>
    )
}