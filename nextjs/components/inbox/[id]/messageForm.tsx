import { faPaperPlane, faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { sendMessageRoute } from '@utils/APIRoutes';
import { MessagesType } from '@utils/types';
import axios from 'axios';
import { FormEvent, MutableRefObject, useRef } from 'react';
import io from "socket.io-client"

const server = process.env.NODE_ENV === "development" ? "http://localhost:3002" : "https://ne1freelance.onrender.com";
const socket = io(server);
export default function MessageForm(props:any) {
    const fileInputRef = useRef<any>(null);

    function createFormData(fileInputRef:MutableRefObject<any>, props:any): FormData {
        const formData = new FormData()
        if (fileInputRef.current?.files[0]) formData.append('file', fileInputRef.current?.files[0]);
        formData.append('content', props.message)
        formData.append('sender', props.session.username)
        formData.append('receiver', props.receiver.username)
        formData.append('senderID', props.session._id)
        formData.append('receiverID', props.receiver._id)

        return formData
    }

    function createMessageData(data:any, props:any): MessagesType {
      const messageData:MessagesType = {
        content: props.message, 
        sender: props.session.username,
        receiver: props.receiver.username,
        senderID: props.session._id,
        receiverID: props.receiver._id,
        isSender: true,
        sentAt: new Date().toISOString()
      }

      if(data.newMessage.file) {
        messageData.file = {
          name: data.newMessage.file,
          url: data.newMessage.fileUrl
        }
      }

      return messageData
    }

    async function sendMessage(event:FormEvent){
      event.preventDefault()
      try{
        const formData = createFormData(fileInputRef, props)
        const response = await sendFormData(formData)
        const data = response.data
        const messageData = createMessageData(data, props)
        socket.emit('send-message', messageData)
        const receivedMessage = createReceivedMessage(messageData, props)
        props.setReceivedMessages((prevMessages:any) => [
          ...prevMessages,
          receivedMessage,
        ]);
        clearInputField(fileInputRef, props)
      }catch(error){
          console.error(error);
          alert('Failed to send message. Please try again later.');
        }finally{
          // Clear the input field
          props.setMessage("");
          fileInputRef.current.value = '';
        }
     
    }

    async function sendFormData(formData: FormData) {
      return await axios.post(sendMessageRoute, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, // Ensure the correct content type for FormData
      })
    }

    function createReceivedMessage(messageData: MessagesType, props: any): MessagesType {
      return {
        content: props.message,
        file: messageData.file,
        sender: props.session.username,
        receiver: props.receiver.username,
        isSender: true,
        sentAt: new Date().toISOString(),
      }
    }

    function clearInputField(fileInputRef: MutableRefObject<any>, props: any) {
      props.setMessage("");
      fileInputRef.current.value = '';
    }

    function sendTypingAlert(){
      if(props.session?._id && props.receiver._id)
        socket.emit('typing-alert', ({
          senderID: props.session._id, receiverID: props.receiver._id
        }))
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
            sendTypingAlert()
          }}
        />

        <button className="file-upload-btn btn" type="button">
          <input type="file" name="document" id="document" ref={fileInputRef} />
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
