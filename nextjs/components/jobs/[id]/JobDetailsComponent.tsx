'use client'

import '@styles/jobs/jobDetails.css'
import ReportForm from '../ReportForm';
import RatingForm from '../../RatingsForm';
// import StarRating from '../../StarRating';
import StarRatings from 'react-star-ratings';
import GlobalNavbar from "../../GlobalNavbar";

import { 
  AllRatings,
  Ratings, 
  JobDetails, 
  SessionType } from '@utils/types';

import {
    jobDetails, 
    getRatings, 
    getAllRatings, 
    getFreelancerRatings, 
    getFreelancerRatingsProgress}  from '@utils/APIRoutes'

import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getUserSession } from '@utils/reuseableCode';
import { useRouter, useParams } from 'next/navigation';
//TODO check if u can change the freeLancerRatingsProgress['5'] and others to a number instead of string

export default function JobDetailsComponent(){
  const router = useRouter()
  const {id} = useParams()
  const [session, setSession] = useState<SessionType>()
  
  // Job states
  let jobInfo:any = []
  const [jobs, setJobs] = useState<JobDetails[]>([])
  const [jobFee, setJobFee] = useState<number>(0)
  const [totalFee, setTotalFee] = useState<number>(0)
  const serviceFee:number = 2.50 //charges applied for business to make money

  // Ratings state
  const [stars, setStars] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0)
  const [averageRatingProgress, setAverageRatingProgress] = useState<number>(0)
  const [userRatings, setUserRatings] = useState<Ratings[]>([])
  const [allRatings, setAllRatings] = useState<AllRatings[]>([])
  const [freeLancerRatings, setFreeLancerRatings] = useState<number>(0)
  const [freeLancerRatingsProgress, setFreeLancerRatingsProgress] = useState<any>(0)

  const ratingCounts = {
      5: freeLancerRatingsProgress['5'] || 0, // Number of 5-star ratings
      4: freeLancerRatingsProgress['4'] || 0, // Number of 4-star ratings
      3: freeLancerRatingsProgress['3'] || 0, // Number of 3-star ratings
      2: freeLancerRatingsProgress['2'] || 0,  // Number of 2-star ratings
      1: freeLancerRatingsProgress['1'] || 0   // Number of 1-star ratings
    };
  const totalRatings = Object.values(ratingCounts).reduce((sum, count) => sum + count, 0);
  const starPercentages:any = {};
  // Form state
  const [formType, setFormType] = useState<string>('insert')
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [reportForm, setReportForm] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('Searching for available jobs')
  
  for (const [star, count] of Object.entries(ratingCounts)) {
    const percentage = (count / totalRatings) * 100;
    starPercentages[star] = Math.round(percentage);
  }
    
  
    
    function fetchRatings() {
      axios
        .post(getRatings, {
          jobID: jobs && jobs.length > 0 ? jobs[0]._id : null,
          freeLancerID: jobs && jobs.length > 0 ? jobs[0].freeLancerID : null ,
          clientID: session?._id,
        })
        .then((response) => {
          const data = response.data;
  
          if (data.error) {
            console.error(data.error);
            setMessage(data.error);
            return;
          }
  

          setUserRatings(data.totalRatings);
          console.log('User current rating', data.totalRatings);
        })
        .catch((error) => {
          console.log(error);
          setMessage(error);
        });
    }

    function fetchFreelancerRatingsProgress() {
      axios
        .post(getFreelancerRatingsProgress, {
          jobID: jobs && jobs.length > 0 ? jobs[0]._id : null,
          freeLancerID: jobs && jobs.length > 0 ? jobs[0].freeLancerID : null,
        })
        .then(response => {
          const data = response.data;
          if (data.error) {
            console.error(data.error);
            setMessage(data.error);
            return;
          }
          setFreeLancerRatingsProgress(data.freeLancerRatings);
          setAverageRatingProgress(Math.min(data.freeLancerRatings / 5, 5));
          console.log(data.freeLancerRatings);
        })
        .catch(error => {
          console.log(error);
          setMessage(error);
        });
    }
  
    function fetchAllRatings() {
      axios
        .post(getAllRatings, { 
          jobID: jobs && jobs.length > 0 ? jobs[0]._id : null,
          freeLancerID: jobs && jobs.length > 0 ? jobs[0].freeLancerID : null})
        .then((response) => {
          const data = response.data;
  
          if (data.error) {
            console.error(data.error);
            setMessage(data.error);
            alert(data.error)
            return;
          }
  
          setAllRatings(data.allRatings);
          console.log('ALL RATINGS!!')
          console.log(data.allRatings);
        })
        .catch((error) => {
          console.log(error);
          setMessage(error);
        });
    }

    function fetchFreelancerRatings(){
      axios
        .post(getFreelancerRatings, {
          jobID: jobs && jobs.length > 0 ? jobs[0]._id : null,
          freeLancerID: jobs && jobs.length > 0 ? jobs[0].freeLancerID : null,
        })
        .then(response => {
          const data = response.data;
          if (data.error) {
            console.error(data.error)
            setMessage(data.error)
            return
          }
          setFreeLancerRatings(data.freeLancerRatings)
          setAverageRating(Math.min(data.freeLancerRatings / 5, 5))
          console.log(data.freeLancerRatings)
        })
    }

    function fetchJobDetails() {
      console.log('Fetching Jobs');
  
      axios
        .get(`${jobDetails}/${id}`)
        .then((response) => {
          const data = response.data;
  
          if (data.error) {
            console.log(data.error);
            setMessage(data.error);
            return;
          }
          
          console.log(data.jobDetails, ' is job');
          setMessage(data.message);
          setJobs(data.jobDetails);
          setJobFee(data.jobDetails[0].price);
          setTotalFee(serviceFee + data.jobDetails[0].price);

          console.log(data.jobDetails);
        })
        .catch((error) => {
          console.log('Error Fetching Jobs: ' + error);
          setMessage(error);
        });
    }

    function renderReportForm(){
      if(reportForm){
        setReportForm(false)
        console.log('report Form is ', reportForm)
      }else if(!reportForm){
        setReportForm(true)
        console.log('report Form is ', reportForm)
      }
    }

    async function fetchUserSession(){
      const userSession = await getUserSession()
      setSession(userSession)
    }
    
    useEffect(() => {
      fetchUserSession()
      fetchJobDetails()
  }, []);
  
    useEffect(() => {
      if (jobs?.length > 0) {
        fetchRatings();
        fetchAllRatings();
        fetchFreelancerRatings()
        fetchFreelancerRatingsProgress()
        
      }
    }, [jobs]);

    //jobInfo will be sent the reportForm
    useEffect(()=> {
      if (jobs?.length > 0 && reportForm) {
        jobInfo.push({
          _id: (jobs && jobs?.length > 0) ? jobs[0]?._id : '',
          jobTitle: (jobs && jobs?.length > 0) ? jobs[0]?.title : '',
          userID: session?._id,
          freeLancerID: (jobs && jobs?.length > 0) ? jobs[0]?.freeLancerID : '',
        })
      }
    }, [jobs, reportForm])
    
    return(
      <>
        <GlobalNavbar session={session}/>

        <main className="jobsDetails-main-container">

          {jobs?.map((job, index) => (

            <div className="card" key={index++}>

              {/* Job information */}
              <section className="job">
                <div className="job-title-container">
                  <h1>{job?.title}</h1>
                  <div className="flex-wrapper">
                    <div className="freelancer-profile-picture-container">
                      {jobs && jobs.length > 0 && (
                        job.profilePicture == null ? 
                        <Image
                          id="title-profile-picture" 
                          src="http://localhost:3000/images/default.jpeg" 
                          alt="thumbnail" 
                          width={100}
                          height={100}
                          layout='responsive'
                        /> : 
                        <Image
                          id="title-profile-picture" 
                          src={job.profilePicture} 
                          alt="thumbnail" 
                          width={100}
                          height={100}
                          layout='responsive'
                        />
                      )}
                    </div>
                    <span className="userRating">
                      <span id='username'>{job.username}</span>
                      <span id='pipe'>|</span> 
                      <span className="starRatings">
                        <StarRatings
                          rating={averageRating}
                          starRatedColor="gold"
                          starEmptyColor="lightgrey"
                          starDimension="30px"
                          starSpacing="2px"
                        />
                        {averageRating} ({freeLancerRatings})
                      </span>
                    </span>
                  </div>
                </div>
                <br />
                <div className="thumbnail-container">
                  <div className="paper">
                    <img 
                      id="job-thumbnail" 
                      src={job.thumbnail} 
                      alt="thumbnail" 
                    />
                  </div>
                </div>
                <br/>


                {/* Ratings and Feedback */}
                <div className="ratings-list">
                  {session && userRatings && userRatings.length === 0 ? (
                    <RatingForm 
                      jobID={job._id} 
                      clientID={session._id} 
                      freeLancerID={job.freeLancerID} 
                      formType={formType}
                    />
                  ) : (
                    <div className="yourReview">
                      <h3>Your Review</h3>
                      <div>
                        <StarRatings
                          rating={userRatings[0]?.ratings}
                          starRatedColor="gold"
                          starEmptyColor="lightgrey"
                          starDimension="30px"
                          starSpacing="2px"
                        />
                      </div>
                      <p className="feedback">{(userRatings && userRatings.length > 0) ? userRatings[0].feedback : null}</p>
                      <button 
                        className="form-control editReview-btn" 
                        onClick={() => {
                          setFormType('update');
                          setUserRatings([]);
                        }}
                      >
                        Edit your review
                      </button>
                    </div>
                  )}
                  
                  <br/><br/>
                  <h2>Reviews</h2>

                  {allRatings && allRatings.length > 0 ? (
                    <>
                      {allRatings.map((rating, index) => (
                        <div className="ratings-card" key={index++}>
                          <span><b>{rating.username}</b></span>
                          <StarRatings
                            rating={rating.ratings}
                            starRatedColor="gold"
                            starEmptyColor="lightgrey"
                            starDimension="30px"
                            starSpacing="2px"
                          />
                          <p className="feedback-list">{rating.feedback}</p>
                        </div>
                      ))}
                    </>
                  ) : (
                    <p>User has no reviews</p>
                  )}
                </div>
              </section>

                {/* Render the report form if the user is logged in */}
                {jobs[0]?.freeLancerID !== session?._id && (                        
                  <>
                    {session && session?._id ? (
                      <>
                        <section className="payment-details">

                          <div className="job-title">

                            <div className="job-thumbnail">
                              <img src={`http://localhost:3000/images/${jobs[0].thumbnail}`} alt="" />
                            </div>
                        
                            <p>{jobs[0].title}</p>
                          </div>

                          <div className="prices">

                            <div className="job-fee">
                                <p className="cost">${jobFee.toFixed(2)}</p>
                              </div>

                            <div className="job-description">
                              <p>{jobs[0].description}</p>
                            </div>
                          </div>

                          <button 
                            type="button" 
                            className="form-control side-buttons"
                            onClick={()=> setReportForm(true)}>Report
                          </button>

                          <button 
                            type="submit" 
                            className="form-control side-buttons"
                            onClick={()=> router.push(`/jobs/${jobs[0]._id}/checkout`)}>
                              Continue -&gt;
                          </button>
                        </section>

                        {reportForm && <ReportForm showForm={true} setReportForm={setReportForm} jobInfo={jobInfo}/> }
                      </>
                      
                    ) : (
                      <button
                        className="form-control"
                        style={{
                          backgroundColor: "grey",
                          color: "white",
                          width: "auto",
                          height: "3rem",
                          cursor: "pointer",
                        }}
                        disabled
                      >
                       <Link 
                        href={"/auth/login"} 
                        style={{ 
                          textDecoration: "none",
                          color: 'white' }}> 
                          Log in to contact {jobs[0].username}
                        </Link>
                      </button>
                    )}
                  </>
                )}
            </div>
          ))}

        </main>
      </>
    )
}

//TODO add loading screen and match variable name syntaxes in mongo to the types
