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

const server = process.env.NODE_ENV === "development" ? "http://localhost:3002" : "https://ne1freelance.onrender.com"
const socket = io(server)
export default function ChatComponent() {
    const {id: receiverID} = useParams()

    const router = useRouter()
    const [session, setSession] = useState<SessionType>()
    const [receiver, setReceiver] = useState<SessionType>()

    const [receivedMessages, setReceivedMessages] = useState<MessagesType[]>([])
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isTyping, setIsTyping] = useState<boolean>(false)

    function setOnlineUser(userSession:SessionType){ socket.emit('online-users', {userID: userSession?._id}) }

    async function fetchAllMessages() {
      try {
        if (receiverID) { // Check if the receiver state is defined
          const response = await axios.get(
            `${receiveMessageRoute}/${session?._id}/${receiverID}`
          )
    
          const data = response.data
          if (response.status !== 200) {
            console.error(data.error)
            return
          }
          const messages = data.messages.map((message: any) => ({
            content: message.content,
            file: message.file,
            sender: message.sender,
            receiver: message.receiver,
            isSender: message.senderID === session?._id,
            sentAt: message.sentAt
          }))

          setReceivedMessages((prevMessages: any) => [
            ...prevMessages,
            ...messages
          ])

          setIsLoading(false)

        }
      } catch (error:any) {
        console.error(error.message)
      }
    }

    async function fetchReceiver(){
      try{
          const response = await axios.get(`${getReceiver}/${receiverID}`)
          const data = response.data
          if(response.status !== 200){
              console.error(data.error)
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
        await fetchAllMessages()

    }

    async function getSession():Promise<SessionType>{
        const response = await axios.get('api/auth/session')
        const data = response.data

        return data
    }

    useEffect(() => {
      if (session && receiverID) authenticateMessages(session)
    }, [session, receiverID])
  
    
    


    useEffect(() => {
        const isAuthenticated = getUserSession()
        // const isAuthenticated = getSession()

        //User authentication 
        if (isAuthenticated?._id) setSession(isAuthenticated) //Assign user information to session
        else router.push('/auth/login')
        
        return () => { socket.disconnect() }
        
    }, [])

    useEffect(() => {
      socket.on('receive-message', (data: any) => {
        const { senderID, newMessage, file } = data
        console.log(data)
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
        ])
      })

      socket.on('receive-typing-alert', (data:any) => {
        if (data.isTyping && data.receiverID) setIsTyping(true)
        else if(!data.isTyping && data.receiverID) setIsTyping(false)
      })

  
      return () => {
        socket.off('receive-message') // Cleanup the event listener
        socket.off('receive-typing-alert')
      }
    }, [receiver?.username, session?.username])
  
    if(isLoading) return <div>Loading...</div>
    
    // if (isLoading === false && session?.isStaff === false) return <p>Under Maintenance, Coming Back Soon...</p>
   


    return (
        <>
            <GlobalNavbar session={session}/>

            <ChatNavigationComponent 
              isTyping={isTyping}
              router={router} 
              receiverUsername={receiver?.username}/>

            <ChatBox 
              session={session} receiver={receiver}
              setReceivedMessages={setReceivedMessages}
              receivedMessages={receivedMessages} messagesEndRef={messagesEndRef}
            />
            
        </>
    )
}
