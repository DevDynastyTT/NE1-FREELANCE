import {Link, useNavigate} from 'react-router-dom'
import '../../static/css/members/chatGlobalNavbar.css'
import Logo from '../../static/images/N.png'
import { logoutRoute } from '../utils/APIRoutes'

// <!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->

export default function ChatGlobalNavBARar(props){
    const currentUser = props.currentUser
    const userProfilePicture = props.userProfilePicture
    const navigate = useNavigate()

    async function handleLogOut(id) {
        try{
          const response = await axios.post(logoutRoute, {id: currentUser._id}, {withCredentials: true})
          if(response.data.error){
            alert(response.data.error)
            return
          }
          props.setCurrentUser(null)
        }catch(error){
          alert('error logging out', error)
        }
      }
      
    return (
        <>
            {currentUser && (
                <nav className="chat-global-navbar">
                    <div className="logo-container">
                        <img src={Logo} className = "logo" alt = "logo" onClick={()=> window.location.href = "/"}/>
                    </div>        
            
                    <ul className="nav nav-tabs">

                        <li className="nav-item">
                            <Link className="dropdown-item" to={'/jobs/createjob'}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>                            
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className = "nav-link" to={'/jobs/search'}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>                                
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={'/members/chat'}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M160 368c26.5 0 48 21.5 48 48v16l72.5-54.4c8.3-6.2 18.4-9.6 28.8-9.6H448c8.8 0 16-7.2 16-16V64c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16V352c0 8.8 7.2 16 16 16h96zm48 124l-.2 .2-5.1 3.8-17.1 12.8c-4.8 3.6-11.3 4.2-16.8 1.5s-8.8-8.2-8.8-14.3V474.7v-6.4V468v-4V416H112 64c-35.3 0-64-28.7-64-64V64C0 28.7 28.7 0 64 0H448c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H309.3L208 492z"/></svg>
                            </Link>
                        </li>

                        <li className="nav-item profile-picture" onClick={()=> navigate('/members/profile')}>
                            {userProfilePicture !== 'undefined' ? (
                                    <img src={`http://localhost:3000/images/${userProfilePicture}`} alt=""/>
                                    ) : 
                                    <img src={'http://localhost:3000/images/default.jpeg'} alt="defaultImage"/>  
                                    }
                        </li>

                        <li className="nav-item" id="log-out">
                            <Link className="dropdown-item" onClick={() => handleLogOut().then(()=> navigate('/members/login'))}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"/></svg>                        
                            </Link>
                        </li>
                    </ul>
                </nav>
            )}
        </>
    
       
        
    )
}