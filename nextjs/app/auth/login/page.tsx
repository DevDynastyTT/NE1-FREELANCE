'use client'

import '@styles/members/members.css'
import GlobalNavbar from "@components/GlobalNavbar";
import { User } from "@utils/interfaces";
import { loginRoute } from "@utils/APIRoutes";
import Link from "next/link";
import { FormEvent, useState } from "react";
import axios from "axios";
export default function Login(){
    const [currentUser, setCurrentUser] = useState<User>()
    const [message, setMessage] = useState<String>()
    const [values, setValues] = useState({ email: "", password: "" });

    const handleChange = (event: FormEvent<HTMLInputElement>) => {
        setValues({ ...values, [event.currentTarget.name]: event.currentTarget.value });
      };
    
      const validateForm = () => {
        const { email, password } = values;
        
        if (email === "") {
          setMessage("Violation! Enter your email.")
          return false;
        } else if (password === "") {
          setMessage("Violation! Enter your password.")
          return false;
        }
        return true;
      };
    
      const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (validateForm()) {
          const { email, password } = values;
    
        try{
            const { data } = await axios.post(loginRoute, { email, password,}, {withCredentials: true});
            if (data.error) {
              console.error(data.error);
              setMessage(data.error)
              return
            }
            sessionStorage.setItem('user', JSON.stringify(data.user))
    
            window.location.href = "/jobs/search"
          }catch(error){
            console.log('Login Error\n', error)
            setMessage("Unfortunately our servers are down. Please try again later.")
          }
        }
      };

    return (
        <>
        <GlobalNavbar currentUser={currentUser} setCurrentUser={setCurrentUser}/>
        <br />
        <main className = "login-main-container">
                <form className="loginForm" onSubmit={(event) => handleSubmit(event)}>
                
                {message ? (
                  <div className="alert alert-warning alert-dismissible fade show" role="alert">
                        <strong>
                            <i className="fa-solid fa-triangle-exclamation"></i>
                            {message}
                        </strong>
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div> 
                ) : null
                }
                      
                <h1>Login</h1>
                {/* {% csrf_token %} */}

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email:</label>
                  <input type="email" className="form-control inputs" id="email" name = "email" placeholder="example@example.com"
                  onChange={e => handleChange(e)} required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password" className="form-control inputs" id="password" name = "password" placeholder="********"
                  onChange={e => handleChange(e)} required
                  />
                </div>

                <div className="col-12">
                  <p className="link">Need an Account?
                    <Link href='/auth/signup'>Signup</Link>
                  </p>
                </div>

                <div className="col-12">
                  <button className="btn btn-primary submit-btn" type="submit">Login</button>
                </div>


              </form> {/* End Form */}
              </main> 
        </>
    )
}