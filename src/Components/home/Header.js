import Navbar from './Navbar'
import Logo from '../../static/images/logo2.png'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { getCategories, searchJobs } from '../utils/APIRoutes'
import { fetchCategories } from '../utils/reuseableCode';

export default function Header(){
    const navigate = useNavigate();

    const [jobCategories, setJobCategories] = useState([])
    const [jobCategory, setJobCategory] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [search, setSearch] = useState('');


    async function handleSearchSubmit(event){
        setIsSearching(true)
        console.log(`Searching for ${search}`)
        event.preventDefault();

        try{
            const response = await axios.post(searchJobs,{jobCategory, search})
             
            const data = await response.data;
                if(data.error){
                    console.error(data.error)
                }
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
       
        fetchCategories(setJobCategories, getCategories)
    }, [isSearching])



    return (
        <header className="header">
          <Navbar />

          {/* This is the red portion of the curve blending into green */}
          <div className="red-gradient">
              
              {/* Logo of the website */}
              <img className = "logo" src={Logo} alt="logo" />
              {/* Title of the website  */}
              {/* <h1 className="title"><b>Freelance</b></h1> */}

              <form className="search_form" onSubmit={handleSearchSubmit}>
                  {/* {% csrf_token %} */}
                  <input className="search" type="text" placeholder="Search for job..." name="search" required
                    onChange={(event)=> setSearch(event.target.value)}
                  />
                  <select name="category" className="category" defaultValue="All Categories" onChange={(e) => setJobCategory(e.target.value)}>
                      <option value="">All categories</option>
                      {jobCategories.map(category => {
                        return(
                             <option value={category.name} key={category.name}>{category.name}</option>
                        )
                      })}
                  </select>

                  <button className="search-btn" type="submit" title="search button">
                      <i className="fa fa-search"></i> {/*Search icon*/}
                  </button> 
              </form>
              
          </div>
      </header>
    )
}

