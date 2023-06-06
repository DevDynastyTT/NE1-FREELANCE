import { getAllServices } from '../utils/APIRoutes';
import { useEffect, useState } from 'react';


function ServicesBanner() {

    const [services, setServices] = useState()

async function fetchServiceInfo() {
    try {
      const response = await axios.get(getAllServices);
      const data = response.data;
      setServices(data.serviceInfo);
    } catch (ex) {
      console.log(ex);
    }
  }

  useEffect(()=>{
    fetchServiceInfo()
  },[])

    return(
        <div className="flexible-services">
            <h2>{services ? 'Top Services' : "Loading Services..."}</h2>
            {services && (
                <div className="services">
                {services.map((service, index) => (
                    <div className={`service service${index++}`} key={index++}>

                        <p className="service-tagline">{service.title}</p>
                            <p className="service-title" id="transportation-title">{service.description}</p>

                            <img className="service-img" src={`http://localhost:3000/images/${service.thumbnail}`} alt="Transportation services img"/>
                        </div>
                ))}
                   

                    {/* <div className="service service2">

                        <p className="service-tagline">Get your area cleansed!</p>
                            <p className="service-title" id="cleaning-title">Cleaning</p>

                            <img className="service-img" src={Cleaning_Img} alt="Cleaning services img"/>
                    </div>

                    <div className="service service3">

                        <p className="service-tagline">Enhance your visual Appeal</p>
                            <p className="service-title" id="esthetics-title">Esthetics</p>

                            <img className="service-img" src={Esthetics_Img} alt="ESthetics services img"/>
                    </div>

                    <div className="service service4">

                        <p className="service-tagline">Steamline your Operations</p>
                            <p className="service-title" id="administration-title">Administrations</p>

                            <img className="service-img" src={Administration_Img} alt="Administration services img"/>
                    </div> */}
                    </div>
            )}
          



        </div> // End flexible-services
    )
}

export default ServicesBanner;