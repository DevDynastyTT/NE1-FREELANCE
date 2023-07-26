'use client';

import { Profile, SessionType } from '@utils/types';
import { getUserSession } from '@utils/reuseableCode';
import { updateUser, getUserProfile, updateProfile, getProfilePictureURL } from '@utils/APIRoutes';
import GlobalNavbar from '@components/GlobalNavbar';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, FormEvent } from 'react'
import { usePathname } from 'next/navigation';
import GlobalFooter from '@components/GlobalFooter';
const server = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://ne1freelance.onrender.com";

export default function ProfileComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<SessionType>();
  const [userProfile, setUserProfile] = useState<Profile>();
  const [profilePictureURL, setProfilePictureURL] = useState<string>();
  const [userBio, setBio] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.currentTarget.name]: event.currentTarget.value });
  };

  const handleValidation = () => {
    console.log('validating')
    const { password, confirmPassword, username, email } = values;
    console.log(password)

    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        alert("Password and confirm password should be same.")
        return false;
      } else if (password.length < 8) {
        alert("Password should be equal or greater than 8 characters.")
        return false;
      }
    }

    return true;
  };

  async function handleLogOut() {
    sessionStorage.removeItem('user')

    if (pathname !== '/jobs') {
      console.log('redirecting')
      if (router) router.push("/jobs")
    }
    else
      window.location.href = 'jobs'
  }

  async function profile() {
    try {
      const response = await axios.get(`${getUserProfile}/${(session?._id)}`);
      const data = response.data;
      if (response.status !== 200) {
        console.log(data.error);
        setMessage(data.error);
        return
      }

      console.log(data.user_profile)
      setUserProfile(data.user_profile);
    } catch (error) {
      console.error(error, ' this happened');
      setMessage("Internal server error");
    }
  }

  async function handleProfileUploadFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('userID', (session && session?._id) ? session._id : '');
    formData.append('bio', (userBio && userBio.length > 0) ? userBio : '');
    formData.append('profile_picture', event.currentTarget.profilepicture.files[0]);

    try {
      if (!userBio) setBio('undefined');

      const response = await axios.put(`${updateProfile}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, // Ensure the correct content type for FormData
      });
      const data = response.data
      // Check the response status code
      if (response.status !== 200) {
        setMessage(data.error);
        console.log(data.error);
        return
      }

      setMessage(data.message);
      // Fetch the pre-signed URL from the response data
      const signedUrl = response.data.signedUrl;

      // Use the pre-signed URL to fetch the image
      const imageResponse = await axios.get(signedUrl, {
        responseType: 'blob', // Set the response type to blob
      });

      // Create a URL for the image blob
      const imageUrl = URL.createObjectURL(imageResponse.data);

      // Set the image URL to display the image
      setUserProfile(prevUserProfile => ({
        userID: prevUserProfile ? prevUserProfile.userID : '',
        bio: userProfile?.bio,
        profilePicture: imageUrl,
        creditCard: userProfile?.creditCard
      }));

    } catch (error) {
      console.log(error);
    }
  }

  async function handleUpdateUserSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    console.log(`Form Data Accepted\nUsername: ${values.username}, Email: ${values.email}\npassword: ${values.password}, confirmPassword: ${values.confirmPassword}`)

    if (handleValidation()) {
      try {
        console.log('Running updateUser function...')
        console.log('passed validation')
        const { email, username, password } = values;
        const response = await axios.post(updateUser, {
          userID: session?._id,
          username,
          email,
          password,
        })

        const data = response.data

        if (response.status !== 200) {
          console.log(data.error)
          setMessage(data.error)
          return
        }

        alert('You are going to be logged out in 2 seconds for changes to apply...')
        setTimeout(() => {
          handleLogOut().then(() => router.push('/auth/login'))
        }, 1000)

      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    const isAuthenticated = getUserSession()
    if (!isAuthenticated) {
      alert('Login to view your profile')
      router.push('/auth/login')
      return
    }

    setSession(isAuthenticated);
  }, []);

  useEffect(() => {
    if(session && session?._id)
        profile().then(() => setIsLoading(false));
    
  }, [session])

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {(session && session?._id) && (
        <>
          <GlobalNavbar session={session} />

          <main className="profile-main-container">
                    <div className="profile-flex-container">
                        <div className="left">
        
                        {/*Profile picture is stored here*/}
                        <div className="top">
    
                            {/* Profile picture upload form */}
                            <form 
                                className="img-form" 
                                onSubmit={handleProfileUploadFormSubmit} 
                                encType="multipart/form-data"
                            >
    
                                <div className="profile-pic">
                                    {/* USER PROFILE PICTURE */}
                                        <Image
                                            className="profile-picture"
                                            src={userProfile?.profilePicture ?? `${server}/images/default.png`}
                                            alt='profile picture'
                                            width={100}
                                            height={100}
                                            unoptimized
                                            placeholder="blur"
                                            blurDataURL={`${server}/images/default.png`}
                                            priority
                                        />
                                   
                                </div>
                                
                                <div className="bottom" style={{marginTop: "10%"}}>
                                <br/>
                                    <p className="username">{session?.username}</p>
                                        {userProfile?.bio != "undefined" ? (
                                            <textarea 
                                                id="message-input" name="bio" 
                                                onChange={(e) => setBio(e.target.value)}
                                                placeholder={userProfile?.bio}/>
                                        ): (
                                            <textarea id="message-input" name="bio" 
                                            onChange={(e) => setBio(e.target.value)}
                                            placeholder="Tell us about yourself" />
                                        )}
    
                                                {/* BUTTON TO UPLOAD PROFILE PICTURE */}
                                                <label htmlFor="image-input" className="image-label">Update Profile Picture</label>
                                                <br />
                                                    <input 
                                                        id="image-input" 
                                                        type="file" 
                                                        name="profilepicture" 
                                                        accept="image/*"        
                                                        className="btn btn-secondary image-btn" 
                                                    />
                                        
                                    <button 
                                        className="btn btn-primary" 
                                        type="submit" 
                                        style={{height: "2.5rem"}}
                                    >Save Profile Picture
                                    </button>
    
                                </div>
                                    
    
    
    
    
    
                            </form> 
                            {/* End form */}
                            
                        </div>{/*End top div*/} 
    
                        <div className="bottom"></div>
        
        
                        </div> {/* End left div */}
        
        
                        <div className="right">
        
        
                            <form className="update-profile-form" onSubmit={handleUpdateUserSubmit}>
        
                                <h1 className="profile-header">Change Profile Information</h1>
        
                                <div className="update-profile-form-container">
                                    {(message && message?.length > 0) && (
                                        <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                        <strong className="message">
                                            <i className="fa-solid fa-triangle-exclamation"></i>
                                        {message }</strong> 
                                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div> 
                                        )}
        
                                    <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Username:</label>

                                    {session && Object.keys(session).length > 0 ? (
                                        <input 
                                            type="text" 
                                            className="form-control inputs" 
                                            id="username" 
                                            name="username" 
                                            placeholder={session.username}
                                            onChange={(event) => handleChange(event)}
                                            />
                                    ):(
                                        <input 
                                            type="text" 
                                            className="form-control inputs" 
                                            id="username" 
                                            name="username" 
                                            placeholder="Username"
                                            onChange={(event) => handleChange(event)} />
                                    )}
                                
                                    </div>

                                    <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email:</label>
                                    <input type="email" className="form-control inputs" id="email" name="email" placeholder={session.email}
                                        onChange={(e) => handleChange(e)}
/>
                                    </div>

                                    <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" className="form-control inputs" id="password" name="password" placeholder="********"
                                        onChange={(e) => handleChange(e)}
/>
                                    </div>

                                    <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                    <input type="password" className="form-control inputs" id="confirmPassword" name="confirmPassword" placeholder="********"
                                        onChange={(e) => handleChange(e)}
/>
                                    </div>
        
                                    <div className="col-12">
                                        <button 
                                            className="btn btn-primary submit-btn" 
                                            type="submit">Update Information
                                        </button>
                                    </div>
                                </div>
                                
        
                            </form> {/* End form */}
        
        
                        </div>{/* End right div? */}
        
        
                    </div>
                        
                </main>

          <GlobalFooter />
        </>
      )}
    </>
  )
}
