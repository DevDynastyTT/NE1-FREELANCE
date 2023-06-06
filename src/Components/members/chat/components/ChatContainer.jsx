import '../../../../static/css/members/chat/chatContainer.css'

import React, { useState, useEffect, useRef } from "react";
import {useNavigate} from 'react-router-dom'
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import { sendMessageRoute, receiveMessageRoute } from "../../../utils/APIRoutes";
import { FaFileAlt  } from 'react-icons/fa'; // Assuming you want to use the FileText icon from FontAwesome

export default function ChatContainer({ currentUser, currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const navigate = useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.post(receiveMessageRoute, {
        from: currentUser._id,
        to: currentChat._id,
      });
      setMessages(response.data);
    };
  
    if (currentChat) {
      fetchData();
    }
  }, [currentChat]);
  
  useEffect(() => {
    const getCurrentChat = () => {
      if (currentChat) {
        const currentChatId = currentUser?._id;
        // do something with currentChatId
      }
    };
  
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg, event) => {
    event.preventDefault();

    
    if(!event.target.document.files[0] && !msg) return
    
    const msgs = [...messages];

    if (event.target.document.files[0]) {

      // Send the document to the server
      const formData = new FormData()
      formData.append('from', currentUser?._id)
      formData.append('to', currentChat._id)
      formData.append('message', msg)
      formData.append('document', event.target.document.files[0])
      // Send the document to the server
      await axios.post(sendMessageRoute, formData);
      // Send the message with the document URL
      socket.current.emit("send-msg", formData);
      msgs.push({ fromSelf: true, message: msg, document:  event.target.document.files[0].name});

    } 
    else {
      console.log('No documents');
      await axios.post(sendMessageRoute, {
        from: currentUser?._id,
        to: currentChat._id,
        message: msg,
      });
      // Send the message without a document
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: currentUser?._id,
        msg,
      });
    msgs.push({ fromSelf: true, message: msg, document:  ''});

    }
  
    setMessages(msgs);
  };

  const handleDownload = () => {
    const fileUrl = `${window.location.origin}/documents/${messages[0].document}`;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = messages[0].document;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  
  

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-receive", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log(messages)
  }, [messages]);

  return (
    <div className="chatContainer-main-container">
      <div className="chat-header">
        <div className="user-details">
            <div className="avatar">
            {currentChat.profile_picture !== undefined ? (
              <img src={`data:image/svg+xml;base64,${currentChat.profile_picture}`} alt=""
              />
            ):
              <img src={'http://localhost:3000/images/default.jpeg'} alt="defaultImage"/>  
            }
            </div>
              <div className="username">
                <h3
                onClick={()=> navigate('/members/checkout')}
                style={{cursor: 'pointer'}}
                >{currentChat.username}</h3>
              </div>

                <div className="call-user">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>

                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"/></svg>
              </div>
        </div>
        {/* <Logout /> */}
      </div>
      <div className="chat-messages">
      {messages.map((message) => {
        return (
          <div ref={scrollRef} key={uuidv4()} className="message-scroll">
            <div className={`message ${message.fromSelf ? 'sended' : 'received'}`}>
              <div className="content">
              
                {message.message && (<p>{message.message}</p>)}
                {message.document && (
                  <div className="document-icon">
                    <span className="documentName" onClick={handleDownload}>{message.document}</span>
                    <FaFileAlt  />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      </div>
      <ChatInput handleSendMsg={handleSendMsg}/>
      </div>
  )
}