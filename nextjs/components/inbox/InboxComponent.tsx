'use client'

import '@styles/inbox/inbox.css'
import GlobalNavbar from "@components/GlobalNavbar";
import { getRecentChats, searchUsers } from "@utils/APIRoutes";
import { getUserSession } from "@utils/reuseableCode";
import { MessagesType, RecentChatsType, SessionType } from "@utils/types";
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
    const [users, setUsers] = useState<SessionType[]>([])

    const [recentChats, setRecentChats] = useState<RecentChatsType[]>([]);
    const [newMessage, setNewMessage] = useState<string>('')
    const [keyword, setKeyword] = useState<string>("")
    const [isLoading, setIsLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(true);
   
    function setOnlineUser(userSession:SessionType){ socket.emit('online-users', {userID: userSession?._id}) }
 
    async function handleEmit() {
      const isAuthenticated = getUserSession();

      //User authentication 
      if (isAuthenticated?._id) {
        setSession(isAuthenticated); //Assign user information to session
        setOnlineUser(isAuthenticated); //Send an online-emit event to tell all users that the user is online
        await fetchRecentChats(isAuthenticated?._id)

        socket.on('receive-message', async (data)=> {
          setNewMessage(data.newMessage)
          await fetchRecentChats(isAuthenticated?._id)
        })
      } 

      setIsLoading(false);

    }

    async function handleSearchUsers(event: FormEvent<HTMLInputElement>) {
      setKeyword(event.currentTarget.value)
      try {
        const response = await axios.get(`${searchUsers}/${event.currentTarget.value}`);
        const data = response.data;
        setUsers(data.userInfo);
      } catch (error:any) {
        console.error(error);
      }
    }

    async function fetchRecentChats(userID: string) {
      try {
        const response = await axios.get(`${getRecentChats}/${userID}`);
        const data = response.data;
        console.log(data)
        // For each recent chat, find the most recent message and store its timestamp
        const chatsWithTimestamp = await Promise.all(
          data.recentChats.map(async (chat:any) => {
            try {
              const chatResponse = await axios.get(`${getRecentChats}/${chat.userID}`);
              const chatData = chatResponse.data;
              const mostRecentMessage = chatData.receivedMessages[0]; // Assuming receivedMessages is sorted by sentAt timestamp
              return { ...chat, sentAt: mostRecentMessage?.sentAt };
            } catch (error) {
              console.error(error);
              return chat;
            }
          })
        );
    
        setRecentChats(chatsWithTimestamp);
      } catch (error) {
        console.error(error, "Failed to fetch recent chats");
      }
    }
    

    useEffect(() => {
      handleEmit()
    
      return () => {
        socket.disconnect()
      }
    }, [])
    
    if(isLoading) return <div>Loading...</div>
    
    // if (isLoading === false && session?.isStaff === false) return <p>Under Maintenance, Coming Back Soon...</p>;
   
   
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

                        {/* Display the users on search  */}
                    {users?.length > 0  && (
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
                                onClick={()=> router.push(`/inbox/${currentUser._id}`)}
                                style={{ cursor: "pointer" }}
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

                     {/* Display the recent chats */}
                     {recentChats.length > 0 ? (
                      <>
                        <ul className='contacts'>
                        {recentChats.map((chat, index) => (
                          // Check if the username is different from the session's username
                          chat.username !== session?.username && (
                            <li
                              key={index} 
                              className="recent-chat"
                              onClick={() => router.push(`/inbox/${chat?.userID}`)}
                            >
                              <span>{chat?.username}</span> 
                              <span className="message">{chat.newMessage}</span>
                            </li>
                          )
                        ))}
                      </ul>

                        <br/>
                        <p style={{textAlign: "center"}}>Recent Chats</p>
                      </>
                    ) : (
                      <div style={{ margin: '25% auto', textAlign: "center" }}>
                        You have no recent chats...
                      </div>
                    )}


                  </main>
                </div>
                


              </>
            )}
          </>
    );
  }

