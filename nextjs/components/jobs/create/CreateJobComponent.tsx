'use client';

import { SessionType, JobCategory } from '@utils/types';
import GlobalNavbar from '../../GlobalNavbar';
import { fetchCategories, getUserSession } from "@utils/reuseableCode"
import { getCategories, createJob } from '@utils/APIRoutes'

import axios from 'axios';
import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import GlobalFooter from '@components/GlobalFooter';


export default function CreateJobComponent(){
    const router:AppRouterInstance = useRouter();
    const [session, setSession] = useState<SessionType>()

    //Form inputs
    const [title, setTitle] = useState<string>()
    const [description, setDescription] = useState<string>()
    const [thumbnail, setThumbnail] = useState<string>()
    const [category, setCategory] = useState<string>()
    const [jobCategories, setJobCategories] = useState<JobCategory[]>()
    const [price, setPrice] = useState<number>()

    //Form message
    const [message, setMessage] = useState('')

    const [isLoading, setIsLoading] = useState(true);

    async function handleCreateJobSubmit(event:FormEvent<HTMLFormElement>) {
        event.preventDefault();
    
        const formData = new FormData()
        formData.append('freeLancerID', session?._id || '')
        formData.append('title', title || '')
        formData.append('description', description || '')
        formData.append('price', String(price || ''))
        formData.append('category', category || '')
        formData.append('thumbnail', event.currentTarget?.thumbnail.files[0]);
      
        try {
          const response = await axios.post(createJob, formData)
          const data = response.data;
      
          if (data.error) {
            console.log(data.error);
            setMessage(data.error);
          } else if (data.message) {
            console.log(data.message);
            alert(data.message);
            router.push('/jobs')
          }
        } catch (error) {
          console.log(error);
          setMessage("Error creating job.");
        }
    }
      
    useEffect(()=> {
        const isAuthenticated = getUserSession()
        if(!isAuthenticated) {
            alert('Login to create a job')
            router.push('/auth/login')
            return
        }
        setSession(isAuthenticated)         
        
        fetchCategories(setJobCategories, getCategories)
          .then(() => {
            setIsLoading(false);
          })
          .catch((error) => {
            console.error('Failed to fetch categories:', error);
          });
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return(
        <>
            <GlobalNavbar session={session}/>
                                
            <main className="createJob-main-container">
                {/* CREATE JOB FORM */}
                <form 
                    id="job_form" 
                    onSubmit={handleCreateJobSubmit} 
                    encType="multipart/form-data"> 
                
                    {/* Display error or success message on submit */}
                    {message.length > 0 && (
                        <div className="alert alert-warning alert-dismissible fade show" role="alert">
                            <strong className="form-label">
                                <i className="fa-solid fa-triangle-exclamation" />
                                {message }
                            </strong> 

                            <button 
                                type="button" 
                                className="btn-close" 
                                data-bs-dismiss="alert" 
                                aria-label="Close" />
                        </div> 
                    )}

                    <div className='input-wrapper'>
                        <div className="info">
                            <label htmlFor="title" className='form-label label'>Title</label>
                            <p className="form-label descriptive">
                                Your Gig title is like the storefront for your services, 
                                and it is crucial to use relevant keywords that potential buyers 
                                may search for when looking for a service similar to yours.
                            </p>
                        </div>
                    
                        <input 
                            id="title" 
                            className='form-control' 
                            type="text" 
                            name="title" 
                            onChange={(event) => setTitle(event.target.value)}
                            required
                        />
                    </div>

                    {/* Rest of the form fields go here */}

                    <button className="btn btn-primary submit-btn" type="submit">Create Job</button>
                </form>
            </main>

            <GlobalFooter/>
        </>
    )
}
