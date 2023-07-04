'use client'

import Image from 'next/image'
import '@styles/nav/navbar.css'
import PcLogo from '@public/images/logo2.png'
import MobileLogo from '@public/images/N.png'

import {JobCategory, SessionType} from '@utils/types'
import { fetchCategories } from '@utils/reuseableCode'
import { getCategories} from '@utils/APIRoutes'

import Link from 'next/link'
import { useState, useEffect} from 'react'
import { GrMenu } from 'react-icons/gr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-regular-svg-icons'

import { usePathname, useRouter } from 'next/navigation';
//TO DO log the type for session and setsession, double check the job_id variable names in mongo as well
export default function GlobalNavbar({session}:{session:SessionType | undefined}) { 
  const router = useRouter()
  const pathname = usePathname()
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

                    let url = `/jobs`;
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

   
      function handleLogOut() {
          sessionStorage.removeItem('user')

          if(pathname !== '/jobs'){
            console.log('redirecting')
             router.push("/jobs")
          }
          else
              window.location.href = 'jobs'
      }

      useEffect(()=>{fetchCategories(setJobCategories, getCategories)}, [])

      // Load bootstrap js functionality when the DOM has fully rednered
      useEffect(() => {
        if (typeof document !== 'undefined') {
          // Load Bootstrap JavaScript bundle only in the browser environment
          require('bootstrap/dist/js/bootstrap.bundle');
        }
      }, []);
  return (
    <>
        {session ? (
          <nav className="logged_in-navbar">
              <div className="logo-wrapper">
                <Image 
                  className = "pc-logo" 
                  src={PcLogo} 
                  alt = "logo" 
                  onClick={()=> window.location.href = "/"}
                />

                <Image 
                  className = "mobile-logo" 
                  src={MobileLogo} 
                  alt = "logo" 
                  onClick={()=> window.location.href = "/"}
                />
              </div>          
          
           
          
              <button type='button' className="sandwich-button" onClick={toggleMenu}>
                <GrMenu /> {/* Sandwich icon */}
              </button>
            <ul className={`nav nav-tabs ${isMenuOpen ? 'open' : ''}`}>
          
                  <li className="nav-item dropdown">
                    <Link 
                      className="nav-link dropdown-toggle" 
                      data-bs-toggle="dropdown" 
                      href="#" 
                      role="button" 
                      aria-expanded="false"
                    >
                    
                    {/* Green Circle Icon to show that the user is active */}
                    <FontAwesomeIcon 
                      className='active-status'
                      icon={faCircle} 
                    /> 
                      {session ? (
                         session.username
                        ): null}
                    </Link>
                    
                      {/* Drop down menu when the .dropdown-toggle / .dropdown is clicked */}
                      <ul className="dropdown-menu">
                        <li>
                          <Link 
                            className="dropdown-item" 
                            href={'/jobs/create'}> 
                              Create job
                          </Link>
                        </li>

                        <li>
                          <Link 
                            className="dropdown-item" 
                            href={'/auth/profile'}>
                              Profile
                          </Link>
                        </li>
                        
                        {session.isStaff && (
                          <li>
                            <Link 
                              className="dropdown-item" 
                              href={'#'}>
                              {/* href={'/auth/admin'}> */}
                                Admin(Soon...)
                            </Link>
                            </li>
                          )}

                          <li>
                            <Link 
                              className="dropdown-item" 
                              href={'#'}>
                              {/* href={'/auth/admin'}> */}
                                Admin(Soon...)
                            </Link>
                          </li>
                        
                        <li>
                          <Link 
                            className="dropdown-item" 
                            href="#"
                            onClick={handleLogOut}>
                              Logout
                          </Link>
                        </li>
                      </ul> {/* End DropDown-Menu */}
                  </li>
          
                  <li className="nav-item">
                    <Link className = "nav-link" href={'/jobs'}>Jobs</Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" href={'#'}>About(Soon...)</Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" href={'/contact'}>Contact</Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" href={'/auth/messages'}>Messages(beta)</Link>
                  </li>

            </ul>
          </nav> 
        ): (
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
          
          
          <button type='button' className="sandwich-button" onClick={toggleMenu}>
            <GrMenu /> {/* Sandwich icon */}
          </button>
            <ul className={`nav nav-tabs ${isMenuOpen ? 'open' : ''}`}>

              <li className="nav-item">
                <Link className="nav-link" href="/">Home</Link>
              </li>

                <li className="nav-item">
                  <Link className = "nav-link" href={'/jobs'}>Jobs</Link>
                </li>
              <li className="nav-item">
                <Link className="nav-link" href="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/contact">Contact</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/auth/login">Login/Signup</Link>
              </li>
            </ul>

          </nav>
        )}
          

    </>
  );
}