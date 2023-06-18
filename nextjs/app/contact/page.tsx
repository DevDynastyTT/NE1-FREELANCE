'use client'

import GlobalNavbar from "@components/GlobalNavbar";
import GlobalFooter from "@components/GlobalFooter"
import "@styles/contact/contact.css";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { sendEmailRoute } from "@utils/APIRoutes";
import { User } from "@utils/interfaces";
import axios from "axios";
export default function Contact() {
    const [name, setName] = useState<string>();
    const [userEmail, setUserEmail] = useState<string>();
    const [message, setMessage] = useState<string>();
    const [isLoading, setIsLoading] = useState(false)
    const [currentUser, setCurrentUser] = useState<User>()
  async function handleContact(event: FormEvent){
    event.preventDefault();
  
    setIsLoading(true)
    
    const response = await axios.post(sendEmailRoute, {name, userEmail, message})
      const data = response.data
      if(data.error){
        console.log(data.error)
        alert(data.error)
        return
      }

      setIsLoading(false)
      alert(data.message)
    
  };
  

  return (
    <>
      <GlobalNavbar currentUser={currentUser} setCurrentUser={setCurrentUser}/>
      <main className="contact-main-container">
        <section className="contact-section">
          {/*Left contact page*/}
          <div className="direct-contact-container">
            <h1 className="section-header">Contact</h1>

              <ul className="contact-list">
                <li className="list-item">
                  <i className="fa fa-map-marker fa-2x"></i>
                  <span className="contact-text place">Port of Spain</span>
                </li>
                <li className="list-item">
                  <i className="fa fa-phone fa-2x"></i>
                  <span className="contact-text phone">
                      <Link href="tel:1-212-555-5555" title="Give me a call" />
                      (868) 738-8075
                    </span>
                </li>
                <li className="list-item">
                  <i className="fa fa-envelope fa-2x"></i>
                  <span className="contact-text gmail">
                      <Link href="mailto:868drgnstudio@gmail.com" title="Send me an email" className="email-link">
                      868drgnstudio@gmail.com</Link>
                    </span>
                </li>
              </ul>
              <ul className="social-media-list">
                <li className="list-item">
                  <Link href="#" className="contact-icon" />
                  <i className="fa fa-github" aria-hidden="true"></i>
                  <span>GitHub</span>
                </li>
              </ul>
           
            </div>

          {/* Right contact page  */}
          <div className="contact-wrapper">
            <form
              id="contact-form"
              className="form-horizontal"
              role="form"
              onSubmit={handleContact}>
                  <input type="text" className="form-control" id="name" placeholder="Name:" name="name"  required 
                  onChange={(event) => setName(event.target.value)}/>
                  <input type="email" className="form-control" id="email" placeholder="Email:" name="email" required
                    onChange={(event) => setUserEmail(event.target.value)}
                  />
              <textarea
                className="form-control" rows={5} placeholder="Message:" name="message" required
                onChange={(event) => setMessage(event.target.value)}
              />

              <button 
                className="btn btn-primary send-button" 
                id="submit" 
                type="submit">
                {isLoading ? (<div className="spinner" id="spinner"></div>) :
                (
                  <div className="alt-send-button">
                  <i className="fa fa-paper-plane"></i>
                  <span className="send-text">SEND</span>
                  </div>
                )}
              </button>
            </form>
          </div>
        </section>
      </main>
      <GlobalFooter />
    </>
  );
}
