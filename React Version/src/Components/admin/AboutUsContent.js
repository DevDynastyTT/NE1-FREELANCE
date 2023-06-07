import { useState } from "react";
import AdminNavbar from "../adminNav/AdminNavbar";
import { updateAbout } from "../utils/APIRoutes";
import '../../static/css/admin/adminforms.css'

export default function AboutUsContent(){

    const [information, setInformation] = useState('');

    const handleSubmit = async event => {
        //prevents page from reloading
        event.preventDefault();

        try{
            const response = await axios.post(updateAbout, {information})

            const data = await response.data;

            if(data.error){
                alert(data.error)
                console.log(data.error)
                return
            }
            alert(data.message)
            console.log(data.message)
        }catch(error){
            console.log(error)
        }
        }
    

    return(
        <>
            {/* <AdminNavbar/>
            <br /> */}
        <main className="about-container">



            <form id="about-content">
                {/* <label for="about-input">Select an Image:</label>
                <input type="file" id="about-image" name="about-image"/> */}
                <label htmlFor ="about-us-info">Update About Us Information:</label>
                <input type ="text" name="about-us-info" required onChange={event => setInformation(event.target.value)}
                placeholder="Enter information"></input>

                <button type="submit" onClick={handleSubmit}>Save Changes</button>

            </form>
        </main> 
        </>

    )
}

