'use client'

// import '../../static/css/about/about.css'
import GlobalNavbar from '@components/GlobalNavbar'
import { SessionType } from "@utils/types";
import Person_Img from '@public/images/brandon.jpeg'
import GlobalFooter from '@components/GlobalFooter' 
import { useEffect, useState } from 'react'
import axios from 'axios'
import { getAboutInfo } from "@utils/APIRoutes"
import Image from 'next/image';

export default function AboutUsComponent(){
  
  const [session, setSession] = useState<SessionType>()
  const [information, setInformation] = useState<string>()

  async function about() {
    try {
      const response = await axios.get(getAboutInfo)
        const data = response.data

      if (data.error) {
        console.log(data.error)
        return
      } else setInformation(data.information)

    } catch (error) {
      console.log("Error:", error)
    }
  }

    useEffect(()=>{
     about()
    }, [])
    
    

  return(
    <>
      <GlobalNavbar session={session}/>

      <main className="about-main-container">

        <h1 className='title-item'>About NE1-FREELANCE</h1>

          <div className ="container">
            <div className ="image-item">
              <Image src = {Person_Img} alt='Person' layout='responsive'/>
            </div>

            <div className ="info-item">
              {information && information.length >= 1 ? (
                <p>{information}</p>)
                :(
                  <p>No Information Available</p>
              )}
            </div>

          </div>
            
      </main>
      <GlobalFooter/>

    </>
   
  )
}

