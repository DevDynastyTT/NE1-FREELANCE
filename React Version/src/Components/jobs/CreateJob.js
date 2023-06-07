import '../../static/css/jobs/createjob.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import GlobalNavbar from '../GlobalNavbar'
import { fetchCategories, fetchCurrentUser } from "../utils/reuseableCode"
import { getCategories, createJob } from '../utils/APIRoutes'

import GlobalFooter from '../GlobalFooter'

export default function CreateJob({currentUser, setCurrentUser}){
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [thumbnail, setThumbnail] = useState('')
    const [category, setCategory] = useState('')
     const [jobCategories, setJobCategories] = useState([])

    const [price, setPrice] = useState(0)
    const [authToken, setAuthToken] = useState(localStorage.getItem('token'))
    const [userProfile, setUserProfile] = useState([])

    const [message, setMessage] = useState('')

    async function handleCreateJobSubmit(event) {
        event.preventDefault();
    
      
        const formData = new FormData()
        formData.append('user_id', currentUser._id)
        formData.append('title', title)
        formData.append('description', description)
        formData.append('price', price)
        formData.append('category', category)
        formData.append('thumbnail', event.target.thumbnail.files[0]);
      
        try {
          const response = await axios.post(createJob, formData)
          const data = response.data;
      
          if (data.error) {
            console.log(data.error);
            setMessage(data.error);
          } else if (data.message) {
            console.log(data.message);
            alert(data.message);
            navigate('/jobs/search')
          }
        } catch (error) {
          console.log(error);
          setMessage("Error creating job.");
        }
      }
      

    
    useEffect(()=>{
        fetchCategories(setJobCategories, getCategories)
      }, []);

    return(
        <>
            <GlobalNavbar currentUser={currentUser} setCurrentUser={setCurrentUser}/>
                <main className="createJob-main-container">

                    {/* CREATE JOB FORM */}
                    <form id="job_form" onSubmit={handleCreateJobSubmit} encType="multipart/form-data"> 
                        {message.length > 0 ? (
                                            <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                            <strong className="form-label">
                                                <i className="fa-solid fa-triangle-exclamation"></i>
                                            {message }</strong> 
                                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div> 
                        ): null}
                        {/* {% csrf_token %} */}
                            <div className='input-wrapper'>
                                <div className="info">
                                    <label htmlFor="title" className='form-label label'>Title</label>
                                    <p className="form-label descriptive">
                                    Your Gig title is like the storefront for your services, 
                                    and it is crucial to use relevant keywords that potential buyers 
                                    may search for when looking for a service similar to yours.
                                    </p>
                                </div>
                            
                                <input type="text" name="title" id="title" className='form-control' 
                                    onChange={(event) => setTitle(event.target.value)} required
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

                                        <textarea type="text" name="description" id="description" className='form-control' maxLength='80'
                                            onChange={(event)=> setDescription(event.target.value)} required
                                        />
                                    </div>

                                            <div className='input-wrapper'>
                                                <div className="info">
                                                    <label htmlFor="category" className='form-label label '>Category</label>
                                                    <p className="form-label descriptive">Choose the category most <br/>suitable for your Gig.</p>
                                                </div>
                                            
                                                <select className="form-select select-input-field" name="category" defaultValue="Select" onChange={(e) => setCategory(e.target.value)} required>
                                                    <option value="">All categories</option>
                                                    {jobCategories.map(category => {
                                                        return(
                                                            <option value={category.name} key={category.name}>{category.name}</option>
                                                        )
                                                    })}
                                                </select>
                                            </div>

                                                    <div className='input-wrapper'>
                                                        <div className="info">
                                                            <label htmlFor="price" className='form-label label'>Price</label>
                                                            <p className="form-label descriptive">Set your price starting from<br/> $100TTD</p>
                                                        </div>
                                                    
                                                        <input type="number" name="price" id="price" className='form-control' style={{backgroundColor: "transparent", color: "black"}}
                                                            onChange={(event)=> setPrice(event.target.value)} required
                                                            step="0.01" min="0" 
                                                        />
                                                    </div>

                            <div className='input-wrapper'>
                                <div className="info">
                                    <label htmlFor="thumbnail-input" className="form-label label thumbnail-label">Thumbnail:</label>
                                    <input id="thumbnail-input" type="file" name="thumbnail" accept="image/*"
                                    className="btn btn-secondary image-btn" required/>
                              </div>
                            </div>

                        <button className="btn btn-primary submit-btn" type="submit">Create Job</button>
                    </form>

                    </main>
                    <br/>
                    <GlobalFooter/>

        </>
      
       

    )
}