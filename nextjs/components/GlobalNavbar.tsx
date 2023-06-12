'use client'

import '../static/css/navbar.css'
import Logo from '../static/images/logo2.png'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { fetchCategories } from '../utils/reuseableCode'
import { getCategories, logoutRoute, userSession } from '../utils/APIRoutes'
import Category from '../utils/jobCategoryInterface'


export default function GlobalNavbar() {
  const navigate = useNavigate()  
  const location = useLocation();
  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false)
  const [jobCategories, setJobCategories] = useState<Category[]>([])
  const [jobCategory, setJobCategory] = useState('')
  const [message, setMessage] = useState('Finding available jobs')

      async function handleSearchSubmit(event: React.FormEvent){
        setIsSearching(true)
        console.log('Searching: ' + isSearching)
        console.log(`Searching for ${search}`)
        event.preventDefault();


        try{
            const response = await fetch(`http://localhost:3001/jobs_search/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({jobCategory, search})
            });
            const data = await response.json();
                if(data.error){
                    console.error(data.error)
                    setMessage(data.error)
                }
                    setJobs(data.job_list)

                    let url = `/jobs/search/`;
                    if (data.jobCategory) {
                    url += `category:${data.jobCategory}/`;
                    }
                    if (search) {
                    url += `term:${search}/`;
                    }
                    navigate(url);

        }catch(error){
            console.log('CATCH ERROR WHILE FETCHING\n' + error)
        }
        setIsSearching(false)
        console.log('Searching: ' + isSearching)
      };

   
      async function handleLogOut() {
        try{
          // const response = await axios.post(logoutRoute, {id: currentUser._id}, {withCredentials: true})
          // if(response.data.error){
          //   alert(response.data.error)
          //   return
          // }

          // if(!setCurrentUser) return window.location.reload()

          // setCurrentUser(null)
          sessionStorage.removeItem('user')
            if(window.location.href !== '/jobs/search')
              navigate('/jobs/search')
            else
              window.location.reload()
          }catch(error){
            alert('error logging out')
            console.log(error)
        }
      }

    useEffect(()=>{
      fetchCategories(setJobCategories, getCategories)
    }, [])

  return (
    <>
   


          <nav className="logged_out-navbar">
            <Image 
              src={Logo} 
              className = "logo" 
              alt = "logo" 
              onClick={()=> window.location.href = "/"}
            />

           {/* <!--Search for jobs form--> */}
          {!location.pathname.startsWith('/jobs/search') || !location.pathname.startsWith('/members/login') || !location.pathname.startsWith('/members/signup')&&  (
            <form className="search-form navbar-search-form row g-3" method="GET" onSubmit={handleSearchSubmit}>
                              {/* {% csrf_token %} */}
                              <input className="search-input-field form-control" type="text" placeholder="Search for job..." name="search" required
                                  onChange={(event)=> setSearch(event.target.value)}
                              />

                              <select className="form-select select-input-field" name="category" defaultValue="All Categories" onChange={(e) => setJobCategory(e.target.value)}>
                                  <option value="">All categories</option>
                                  {jobCategories.map(category => {
                                      return(
                                          <option value={category.name} key={category.name}>{category.name}</option>
                                      )
                                  })}
                              </select>

                              <button className="btn btn-primary search-btn" type="submit">Search</button>

                          </form>

          )}
          
            <ul className="nav nav-tabs">

              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link></li>

                <li className="nav-item"><Link className = "nav-link" to={'/jobs/search'}>Jobs</Link>
                    </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link></li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Contact</Link></li>
              <li className="nav-item">
                <Link className="nav-link" to="/members/login">Login/Signup</Link></li>
            </ul>
          </nav>

    </>


  );
}

{/* <nav className="logged_in-navbar">
<img src={Logo} className = "logo" alt = "logo" onClick={()=> window.location.href = "/"}/>

 {/* <!--Search for jobs form--> */}
//  {!location.pathname.startsWith('/jobs/search') ?  (
//   <form className="search-form navbar-search-form row g-3" method="GET" onSubmit={handleSearchSubmit}>
//                     {/* {% csrf_token %} */}
//                     <input className="search-input-field form-control" type="text" placeholder="Search for job..." name="search" required
//                         onChange={(event)=> setSearch(event.target.value)}
//                     />

//                     <select className="form-select select-input-field" name="category" defaultValue="All Categories" onChange={(e) => setJobCategory(e.target.value)}>
//                         <option value="">All categories</option>
//                         {jobCategories.map(category => {
//                             return(
//                                 <option value={category.name} key={category.name}>{category.name}</option>
//                             )
//                         })}
//                     </select>

//                     <button className="btn btn-primary search-btn" type="submit">Search</button>

//                 </form>

//  ): null}

//     <ul className="nav nav-tabs">

//         <li className="nav-item dropdown">
//           <Link className="nav-link dropdown-toggle" data-bs-toggle="dropdown" to="#" role="button" aria-expanded="false">
//             <i className="fa-solid fa-circle active-status"></i>
//               {currentUser ? (
//                   currentUser.username
//               ): null}
//         </Link>
//           <ul className="dropdown-menu">
//             <li><Link className="dropdown-item" to={'/jobs/createjob'}>Create job</Link></li>
//             {window.location.pathname !== "/members/profile" ? (
//               <li><Link className="dropdown-item" to={'/members/profile'}>Profile</Link></li>
//             ) : null
//             }
//             {currentUser.is_staff ? (
//               <li><Link className="dropdown-item" to={'/admin'}>Admin</Link></li>) : null
//               }
//               {/* <li><Link className="dropdown-item" to={'/admin'}>Admin</Link></li>) */}
            
//             <li><Link className="dropdown-item" 
//             onClick={() => {
//                 handleLogOut(currentUser._id).then(()=> navigate('/members/login'))
//               }
//               }
//             >Logout</Link></li>
//           </ul>
//         </li>

//         <li className="nav-item"><Link className = "nav-link" to={'/jobs/search'}>Jobs</Link>
//             </li>
//             <li className="nav-item"><Link className="nav-link" to={'/about'}>About</Link>
//             </li>
//                 <li className="nav-item"><Link className="nav-link" to={'/contact'}>Contact</Link>
//                 </li>
//                 <li className="nav-item"><Link className="nav-link" to={'/members/chat'}>Messages</Link>
//                 </li>
//       </ul>
// </nav> }
