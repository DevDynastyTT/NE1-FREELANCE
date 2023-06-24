import '../../static/css/members/profile.css'
import '../../static/css/navbar.css'
import GlobalNavbar from '../GlobalNavbar'
import GlobalFooter from '../GlobalFooter'

import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'

import { updateUser, getUserProfile, updateProfile } from '../utils/APIRoutes';

export default function Profile({currentUser, setCurrentUser}){
    const navigate = useNavigate();
    useEffect(()=> { if(!currentUser || currentUser == undefined || currentUser == null) navigate('/members/login') }, [])
    let [profilePicture, setProfilePicture] = useState()
    const [userProfile, setUserProfile] = useState()

    let [bio, setBio] = useState('');
    const [message, setMessage] = useState('')
  
      const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
  
    
      const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
      };
    
      const handleValidation = () => {
        console.log('validating')
        const { password, confirmPassword, username, email } = values;
        console.log(password)

        if(password || confirmPassword){
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
                  

        async function profile() {
            try {
                const response = await axios.get(`${getUserProfile}/${currentUser._id}`);
                const data = response.data;
                if (data.error) {
                    console.log(data.error);
                    setMessage(data.error);
                } else {
                    console.log(data.user_profile)
                    setUserProfile(data.user_profile);
                }
            } catch (error) {
                console.error(error);
                setMessage("Internal server error");
            }
        }


        async function handleProfileUploadFormSubmit(event){
            event.preventDefault()

            const formData = new FormData();
            formData.append('userID', currentUser._id)
            formData.append('bio', bio)
            formData.append('profile_picture', event.target.profilepicture.files[0]);
            console.log(`UserID: ${currentUser._id}\n Bio: ${bio}\nImageURL: ${profilePicture}`)
            
            try{
                if(!bio) bio = 'undefined'
                if(!event.target.profilepicture.files[0]) profilePicture = 'undefined'

               

                const response = await axios.post(`${updateProfile}`, formData)
            

                // Check the response status code
                if (response.data.message) {
                    // Set the message
                    setMessage(response.data.message);
            
                    // Log the message
                    console.log(response.data.message);
            
                   
                } else {
                    // Set the message
                    setMessage(response.data.message);
            
                    // Log the message
                    console.log(response.data.message);
                }
            }catch(error){
                console.log(error)
            }
        }

        async function handleUpdateUserSubmit(event) {
            event.preventDefault()

            console.log(`Form Data Accepted\nUsername: ${values.username}, Email: ${values.email}\npassword: ${values.password}, confirmPassword: ${values.confirmPassword}`)

            if(handleValidation()){
                try {
                    console.log('Running updateUser function...')
                    console.log('passed validation')
                    const { email, username, password } = values;
                    const response = await axios.post(updateUser, {
                        userID: currentUser._id,
                        username,
                        email,
                        password,
                    })

                        const data = response.data

                        if (data.error) {
                            console.log(data.error)
                            setMessage(data.error)
                            return
                        } 
                        alert('You are going to be logged out in 2 seconds for changes to apply...')
                        setTimeout(() => {
                            handleLogOut().then(()=> navigate('/members/login'))
                        }, 1000)
                    
                } catch (error) {
                    console.log(error)
                }
            }
        }

        async function handleLogOut() {
            try{
              const response = await axios.post(logoutRoute, {id: currentUser._id})
              if(response.data.error){
                alert(response.data.error)
                return
              }
              localStorage.removeItem(process.env.REACT_APP_LOCALHOST_KEY);
          
            }catch(error){
              alert('error logging out', error)
            }
          }
          
    useEffect(()=>{
        profile()
    }, [currentUser])
  
  if(currentUser && userProfile){
    return (
        <>
            <GlobalNavbar currentUser={currentUser} setCurrentUser={setCurrentUser} />

        <main className="profile-main-container">


            <div className="profile-flex-container">

                <div className="left">

                    {/*Profile picture is stored here*/}
                    <div className="top">

                        {/* Profile picture upload form */}
                        <form className="img-form" onSubmit={handleProfileUploadFormSubmit} encType="multipart/form-data">

                            {/* {% csrf_token %} */}
                            <div className="profile-pic">
                                  {/* USER PROFILE PICTURE */}
                                  
                                  {userProfile.profile_picture != "undefined" ? (
                                    <img src={`http://localhost:3000/images/${userProfile.profile_picture}`} alt={userProfile.profile_picture} className="profile-picture" />

                                    ) : (
                                        <img src={`http://localhost:3000/images/default.jpeg`} alt="#" className="profile-picture" />

                                    )}
                                        {/* <div className="spinner"></div> */}


                            </div>
                          
                            <div className="bottom" style={{marginTop: "10%"}}>
                            <br/>
                                <p className="username">{currentUser.name}</p>
                                    {userProfile.bio != "undefined" ? (
                                        <textarea id="message-input" name="bio" 
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder={userProfile.bio}/>
                                    ): (
                                        <textarea id="message-input" name="bio" 
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Tell us about yourself" />
                                    )}

                                            {/* BUTTON TO UPLOAD PROFILE PICTURE */}
                                            <label htmlFor="image-input" className="image-label">Update Profile Picture</label>
                                            <br />
                                            <input id="image-input" type="file" name="profilepicture" accept="image/*" 
                                                onChange={(event) => setProfilePicture(URL.createObjectURL(event.target.files[0]))}

                                            className="btn btn-secondary image-btn" />
                                    
                                <button className="btn btn-primary" type="submit" style={{height: "2.5rem", backgroundColor: "rgb(62,114,88)"}}>Save Profile Picture</button>

                            </div>
                               





                        </form> 
                        {/* End form */}
                        
                    </div>{/*End top div*/} 

                    <div className="bottom"></div>


                </div> {/* End left div */}


                <div className="right">


                    <form className="update-profile-form" onSubmit={handleUpdateUserSubmit}>
                            {/* {% csrf_token %} */}

                        <h1 className="profile-header">Change Profile Information</h1>

                        <div className="update-profile-form-container">
                                {message.length > 0 ? (
                                    <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                    <strong className="message">
                                        <i className="fa-solid fa-triangle-exclamation"></i>
                                    {message }</strong> 
                                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div> 
                                        ): null}

                                            <div className="mb-3">
                                            <label htmlFor="username" className="form-label">Username:</label>

                                            {currentUser && Object.keys(currentUser).length > 0 ? (
                                                <input type="text" className="form-control inputs" id="username" name="username" placeholder={currentUser.username}
                                                 onChange={(e) => handleChange(e)}/>
                                            ):(
                                                <input type="text" className="form-control inputs" id="username" name="username" placeholder="Username"
                                                 onChange={(e) => handleChange(e)} />
                                            )}
                                        
                                            </div>

                                            <div className="mb-3">
                                            <label htmlFor="email" className="form-label">Email:</label>
                                            <input type="email" className="form-control inputs" id="email" name="email" placeholder={currentUser.email}
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
                                    <button className="btn btn-primary submit-btn" type="submit">Update Information</button>
                                </div>
                        </div>
                        

                    </form> {/* End form */}


                </div>{/* End right div? */}


            </div>
               
        </main>
        <GlobalFooter/>

        </>
    )
  }else if(currentUser && currentUser != null && currentUser != undefined){
    return(
        <>
            <h1 className="spinnerTitle">Loading Please Wait </h1>
        </>
    )
  }
    
}