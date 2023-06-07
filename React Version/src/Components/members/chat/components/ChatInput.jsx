import '../../../../static/css/members/chat/chatInput.css'

import React, { useState, useRef } from "react";
import { BsEmojiSmileFill,BsPaperclip, BsEmojiLaughingFill   } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";

import styled from "styled-components";
import EmojiPicker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [fileText, setFileText] = useState()
  const fileInputRef = useRef(null);

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiObject) => {
    const newMessage = msg + emojiObject.emoji;
    setMsg(newMessage);
  };

  const handleEmojiMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleEmojiMouseLeave = () => {
    setIsHovered(false);
  };
  

  const sendChat = async (event) => {
    if (msg.length > 0 || event.target.document.files[0]) {

      await handleSendMsg(msg, event);
      setMsg("");

    }
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileText(file ? file.name : "");
  };

  return (
    <div className="chatInput-main-container">
      <div className="emoji-container">
        {showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} />}
      </div>

      <div className="button-container">
        <div className="emoji">  

          {/* Emoji smile icon */}
          {isHovered ? (
          <BsEmojiLaughingFill
            onClick={handleEmojiPickerhideShow}
            onMouseEnter={handleEmojiMouseEnter}
            onMouseLeave={handleEmojiMouseLeave}
          />
        ) : (
          <BsEmojiSmileFill
            onClick={handleEmojiPickerhideShow}
            onMouseEnter={handleEmojiMouseEnter}
            onMouseLeave={handleEmojiMouseLeave}
          />
        )}
        </div>
      </div>


      <form className="input-container" onSubmit={sendChat} encType='multipart/form-data'>
        <input
          type="text"
          placeholder="type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
          className='message-box'
        />
            <div className="attachment" >
              <label htmlFor="fileInput" className="paper-clip" onClick={handleFileClick}>
                <BsPaperclip />
              </label>
                <input
                  ref={fileInputRef}
                  className="custom-file-input file" 
                  id="inputGroupFile01"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  name="document"
                  onChange={handleFileChange}
                  />
                  {fileText && <div className="file-text">{fileText}</div>}

            </div>

        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </div>
  );
}
