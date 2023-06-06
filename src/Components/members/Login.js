import '../../static/css/members/members.css'
import GlobalNavbar from '../GlobalNavbar'
import GlobalFooter from '../GlobalFooter'
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { loginRoute } from "../utils/APIRoutes";

export default function Login({currentUser}){
  const navigate = useNavigate();
  useEffect(()=> { 
    if(currentUser) navigate('/jobs/search') 
  }, [currentUser, navigate])

  const [message, setMessage] = useState();

  const [values, setValues] = useState({ email: "", password: "" });


  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
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

  const handleSubmit = async (event) => {
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
        window.location.href = "/jobs/search"
      }catch(error){
        console.log('Login Error\n', error)
        setMessage("Unfortunately our servers are down. Please try again later.")
      }
    }
  };
    return(
      <>
        {!currentUser && (currentUser == undefined || currentUser == null) && (
          <>
            <GlobalNavbar currentUser={currentUser}/>
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
                    <Link to='/members/signup'>Signup</Link>
                  </p>
                </div>

                <div className="col-12">
                  <button className="btn btn-primary submit-btn" type="submit">Login</button>
                </div>


              </form> {/* End Form */}
              </main>  
            <GlobalFooter/>
          </>
        )}
      </>
)}  // End stateless function component