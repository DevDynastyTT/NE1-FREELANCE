import '../../static/css/searchResults/search_results.css'
import GlobalNavbar from '../GlobalNavbar'
import GlobalFooter from '../GlobalFooter'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { fetchJobs, fetchCategories } from '../utils/reuseableCode';
import { getAllJobs, getCategories, searchJobs } from '../utils/APIRoutes'


export default function Search({currentUser, setCurrentUser}){
    const navigate = useNavigate();

    let [jobs, setJobs] = useState([])
    const [jobCategories, setJobCategories] = useState([])
    const [jobCategory, setJobCategory] = useState('')

    const [search, setSearch] = useState('');

    let [message, setMessage] = useState('Finding available jobs')
    let [isSearching, setIsSearching] = useState(false)

       
        async function handleSearchSubmit(event){
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
                        navigate(url);

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
        <GlobalNavbar currentUser={currentUser} setCurrentUser={setCurrentUser}/>
        <br />
            <main className={`search-main-container search ${jobs.length === 0 && 'no-jobs'}`}>
                    {jobs && jobs.length <= 5 ? (
                        <div className="top-no-padding">
                        {/* <!-- This block is executed when there are no jobs found based on the search term --> */}
                        <h2>Available jobs</h2>

                        {/* <!--Search for jobs form--> */}
                        <form className="search-form row g-3" onSubmit={handleSearchSubmit}>
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

                    </div>
                    ): (
                        <div className="top-padding">
                        {/* <!-- This block is executed when there are no jobs found based on the search term --> */}
                        <h2>Available jobs</h2>

                        {/* <!--Search for jobs form--> */}
                        <form className="search-form row g-3" onSubmit={handleSearchSubmit}>
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

                    </div>
                    )}
                   
                    {/* End Top Div */}

                                        {/* Render jobs if there are no jobs available */}
                    {jobs && jobs.length > 0 && message !== "There are currently no jobs available" ? (
                        <div className="job-list-flex">
                        {jobs.map(function (job) {
                        return (
                            <div
                            className="job-card"
                            key={job.job_id}
                            onClick={() => navigate(`/jobs/search/details/${job.job_id}`)}
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
            <GlobalFooter/>

    </>
)
}
