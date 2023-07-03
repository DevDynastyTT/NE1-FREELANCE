'use client'

import { SessionType, JobCategory } from '@utils/types';
import GlobalNavbar from '../../GlobalNavbar';
import { fetchCategories, getUserSession } from "@utils/reuseableCode"
import { getCategories, createJob } from '@utils/APIRoutes'

import axios from 'axios';
import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';


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
        //Check user authentication
        getUserSession(setSession)
        //Categories fetch for selection field
        fetchCategories(setJobCategories, getCategories)
    }, []);

  

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
                    
                        <div className='input-wrapper'>
                            <div className="info">
                                <label htmlFor="description" className='form-label label'>Description</label>
                                <p className='form-label descriptive'>
                                    Describe the service you will be offering. 
                                    Be clear and concise, and highlight any unique skills or qualifications 
                                    you bring to the table. This will help buyers understand what you can offer 
                                    and how you can help them.
                                </p>

                            </div>

                            <textarea 
                                id="description" 
                                className='form-control' 
                                name="description" 
                                maxLength={80}
                                onChange={(event)=> setDescription(event.target.value)} 
                                required
                            />
                        </div>

                        <div className='input-wrapper'>
                            <div className="info">
                                <label htmlFor="category" className='form-label label '>Category</label>
                                <p className="form-label descriptive">
                                    Choose the category most 
                                    <br/>
                                    suitable for your Gig.
                                </p>
                            </div>
                        
                            <select 
                                className="form-select select-input-field" 
                                name="category" 
                                defaultValue="Select" 
                                onChange={(e) => setCategory(e.target.value)} 
                                required>

                                <option value="">All categories</option>
                                <option value="Administration">Administration</option>
                                {/* {jobCategories?.map(category => {
                                    return <option 
                                            value={category.name} 
                                            key={category.name}>
                                                    {category.name}
                                            </option>
                                })} */}
                            </select>
                        </div>

                        <div className='input-wrapper'>
                            <div className="info">
                                <label htmlFor="price" className='form-label label'>Price</label>
                                <p className="form-label descriptive">
                                    Set your price starting from
                                    <br/> 
                                    $100TTD
                                </p>
                            </div>
                        
                            <input 
                                id="price" 
                                className='form-control' 
                                type="number" 
                                name="price" 
                                style={{backgroundColor: "transparent", color: "black"}}
                                onChange={(event)=> setPrice(parseFloat(event.target.value))} //Convert string value to integer
                                step="0.01" min="0" 
                                required
                            />
                        </div>

                        <div className='input-wrapper'>
                            <div className="info">
                                <label 
                                    htmlFor="thumbnail-input" 
                                    className="form-label label thumbnail-label">
                                        Thumbnail:
                                </label>
                                <input 
                                    id="thumbnail-input" 
                                    type="file" 
                                    name="thumbnail" 
                                    accept="image/*"
                                    className="btn btn-secondary image-btn" 
                                    required
                                />
                            </div>
                        </div>

                    <button className="btn btn-primary submit-btn" type="submit">Create Job</button>
                </form>

            </main>

        </>
    )
}