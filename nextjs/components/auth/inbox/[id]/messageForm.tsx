import { faPaperPlane, faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { sendMessageRoute } from '@utils/APIRoutes';
import axios from 'axios';
import { FormEvent, useEffect, useRef } from 'react';

export default function MessageForm(props:any) {
    const fileInputRef = useRef<any>(null);
  async function sendMessage(event:FormEvent){
    event.preventDefault()
   
    const formData = new FormData()
    formData.append('file', fileInputRef.current?.files[0])
    formData.append('content', props.message)
    formData.append('sender', props.session.username)
    formData.append('receiver', props.receiver.username)
    formData.append('senderID', props.session._id)
    formData.append('receiverID', props.receiver._id)
    // If user if logged in and selected a person to chat with, send the message
        try{
            const response = await axios.post(sendMessageRoute, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }, // Ensure the correct content type for FormData
            })
            const data = response.data
            
            if(response.status !== 200){
              console.error(data.error);
              return
            }
            props.socket.emit('send-message', {
              message: props.message, 
              sender: props.session?._id,
              receiver: props.receiverID,
              senderID: props.session?._id,
              receiverID: props.receiverID,
            })

            const receivedMessage = {
              content: props.message,
              sender: props.session?.username,
              receiver: props.receiver?.username,
              isSender: true,
              sentAt: new Date().toISOString(),
            };
            
            //Append the new messages to the current messages array
            props.setReceivedMessages((prevMessages:any) => [
              ...prevMessages,
              receivedMessage,
            ]);

        }catch(error){
          alert('Server down')
          console.error(error)
        }finally{
          // Clear the input field
          props.setMessage("");
        }
}
  
  return (
    <form className="message-form" onSubmit={sendMessage} encType='multipart/form-data' >
        <input
          className="message-input"
          type="text"        
          ref={fileInputRef}
          value={props.message}
          placeholder="Enter a message"
          // required
          onChange={(e) => {
            props.setMessage(e.target.value)
            props.sendTypingAlert()

          }}
        />

        <button className="file-upload-btn btn" type="button">
          <input type="file" name="document" id="document" 
            ref={fileInputRef}
            onChange={()=> {
              setTimeout(()=>{alert('File Processed')}, 3000)
            }}
          />
          <label htmlFor="document">
            <FontAwesomeIcon className="icon" icon={faPaperclip} />
          </label>
        </button>


        <button className="send-btn btn" type="submit">
          <FontAwesomeIcon className="icon" icon={faPaperPlane} />
        </button>
    </form>
  )
}