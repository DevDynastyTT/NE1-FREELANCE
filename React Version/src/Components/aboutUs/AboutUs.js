import '../../static/css/about/about.css'
import GlobalNavbar from '../GlobalNavbar'
import Person_Img from '../../static/images/brandon.jpeg'
import GlobalFooter from '../GlobalFooter' 
import { useEffect, useState } from 'react'
import { getAboutInfo } from "../utils/APIRoutes"

export default function AboutUs({currentUser, setCurrentUser}){
  
  const [information, setInformation] = useState();

  async function about() {
    try {
      const response = await axios.get(getAboutInfo)
        const data = response.data

      if (data.error) {
        console.log(data.error);
        return
      } else setInformation(data.information);

    } catch (error) {
      console.log("Error:", error);
    }
  }

    useEffect(()=>{
     about()
    }, [])
    
    

  return(
    <>
      <GlobalNavbar currentUser={currentUser} setCurrentUser={setCurrentUser}/>

      <main className="about-main-container">

        <h1 className='title-item'>About NE1-FREELANCE</h1>

          <div className ="container">
            <div className ="image-item">
              <img src = {Person_Img} alt='Person'/>
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

