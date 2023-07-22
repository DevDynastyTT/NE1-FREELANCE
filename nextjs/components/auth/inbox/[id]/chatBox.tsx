import { faPaperPlane, faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { sendMessageRoute } from '@utils/APIRoutes';
import axios from 'axios';
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import MessageForm from './messageForm';

export default function ChatBox(props:any) {
    const [message, setMessage] = useState<string>("");
    const chatContainerRef = useRef<HTMLDivElement>(null);

    function sendTypingAlert(){
        if(props.session?._id && props.receiver._id)
          props.socket.emit('typing-alert', ({
            senderID: props.session._id, receiverID: props.receiver._id
          }))
      }

      useEffect(() => {
        if (chatContainerRef.current) 
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        
      }, [props.receivedMessages]);
    
  return (
    <main className="chat-main-container">
                <div className="chat-box" ref={chatContainerRef}>
                    {props.receivedMessages?.map((msg: any, index: any) => (
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

                    <div ref={props.messagesEndRef} />
                </div>

                <br/>

                <MessageForm 
                    setMessage={setMessage}
                    receivedMessage={props.receivedMessage}
                    setReceivedMessages={props.setReceivedMessages}
                    sendTypingAlert={sendTypingAlert}
                    message={message}
                    chatContainerRef={props.chatContainerRef}
                    session={props.session}
                    receiver={props.receiver}
                    socket={props.socket}
                />
            </main>
  )
}
