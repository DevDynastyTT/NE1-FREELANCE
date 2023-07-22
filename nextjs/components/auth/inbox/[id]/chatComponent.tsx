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
import ChatNavigationComponent from "./chatNavigationComponent"
import ChatBox from "./chatBox"

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

    function setOnlineUser(userSession:SessionType){ socket.emit('online-users', {userreceiverID: userSession?._id}) }

    function handleOpenChat(currentUser: SessionType) {
        setReceivedMessages([]); 
        setReceiver(currentUser);
        setChatName(`${currentUser?.username}`);
        router.push(`/auth/inbox/${receiverID}`);
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
        const isAuthenticated = getUserSession();

        //User authentication 
        if (isAuthenticated?._id) {
          setSession(isAuthenticated); //Assign user information to session
        }else{
          router.push('/auth/login')
        }    
    }, [])

    if(isLoading) return <div>Loading...</div>
    
    if (isLoading === false && session?.isStaff === false) return <p>Under Maintenance, Coming Back Soon...</p>;
   


    return (
        <>
            <GlobalNavbar session={session}/>

            <ChatNavigationComponent router={router} receiverUsername={receiver?.username}/>

            <ChatBox 
              socket={socket} session={session} receiver={receiver}
              setReceivedMessages={setReceivedMessages}
              receivedMessages={receivedMessages} messagesEndRef={messagesEndRef}
            />
            
        </>
    )
}
