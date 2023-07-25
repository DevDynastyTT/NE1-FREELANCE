import { useEffect, useRef, useState } from 'react'
import MessageForm from './messageForm';
import Image from 'next/image'
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MessagesType } from '@utils/types';

export default function ChatBox(props:any) {
    const [message, setMessage] = useState<string>("");
    const chatContainerRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
        if (chatContainerRef.current) 
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        
      }, [props.receivedMessages]);


      function renderMedia(msg:MessagesType){
        return <div className={msg.isSender ? "file-sender" : "file-user"}>
        {(() => {
          const fileExtension = msg.file?.name?.split(".").pop()?.toLowerCase();

          if (
              fileExtension === "jpg" || fileExtension === "png" || 
              fileExtension === "jpeg" || fileExtension === "gif" || 
              fileExtension === "webp") {
            return (
              <>
              <Image
                src={msg.file?.url ?? ""}
                alt={msg.file?.name ?? ""}
                width={200}
                height={200}
                unoptimized
              />
              <br/>
              <a style={{color: "#fff", backgroundColor: "transparent"}} href={msg.file?.url ?? ""} download={msg.file?.name ?? ""}>
                <FontAwesomeIcon icon={faDownload} />
              </a>
            </>
            );
          } else if (fileExtension === "mp4") {
            return (
              <video controls width={200} height={200}>
                <source src={msg.file?.url ?? ""} type="video/mp4" />
              </video>
            );
          } else if (fileExtension === "mp3") {
            return (
              <audio controls>
                <source src={msg.file?.url ?? ""} type="audio/mp3" />
              </audio>
            );
          } else {
            // handle other file types or display a default fallback
            return (
              <div>
                Unsupported file type: {fileExtension}
              </div>
            );
          }
        })()}
      </div>
      }

    
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

                        {msg.file && renderMedia(msg)}

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
                    message={message}
                    chatContainerRef={props.chatContainerRef}
                    session={props.session}
                    receiver={props.receiver}
                />
            </main>
  )
}
