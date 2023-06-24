'use client'

import '@styles/searchResults/style.css'

import {SessionType, Jobs, JobCategory} from '@utils/types'
import RootLayout from '@app/layout'
import GlobalNavbar from '@components/GlobalNavbar'
import GlobalFooter from '@components/GlobalFooter'
import { fetchJobs, fetchCategories } from '@utils/reuseableCode';
import { getAllJobs, getCategories, searchJobs } from '@utils/APIRoutes'

import axios from 'axios';
import { useRouter } from 'next/navigation';

import { FormEvent, useEffect, useState } from 'react'


export default function Jobs(){
    //Used for navigating urls
    const router = useRouter();

    const [session, setSession] = useState<SessionType>()
    
    const checkSession = sessionStorage.getItem('user')
    if(checkSession){
        if(!session) setSession(JSON.parse(checkSession))
        console.log(JSON.parse(checkSession))
      }

    // Jobs State
    const [jobs, setJobs] = useState<Jobs[]>([])
    const [jobCategories, setJobCategories] = useState<JobCategory[]>([])
    const [jobCategory, setJobCategory] = useState<JobCategory[]>()

    //Search State
    const [search, setSearch] = useState<String>();
    const [message, setMessage] = useState<String>('Finding available jobs')
    const [isSearching, setIsSearching] = useState<Boolean>(false)

        async function handleSearchSubmit(event: FormEvent){
            setIsSearching(true)
            event.preventDefault();

            try{
                const response = await axios.post(searchJobs, {jobCategory, search})

                const data = response.data;
                    if(data.error){
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
        };

        useEffect(()=>{
            fetchJobs(getAllJobs, setJobs, setMessage)
            fetchCategories(setJobCategories, getCategories)
        }, [isSearching])

return(
    <>
        <GlobalNavbar session={session}/>
        <br />
        <main className={`jobs-main-container search ${jobs.length === 0 && 'no-jobs'}`}>
                    
                    <div className={`${jobs && jobs.length <= 5 ? 'top-no-padding': 'top-padding'}`}>
                            <h2>Available jobs</h2>

                            <form className="search-form row g-3" onSubmit={handleSearchSubmit}>
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

                    </div>
                  
                    {/* End Top Div */}

                    {/* Render jobs if there are no jobs available */}
                    {jobs && jobs.length > 0 && message !== "There are currently no jobs available" ? (
                        <div className="job-list-flex">
                        {jobs.map(function (job) {
                        return (
                            <div
                            className="job-card"
                            key={job._id.toString()}
                            onClick={() => router.push(`/jobs/search/details/${job._id}`)}
                            >
                            {/* <!--Display the job's thumbnail--> */}
                            <div className="thumbnail-container" style={{ overflow: "hidden" }}>
                                <img src={`http://localhost:3000/images/${job.thumbnail}`} alt="job thumbnail" />
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
                    ) : (
                    <>
                        <br />
                        <h1>{message}</h1>
                    </>
                    )}


                    

        </main> 
    </>
)
}

