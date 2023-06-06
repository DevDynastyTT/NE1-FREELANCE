import '../../static/css/searchResults/search_results.css';
import GlobalNavbar from '../GlobalNavbar'; 
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllJobs, getCategories, searchJobs, searchResults } from '../utils/APIRoutes'
import { fetchCategories } from '../utils/reuseableCode';

export default function Results({currentUser, setCurrentUser}) {
  const navigate = useNavigate();
  let { category, term } = useParams();

  if(category) {
    category = category.replace('category:', '')
  }
  if(term ){
    term = term.replace('term:', '')
}

  const [jobs, setJobs] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [jobCategory, setJobCategory] = useState('');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('Searching for available jobs');
  const [isSearching, setIsSearching] = useState(false);

  function fetchJobs() {
      axios.post(searchResults, {
        term, category
      })
      .then(response=>{
        const data = response.data;
        if (data.error) {
          setMessage(data.error);
          return;
        }
        setJobs(data.job_list);
      })
      .catch(error=> console.log('Error Fetching Jobs: ' + error));
    
  }


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

  useEffect(() => {
    fetchJobs();
    fetchCategories(setJobCategories, getCategories);
  }, [term, category]);


return(
    <>
        <GlobalNavbar currentUser={currentUser} setCurrentUser={setCurrentUser}/>
        <br />
        <main className='search-main-container search'>
                    {jobs && jobs.length <= 5 ? (
                        <div className="top-no-padding">
                        {/* <!-- This block is executed when there are no jobs found based on the search term --> */}
                        <h2>Search Results for "{term}"</h2>

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
                            key={job[0].job_id}
                            onClick={() => navigate(`/jobs/search/details/${job[0].job_id}`)}
                            >
                            {/* <!--Display the job's thumbnail--> */}
                            <div className="thumbnail-container" style={{ overflow: "hidden" }}>
                                <img src={`http://localhost:3000/images/${job[0].thumbnail}`} alt="job thumbnail" />
                            </div>

                            <div className="details">
                                {/* <!-- display the job title --> */}
                                <h3 className="title">{job[0].title}</h3>

                                <p className="username">
                                <b style={{ "marginRight": "1%" }}>User:</b> {job[0].username}
                                </p>
                                {/* <!-- display the job category --> */}
                                <p className="category">
                                <b>Category:</b> {job[0].category}
                                </p>

                                <hr style={{ "backgroundColor": "rgb(224, 224, 224)" }} />
                                <p className="price">${job[0].price}</p>
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
