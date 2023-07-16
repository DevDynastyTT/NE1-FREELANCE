'use client'


import {SessionType, JobsType, JobCategory} from '@utils/types'
import GlobalNavbar from '@components/GlobalNavbar'
import { fetchCategories, getUserSession } from '@utils/reuseableCode';
import { getAllJobs, getCategories, searchJobs } from '@utils/APIRoutes'

import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { FormEvent, useEffect, useState } from 'react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';


export default function JobsComponent() {

    //Used for navigating urls
    const router:AppRouterInstance = useRouter();
    const [session, setSession] = useState<SessionType>()


    // Jobs State
    const [jobs, setJobs] = useState<JobsType[]>([])
    const [jobCategories, setJobCategories] = useState<JobCategory[]>([])
    const [jobCategory, setJobCategory] = useState<string>()
    //Search State
    const [search, setSearch] = useState<string>()
    const [message, setMessage] = useState<string>('Finding available jobs')
    const [isSearching, setIsSearching] = useState<boolean>(false)
 
    async function handleSearchSubmit(event:FormEvent<HTMLFormElement>) {
      event.preventDefault()
      setIsSearching(true); // Set isSearching back to false after the search is completed
      
        try {
          const response = await axios.get(`${searchJobs}/${jobCategory}/${search}`);
          const data = response.data;
      
          if (response.status !== 200) {
            setMessage(data.error);
            console.log(data.error);
            return
          } 
            setJobs(data.job_list);
            console.log('Results = ', data.job_list);
        
        } catch (error:any) {
          if(error.response.data.error){
            console.log(error.response.data.error)
            setMessage(error.response.data.error)
            setJobs([])
          }
          else console.log(error)
        }
      
      }

      async function fetchJobs(): Promise<void> {
      
          try{
            const response = await axios.get(getAllJobs)
            const data = response.data
            if(response.status !== 200){
              setMessage(data.error)
              return
            }
            console.log(data.reversedJobList)
            setJobs(data.reversedJobList)
          }catch(error:any){
            setMessage('NE1-Freelance is currently under maintenance.')

            if(error.response.data?.error && error.response.data?.error === 404){
              setMessage(error.response.data.error)
              return
            }


          }
         
      
      }

    async function fetchUserSession(){
      const userSession:SessionType | undefined = await getUserSession();
      setSession(userSession);
    }
      useEffect(() => {
        fetchUserSession();
      
        fetchJobs(); // Fetch jobs regardless of search state
      
        fetchCategories(setJobCategories, getCategories);
      }, []);
      
    //TODO upon search, re-render the page with the results
  return (
    <>
        <GlobalNavbar session={session}/>
        <br />
        <main className={`jobs-main-container search ${jobs?.length === 0 && 'no-jobs'}`}>
                    
                    <div className={`${jobs && jobs.length <= 5 ? 'top-no-padding': 'top-padding'}`}>
                            <h2>Available jobs</h2>

                            <form 
                                className="search-form row g-3"
                                onSubmit={handleSearchSubmit}>
                                {/* {% csrf_token %} */}
                                <input 
                                    className="search-input-field form-control" 
                                    type="text" 
                                    placeholder="Search for job..." 
                                    name="search" 
                                    required
                                    onChange={(event)=> setSearch(event.target.value)}
                                />

                                <select 
                                    className="form-select select-category" 
                                    name="category" 
                                    defaultValue="All Categories" 
                                    onChange={(event) => setJobCategory(event.target.value)}>
                                    
                                    <option value="">All categories</option>
                                    {/* <option value="Administration">Administration</option>
                                    <option value="Esthetics">Esthetics</option>
                                    <option value="Transportation">Transportation</option>
                                    <option value="Cleaning">Cleaning</option>
                                     */}
                                    {jobCategories?.map(category => {
                                        return(
                                            <option 
                                                value={category.name} 
                                                key={category.name}>
                                                    {category.name}
                                            </option>
                                        )
                                    })}
                                </select>


                                <button 
                                    className="btn btn-primary search-btn" 
                                    type="submit"
                                >   Search
                                </button>

                            </form>

                    </div>
                
                    {/* Render jobs if there are no jobs available */}
                    {jobs && jobs.length > 0 ? (
                        <div className="job-list-flex">
                            {jobs.map(function (job) {
                                return (
                                    <div
                                        className="job-card"
                                        key={job._id}
                                        onClick={() => router.push(`/jobs/${job._id}`)}>

                                        {/* <!--Display the job's thumbnail--> */}
                                        <div className="thumbnail-container" style={{ overflow: "hidden" }}>
                                            <Image 
                                                src={job.thumbnail} 
                                                alt="job thumbnail" 
                                                width={100}
                                                height={100}
                                            />
                                        </div>

                                    <div className="details">
                                        {/* <!-- display the job title --> */}
                                        <h3 className="title">{job.title}</h3>

                                        <p className="username">
                                        <b style={{ "marginRight": "1%" }}>User:</b> {job.username}
                                        </p>
                                        {/* <!-- display the job category --> */}
                                        <p className="category">
                                        <b>Category:</b> {job.category}
                                        </p>

                                        <hr style={{ "backgroundColor": "rgb(224, 224, 224)" }} />
                                        <p className="price">${job.price}</p>
                                    </div>
                                    </div>
                                );
                            })}
                    </div>
                    ) : 
                        <h1>
                          <br />
                          {message}
                        </h1>
                    }


                    

        </main>
    </>
    
  )
}
