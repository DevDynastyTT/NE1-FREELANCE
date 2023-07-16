'use client'
import { SessionType } from '@utils/types';
import { signupRoute } from "@utils/APIRoutes";

import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GlobalNavbar from '@components/GlobalNavbar'
import { useState, useEffect, FormEvent } from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { getUserSession } from '@utils/reuseableCode';

type valuesType = {
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
}

export default function Signup(){
  const router:AppRouterInstance = useRouter()
  
  const [message, setMessage] = useState<string>();
  const [session, setSession] = useState<SessionType>()
  const [values, setValues] = useState<valuesType>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  
    const handleChange = (event: FormEvent<HTMLInputElement>) => {
      setValues({ ...values, [event.currentTarget.name]: event.currentTarget.value });
    };
  
    const handleValidation = () => {
      const { password, confirmPassword, username, email } = values;
      if(message){
        setMessage('')
      }
      if (!username) {
        console.log("Enter your username")
        setMessage("Enter your username")
        return console.log("Enter your username")
      }
      if (!email) {
        console.log("Enter your email")
        setMessage("Enter your email")
        return console.log("Enter your email")
      }
      if (!password) {
        console.log("Enter your password")
        setMessage("Enter your password")
        return console.log("Enter your password")
      }
      if (!confirmPassword) {
        console.log("Please confirm your password")
        setMessage("Please confirm your password")
        return console.log("Please confirm your password")
      }
      if (confirmPassword !== password) {
          setMessage(
            'Passwords must match'
          )
        return false;
      } else if (username.length < 3) {
          setMessage(
          "Username should be greater than 3 characters.",
          )
        return false;
      } else if (password.length < 8) {
        setMessage(
          "Password should be equal or greater than 8 characters.",
          )
        return false;
      } else if (email === "") {
        setMessage("Email is required.");
        return false;
      }
  
      return true;
    };
  
    const handleSubmit = async (event: FormEvent) => {
      event.preventDefault();
      if (handleValidation()) {
        try{
            const { email, username, password } = values;
            const response = await axios.post(signupRoute, { username, email, password}, {withCredentials: true});
            const data = response.data
            if(response.status !== 200){
              console.log(data.error)
              setMessage(data.error)
              return
            }
            sessionStorage.setItem('user', JSON.stringify(data.user))
            
            const userSessionStorage = sessionStorage.getItem('user')
            if((userSessionStorage && userSessionStorage !== undefined) && router){
              console.log(JSON.parse(userSessionStorage))
              setSession(JSON.parse(userSessionStorage)) 
              console.log('Redirecting to jobs page...')
              router.push('/jobs')
    
            }
        } catch(error:any){
          if(error.response.data.error && (error.response.status === 400 || error.response.status === 409)){
            console.log(error.response.data.error)
            setMessage(error.response.data.error)
          }else if(!error.response.data.error){
            setMessage('NE1-Freelance is down for maintenance. Please try again later.')
          }

        } 
       
      }
    };
  
    useEffect(() => {
      const isAuthenticated = getUserSession()
      if(isAuthenticated) {
        setSession(isAuthenticated) 
        router.push('/jobs')
      }
      },[router])

  return (
    <>
    <GlobalNavbar session={session}/>
    <br />
        <main className="signup-main-container">
            <form className="signupForm" onSubmit={handleSubmit}>
            
            {message ? (
                <div className="alert alert-warning alert-dismissible fade show" role="alert">
                        <strong><i className="fa-solid fa-triangle-exclamation"></i>{message}</strong>
                        <button type="button" className="btn-close" response-bs-dismiss="alert" aria-label="Close"></button>
                    </div> 
            ) : null
            }

            

            <h1 className="signup-header">Sign up</h1>

            <div className="mb-3">
                <label htmlFor="username" className="form-label">Username:</label>
                <input type="text" className="form-control inputs" id="username" name="username" placeholder="John Doe"
                onChange={(e) => handleChange(e)} />
            </div>

            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email:</label>
                <input type="email" className="form-control inputs" id="email" name="email" placeholder="example@example.com"
                onChange={(e) => handleChange(e)} />
            </div>

            <div className="mb-3">
                <label htmlFor="password1" className="form-label">Password</label>
                <input type="password" className="form-control inputs" id="password1" name="password" placeholder="********"
                onChange={(e) => handleChange(e)} />
            </div>

            <div className="mb-3">
                <label htmlFor="password2" className="form-label">Confirm Password</label>
                <input type="password" className="form-control inputs" id="password2" name="confirmPassword" placeholder="********"
                onChange={(e) => handleChange(e)} />
            </div>

            <div className="col-12">
                <p className="link">Already a member?
                <Link href='/auth/login'>Login</Link>
                </p>
            </div>

            <div className="col-12">
                <button className="btn btn-primary submit-btn" type="submit">Sign up</button>
            </div>

            </form>
        </main>
    </>
  
  )
}

