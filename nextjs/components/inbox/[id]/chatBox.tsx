import { FormEvent, useEffect, useRef, useState } from 'react'
import MessageForm from './messageForm';
import io from "socket.io-client"

const server = process.env.NODE_ENV === "development" ? "http://localhost:3002" : "https://ne1freelance.onrender.com";
const socket = io(server);
export default function ChatBox(props:any) {
    const [message, setMessage] = useState<string>("");
    const chatContainerRef = useRef<HTMLDivElement>(null);

    function sendTypingAlert(){
        if(props.session?._id && props.receiver._id)
          socket.emit('typing-alert', ({
            senderID: props.session._id, receiverID: props.receiver._id
          }))
      }

      useEffect(() => {
        if (chatContainerRef.current) 
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        
      }, [props.receivedMessages]);

       // Listener to handle received messages (including files) from WebSocket
  

    
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

                        {msg.file && 
                            <div className={msg.isSender ? "file-sender" : "file-user"}>
                                <a href={msg.file.url} target="_blank" download>
                                {msg.file.name}
                              </a>
                            </div>
                        }
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
                />
            </main>
  )
}
