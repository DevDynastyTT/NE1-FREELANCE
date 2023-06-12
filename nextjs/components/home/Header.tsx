'use client'

import Navbar from './Navbar'
import Logo from '../../public/images/logo2.png'
import Image from 'next/image'
import { getCategories, searchJobs } from '../../utils/APIRoutes'
import { fetchCategories } from '../../utils/reuseableCode';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import Category from '../../utils/jobCategoryInterface'
import axios from 'axios'

export default function Header(){
    const router = useRouter()
    const [jobCategories, setJobCategories] = useState<Category[]>([]) // Add type annotation    const [jobCategory, setJobCategory] = useState([])
    const [jobCategory, setJobCategory] = useState<string>()
    const [isSearching, setIsSearching] = useState<boolean>(false)
    const [search, setSearch] = useState<string>();


    async function handleSearchSubmit(event: React.FormEvent){
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
                    router.push(url);

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
              <Image 
                className= "logo"
                src={Logo}
                alt="logo" 
                />
              {/* Title of the website  */}
              {/* <h1 className="title"><b>Freelance</b></h1> */}

              <form className="search_form" onSubmit={handleSearchSubmit}>
                  {/* {% csrf_token %} */}
                  <input className="search" type="text" placeholder="Search for job..." name="search" required
                    onChange={(event)=> setSearch(event.target.value)}
                  />
                  
                <select
                    name="category"
                    className="category"
                    defaultValue=""
                    onChange={(e) => setJobCategory(e.target.value)}
                ><option value="">All categories</option>
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

