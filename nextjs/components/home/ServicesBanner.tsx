'use client'

import { getAllServices } from '@utils/APIRoutes';
import {Services} from '@utils/types';
import Administration from '@public/images/administration.jpeg'
import Esthetics from '@public/images/esthetics.jpeg'
import Cleaning from '@public/images/cleaning.jpeg'
import Transportation from '@public/images/transportation.jpeg'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';

export default function ServicesBanner() {

    const [services, setServices] = useState<Services[]>()

    async function fetchServiceInfo() {
        try {
        const response = await axios.get(getAllServices);
        const data = response.data;
        setServices(data.serviceInfo);
        } catch (ex) {
        console.log(ex);
        }
    }

    useEffect(()=>{fetchServiceInfo()},[])

    return(
        <section className="services-section">
            {/* Display loading message if services has not been fetched yet */}
            <h2>{services ? 'Top Services' : "Top Services"}</h2>
            {/* <h2>{services ? 'Top Services' : "Loading Services..."}</h2> */}

            {/* Display each service */}
            {/* {services && (
                <div className="services">
                {services.map((service, index) => (
                    <div className={`service service${index++}`} key={index++}>

                        <p className="service-tagline">{service.title}</p>
                            <p className="service-title" id="transportation-title">{service.description}</p>

                            <Image 
                                className="service-Image" 
                                src={`http://localhost:3000/images/${service.thumbnail}`} 
                                alt="Transportation services Image"
                            />
                        </div>
                ))}
                   

                   
                    </div>
            )} */}
                <div className="services-container">

                    {/* Transportation Service */}
                    <div className="service service1">

                        <p className="service-tagline">Efficient Car Solutions!</p>
                            <p className="service-title" id="cleaning-title">Transportation</p>

                            <Image 
                                className="service-Image" 
                                src={Transportation} 
                                alt="Cleaning services Image"
                            />
                    </div>
                    {/* Cleaning Service */}
                    <div className="service service2">

                                <p className="service-tagline">Get your area cleansed!</p>
                                    <p className="service-title" id="cleaning-title">Cleaning</p>

                                    <Image 
                                        className="service-Image" 
                                        src={Cleaning} 
                                        alt="Cleaning services Image"
                                    />
                    </div>
                    {/* Esthetics Service */}
                    <div className="service service3">

                        <p className="service-tagline">Enhance your visual Appeal</p>
                            <p className="service-title" id="esthetics-title">Esthetics</p>

                            <Image 
                                className="service-Image" 
                                src={Esthetics} 
                                alt="ESthetics services Image"
                            />
                    </div>
                    {/* Administrative Service */}
                    <div className="service service4">

                        <p className="service-tagline service-tagline-4">Streamline your Operations</p>
                            <p className="service-title" id="administration-title">Administrations</p>

                            <Image className="service-Image" src={Administration} alt="Administration services Image"/>
                    </div>
                </div>
          
        </section> // End flexible-services
    )
}