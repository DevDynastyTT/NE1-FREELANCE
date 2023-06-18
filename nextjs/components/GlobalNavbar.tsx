'use client'

import '@styles/nav/navbar.css'
import Image from 'next/image'
import PcLogo from '@public/images/logo2.png'
import MobileLogo from '@public/images/N.png'
import { GrMenu } from 'react-icons/gr';

import { fetchCategories } from '@utils/reuseableCode'
import {User, Jobs, JobCategory} from '@utils/interfaces'
import { getCategories, logoutRoute, userSession } from '@utils/APIRoutes'

import Link from 'next/link'
import { useState, useEffect, FormEvent, Dispatch, SetStateAction } from 'react'
import { useRouter, usePathname } from 'next/navigation'
//TO DO log the type for currentUser and setCurrentUser, double check the job_id variable names in mongo as well
export default function GlobalNavbar({currentUser, setCurrentUser}
  : {
    currentUser:User | undefined, 
    setCurrentUser:Dispatch< SetStateAction<User | undefined> >
  }) {

  const router = useRouter()  
  const pathname = usePathname()
  const [jobs, setJobs] = useState<Jobs[]>([])
  const [jobCategory, setJobCategory] = useState<JobCategory[]>()
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([])
  
  const [search, setSearch] = useState<String>()
  const [isSearching, setIsSearching] = useState<Boolean>(false)


  const [message, setMessage] = useState<String>('Finding available jobs')

  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
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
                    router.push(url);

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
              router.push('/jobs/search')
            else
              window.location.reload()
          }catch(error){
            alert('error logging out')
            console.log(error)
        }
      }

    useEffect(()=>{fetchCategories(setJobCategories, getCategories)}, [])

  return (
    <>
          <nav className="logged_out-navbar">

            <div className="logo-wrapper">
              <Image 
                className = "pc-logo" 
                src={PcLogo} 
                alt = "logo" 
                onClick={()=> router.push("/")}
              />

              <Image 
                className = "mobile-logo" 
                src={MobileLogo} 
                alt = "logo" 
                onClick={()=> router.push("/")}
              />
            </div>
          

           {/* <!--Search for jobs form--> */}
          {/* {pathname !== '/jobs/search' || pathname !== '/login' || pathname !== '/members/signup' &&  (
                <form className="search-form navbar-search-form row g-3" method="GET" onSubmit={handleSearchSubmit}>
                  <input className="search-input-field form-control" type="text" placeholder="Search for job..." name="search" required
                      onChange={(event)=> setSearch(event.target.value)}
                  />

                  <select 
                    className="form-select select-input-field" 
                    name="category" 
                    defaultValue="All Categories" 
                    onChange={(event) => setJobCategory([{name:event.target.value}])}>
                      
                    <option value="">All categories</option>
                      {jobCategories.map(category => {
                          return(
                              <option 
                                value={category.name.toString()} 
                                key={category.name.toString()}>
                                  {category.name}
                              </option>
                          )
                      })}
                  </select>

                  <button className="btn btn-primary search-btn" type="submit">Search</button>

                </form>

           )} */}
          
          <button type='button' className="sandwich-button" onClick={toggleMenu}>
            <GrMenu /> {/* Sandwich icon */}
          </button>
            <ul className={`nav nav-tabs ${isMenuOpen ? 'open' : ''}`}>

              <li className="nav-item">
                <Link className="nav-link" href="/">Home</Link>
              </li>

                <li className="nav-item">
                  <Link className = "nav-link" href={'/jobs/search'}>Jobs</Link>
                </li>
              <li className="nav-item">
                <Link className="nav-link" href="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/contact">Contact</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/members/login">Login/Signup</Link>
              </li>
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
//                 handleLogOut(currentUser._id).then(()=> router.push('/members/login'))
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
